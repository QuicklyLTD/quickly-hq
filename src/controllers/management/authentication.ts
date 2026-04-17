import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ManagementDB, UtilsDB } from "../../configrations/database";
import { createSession } from "../../functions/shared/session";
import { User } from "../../models/management/users";
import { OtpCheck } from "../../models/utils/otp";
import { createLog, LogType } from '../../utils/logger';
import { SessionMessages } from "../../utils/messages";
import { sendSms } from "../../configrations/sms";

//////  /auth/login [POST]
export let Login = (req: Request, res: Response) => {
    let formData = req.body;
    ManagementDB.Users.find({ selector: { username: formData.username } }).then((users: any) => {
        if (users.docs.length > 0) {
            const User: User = users.docs[0];
            bcrypt.compare(formData.password, User.password, (err, same) => {
                if (!err && same) {
                    let session = createSession(User._id, req.ip);
                    ManagementDB.Sessions.find({ selector: { user_id: session.user_id } }).then(query => {
                        if (query.docs.length > 0) {
                            let tokenWillUpdate = query.docs[0];
                            session._id = tokenWillUpdate._id;
                            session._rev = tokenWillUpdate._rev;
                            ManagementDB.Sessions.put(session, {}).then(db_res => {
                                res.status(SessionMessages.SESSION_CREATED.code).json({ ...SessionMessages.SESSION_CREATED.response, ...{ token: db_res.id } });
                            }).catch(err => {
                                createLog(req, LogType.DATABASE_ERROR, err);
                                res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
                            });
                        } else {
                            ManagementDB.Sessions.post(session).then(db_res => {
                                res.status(SessionMessages.SESSION_CREATED.code).json({ ...SessionMessages.SESSION_CREATED.response, ...{ token: db_res.id } });
                            }).catch(err => {
                                createLog(req, LogType.DATABASE_ERROR, err);
                                res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
                            })
                        }
                    }).catch(err => {
                        createLog(req, LogType.DATABASE_ERROR, err);
                        res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
                    })
                } else {
                    createLog(req, LogType.INNER_LIBRARY_ERROR, err);
                    res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
                }
            });
        } else {
            res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
        }
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(SessionMessages.SESSION_NOT_CREATED.code).json(SessionMessages.SESSION_NOT_CREATED.response);
    });
};

//////  /auth/logout [POST]
export const Logout = (req: Request, res: Response) => {
    let AuthToken = req.headers.authorization;
    ManagementDB.Sessions.get(AuthToken.toString()).then(session => {
        ManagementDB.Sessions.remove(session).then(() => {
            res.status(SessionMessages.SESSION_DELETED.code).json(SessionMessages.SESSION_DELETED.response);
        }).catch(err => {
            createLog(req, LogType.DATABASE_ERROR, err);
            res.status(SessionMessages.SESSION_NOT_DELETED.code).json(SessionMessages.SESSION_NOT_DELETED.response);
        });
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(SessionMessages.SESSION_NOT_DELETED.code).json(SessionMessages.SESSION_NOT_DELETED.response);
    })
};

//////  /auth/verify [POST]
export const Verify = (req: Request, res: Response) => {
    let AuthToken = req.headers.authorization;
    ManagementDB.Sessions.get(AuthToken.toString()).then((session: any) => {
        if (session) {
            if (session.expire_date < Date.now()) {
                ManagementDB.Sessions.remove(session).then(() => {
                    res.status(SessionMessages.SESSION_EXPIRED.code).json(SessionMessages.SESSION_EXPIRED.response);
                }).catch(err => {
                    createLog(req, LogType.DATABASE_ERROR, err);
                    res.status(SessionMessages.SESSION_NOT_DELETED.code).json(SessionMessages.SESSION_NOT_DELETED.response);
                })
            } else {
                delete session._id, session._rev, session.timestamp;
                res.status(SessionMessages.SESSION_UPDATED.code).json({ ...SessionMessages.SESSION_UPDATED.response, ...{ data: session } });
            }
        } else {
            res.status(SessionMessages.SESSION_NOT_EXIST.code).json(SessionMessages.SESSION_NOT_EXIST.response);
        }
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(SessionMessages.SESSION_NOT_EXIST.code).json(SessionMessages.SESSION_NOT_EXIST.response);
    })
}

//////  /auth/forgot-password [POST]
export const ForgotPassword = (req: Request, res: Response) => {
    const phone_number: string = req.body.phone_number;

    ManagementDB.Users.allDocs({ include_docs: true }).then((result: any) => {
        const user = result.rows
            .map((r: any) => r.doc)
            .find((u: any) => u && u.phone_number === phone_number);

        if (user) {
            const code: number = Math.floor(1000 + Math.random() * 9000);
            const otpCheck: OtpCheck = { owner: user._id, code: code, expiry: Date.now() + 120000 };

            sendSms(phone_number, `Quickly HQ Dogrulama Kodunuz: ${code}`);

            UtilsDB.Otp.post(otpCheck).then(message => {
                res.status(200).json({ ok: true, id: message.id });
            }).catch(err => {
                createLog(req, LogType.DATABASE_ERROR, err);
                res.status(400).json({ ok: false, message: 'Sistem hatasi, tekrar deneyin' });
            });
        } else {
            res.status(404).json({ ok: false, message: 'Bu telefon numarasina kayitli kullanici bulunamadi' });
        }
    }).catch(err => {
        createLog(req, LogType.DATABASE_ERROR, err);
        res.status(400).json({ ok: false, message: 'Sistem hatasi' });
    });
};

//////  /auth/reset-password [POST]
export const ResetPassword = async (req: Request, res: Response) => {
    const otpId: string = req.body.otp_id;
    const verificationCode: string = req.body.verification_code;
    const newPassword: string = req.body.new_password;

    try {
        const otpCheck = await UtilsDB.Otp.get(otpId);

        if (otpCheck.expiry < Date.now()) {
            res.status(400).json({ ok: false, message: 'Dogrulama kodu suresi dolmus' });
            return;
        }

        if (otpCheck.code !== parseInt(verificationCode)) {
            res.status(400).json({ ok: false, message: 'Dogrulama kodu yanlis' });
            return;
        }

        const user = await ManagementDB.Users.get(otpCheck.owner);

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                createLog(req, LogType.INNER_LIBRARY_ERROR, err);
                res.status(400).json({ ok: false, message: 'Islem sirasinda hata olustu' });
                return;
            }
            bcrypt.hash(newPassword, salt, (err, hashedPassword) => {
                if (err) {
                    createLog(req, LogType.INNER_LIBRARY_ERROR, err);
                    res.status(400).json({ ok: false, message: 'Islem sirasinda hata olustu' });
                    return;
                }
                user.password = hashedPassword;
                ManagementDB.Users.put(user).then(() => {
                    UtilsDB.Otp.remove(otpCheck).catch(() => {});
                    res.status(200).json({ ok: true, message: 'Sifre basariyla degistirildi' });
                }).catch(err => {
                    createLog(req, LogType.DATABASE_ERROR, err);
                    res.status(400).json({ ok: false, message: 'Islem sirasinda hata olustu' });
                });
            });
        });
    } catch (error) {
        res.status(400).json({ ok: false, message: 'Gecersiz veya suresi dolmus dogrulama kodu' });
    }
};
