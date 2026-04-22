import { Request, Response } from "express";
import axios from "axios";

import { ManagementDB, MenuDB, OrderDB, StoreDB, RemoteDB } from '../../configrations/database';
import { Database } from "../../models/management/database";
import { Store } from "../../models/management/store";
import { Check, CheckProduct, PaymentStatus } from "../../models/store/check";
import { Menu, OrderStatus, OrderType, Receipt, ReceiptStatus, User } from "../../models/store/menu";
import { MenuMessages } from "../../utils/messages";
import { processPurchase } from "../../configrations/payments";

const INTERNAL_ORDER_BASE_URL = process.env.INTERNAL_ORDER_BASE_URL || `http://127.0.0.1:${process.env.PORT || 3000}`;

export const requestMenuFromSlug = async (req: Request, res: Response) => {
    const Slug = req.params.slug;
    try {
        const Database: Database = await (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
        // Prefer in-memory cache (faster), but fall back to CouchDB if cache isn't initialized.
        let Menu: Menu;
        try {
            Menu = await MenuDB.Memory.get(Slug);
        } catch (e) {
            Menu = await RemoteDB(Database, 'quickly-menu-app').get(Slug);
        }

        const Store: Store = await ManagementDB.Stores.get(Menu.store_id);

        delete Store._id;
        delete Store._rev;
        delete Store.auth;
        delete Store.auth;
        delete Store.timestamp;
        delete Store.type;
        delete Store.status;
        delete Store.slug;

        delete Store.settings.allowed_tables
        delete Store.settings.allowed_products

        delete Store.status;
        delete Store.category;
        delete Store.cuisine;
        delete Store.accounts;

        delete Menu._id;
        delete Menu._rev;

        res.json({ store: Store, menu: Menu });
    } catch (error) {
        console.log(error);
        res.status(MenuMessages.MENU_NOT_EXIST.code).json(MenuMessages.MENU_NOT_EXIST.response);
    }
}

export const menuComment = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const FormData = req.body.comment;
    try {
        const sendComment = await (await StoreDB(StoreID)).post({ db_name: 'comments', ...FormData, timestamp: Date.now() });
        if (sendComment.ok) {
            res.json({ ok: true, message: 'Yorum Gönderildi' });
        }
    } catch (error) {
        res.json({ ok: false, message: 'Yorum İletilemedi Lütfen Tekrar Deneyiniz.' });
    }
}

export const listComments = async (req: Request, res: Response) => {
    const StoreID = req.params.storeId;
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const skip = Number(req.query.offset) || 0;
    try {
        const db = await StoreDB(StoreID);
        const result = await db.find({
            selector: { db_name: 'comments' },
            limit,
            skip
        });
        const docs = (result.docs || []).sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));
        res.json({ ok: true, docs });
    } catch (error) {
        console.log('listComments error:', error);
        res.status(404).json({ ok: false, docs: [], message: 'Yorumlar getirilemedi' });
    }
}

export const createReservation = async (req: Request, res: Response) => {
    const StoreID = req.params.storeId;
    const body = req.body || {};
    try {
        const db = await StoreDB(StoreID);
        const doc = {
            db_name: 'reservations',
            store_id: StoreID,
            name: String(body.name || '').trim(),
            surname: String(body.surname || '').trim(),
            phone: String(body.phone || '').trim(),
            date: Number(body.date) || Date.now(),
            guest_count: Math.max(1, Number(body.guest_count) || 1),
            floor_preference: body.floor_preference ? String(body.floor_preference) : undefined,
            note: body.note ? String(body.note) : undefined,
            status: 0, // PENDING
            timestamp: Date.now()
        };
        if (!doc.name || !doc.phone) {
            return res.status(400).json({ ok: false, message: 'Ad ve telefon zorunludur.' });
        }
        const result = await db.post(doc);
        res.json({ ok: true, id: result.id, message: 'Rezervasyon alındı' });
    } catch (error) {
        console.log('createReservation error:', error);
        res.status(500).json({ ok: false, message: 'Rezervasyon oluşturulamadı' });
    }
}

export const checkRequest = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const Token = req.params.token;
    try {
        const orderRequestType = await (await StoreDB(StoreID)).get(Token);
        switch (orderRequestType.db_name) {
            case 'checks':
                let Check = orderRequestType;
                // fetch('http://localhost:3000/order/' + Token, { method: 'GET' }).then(isOk => {
                //     res.status(200).json({ ok: true, token: Token, type: OrderType.INSIDE });
                // }).catch(async err => {
                //     const inMemoryOrderDB = await OrderDB(StoreID, Token, true);
                //     if (inMemoryOrderDB.name == Token) {
                //         res.status(200).json({ ok: true, token: Token, type: OrderType.INSIDE, check: Check });
                //     } else {
                //         res.status(200).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' });
                //     }
                // })
                axios.get(`${INTERNAL_ORDER_BASE_URL}/order/` + Token).then(ax_res => {
                    res.status(200).json({ ok: true, token: Token, type: OrderType.INSIDE });
                }).catch(async err => {
                    const inMemoryOrderDB = await OrderDB(StoreID, Token, true);
                    if (inMemoryOrderDB.name == Token) {
                        res.status(200).json({ ok: true, token: Token, type: OrderType.INSIDE, check: Check });
                    } else {
                        res.status(200).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' });
                    }
                });
                break;
            case 'customers':
                let Customer = orderRequestType;
                delete Customer._rev; delete Customer.db_name; delete Customer.db_seq; delete Customer.type, delete Customer._id;
                res.status(200).json({ ok: true, token: Token, type: OrderType.OUTSIDE, user: Customer });
                break;
            default:
                res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                break;
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
    }
}

export const payReceipt = async (req: Request, res: Response) => {
    const StoreID = req.headers.store;
    const Token: string = req.params.token;
    const StoreDatabase = await StoreDB(StoreID);
    const CreditCard: { number: string, name: string, expiry: string, cvc: string } = req.body.card;

    let Receipt: Receipt = req.body.receipt;

    processPurchase(CreditCard.number, CreditCard.expiry.slice(2), CreditCard.expiry.slice(0, 2), CreditCard.cvc, Receipt.total.toString()).then(async success => {
        console.log(success.OrderId, Receipt.user.id);
        try {
            const orderRequestType = await StoreDatabase.get(Token);
            switch (orderRequestType.db_name) {
                case 'checks':
                    const Database = await OrderDB(StoreID, Token, false);

                    let Check: Check = orderRequestType;
                    let User: User = Receipt.user;

                    let userItems = Receipt.orders.filter(order => order.status == OrderStatus.APPROVED);

                    userItems.map(obj => {
                        obj.status = OrderStatus.PAYED;
                        return obj;
                    })

                    /////////// Check Operations ////////////
                    let productsWillPay: Array<CheckProduct> = Check.products.filter(product => userItems.map(obj => obj.timestamp).includes(product.timestamp));

                    console.log(productsWillPay)

                    const newPayment: PaymentStatus = { owner: User.name, method: 'Kart', amount: Receipt.total, discount: Receipt.discount, timestamp: Date.now(), payed_products: productsWillPay };
                    if (Check.payment_flow == undefined) {
                        Check.payment_flow = [];
                    }
                    Check.payment_flow.push(newPayment);
                    Check.discount += newPayment.amount;
                    Check.products = Check.products.filter(product => !productsWillPay.includes(product));
                    Check.total_price = Check.products.map(product => product.price).reduce((a, b) => a + b, 0);

                    /////////// Check Operations ////////////

                    Receipt.status = ReceiptStatus.APPROVED;
                    Receipt.timestamp = Date.now();

                    Database.bulkDocs(userItems).then(order_res => {
                        Database.put(Receipt).then(isOK => {
                            StoreDatabase.put(Check).then(isCheckUpdated => {
                                if (isCheckUpdated.ok) {
                                    res.status(200).json({ ok: true, receipt: Receipt });
                                }
                            }).catch(err => {
                                console.log('Check Update Error on Payment Process', err);
                                res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                            })
                        }).catch(err => {
                            console.log('Receipt Update Error on Payment Process', err);
                            res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                        })
                    }).catch(err => {
                        console.log('Orders Update Error on Payment Process', err);
                        res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })

                    })
                    // TODO Delete items from Check to Payed
                    break;
                case 'customers':
                    let Customer = orderRequestType;
                    Receipt.status = ReceiptStatus.APPROVED;
                    delete Receipt.orders[0]._rev;
                    StoreDatabase.put(Receipt.orders[0]).then(order_res => {
                        Receipt.orders[0].status = OrderStatus.PREPARING;
                        delete Receipt._rev;
                        StoreDatabase.put(Receipt).then(isOk => {
                            res.status(200).json({ ok: true, receipt: Receipt });
                        }).catch(err => {
                            res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                        })
                    }).catch(err => {
                        res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                    })
                    break;
                default:
                    res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
                    break;
            }
        } catch (error) {
            console.log(error.CC5Response.ErrMsg);
            res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
        }
    }).catch(async err => {
        const Database = await OrderDB(StoreID, Token, false);
        Receipt.status = ReceiptStatus.CANCELED;
        Receipt.timestamp = Date.now();
        Database.put(Receipt).then(receipt_update => {
            Database.get(Receipt._id).then(receipt => {
                res.status(404).json({ ok: false, message: err.CC5Response.ErrMsg })
            }).catch(err => {
                console.log('Receipt Update Error on Payment Process', err);
                res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
            })
        }).catch(err => {
            console.log('Receipt Update Error on Payment Process', err);
            res.status(404).json({ ok: false, message: 'Hata Oluştu Tekrar Deneyiniz..' })
        })
    })

}
