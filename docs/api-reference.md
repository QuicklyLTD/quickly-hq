# API Reference

## Genel Davranis

- Base URL (production): `https://hq.quickly.host`
- Health: `GET /health`
- 404 fallback: tanimsiz tum endpointler `404`
- JSON body limiti: `10240kb`
- Rate limit: 15 dakikada 1000 istek/IP (`express-rate-limit`)
- CORS davranisi:
  - `/management`, `/store`, `/market`, `/menu`: `cors()` (genis acik)
  - `/order`: `cors(corsOptions)` (allowlist tabanli)

## Middleware ve Auth Modeli

- `AuthenticateGuard` (management):
  - `Authorization` header'i `ADMIN_HASH` ile eslesirse bypass
  - veya `ManagementDB.Sessions` icinde session aranir
- `StoreAuthenticateGuard` (store/market):
  - `StoresDB.Sessions` icinde token arar
  - session suresi dolmussa siler ve `SessionMessages` icindeki ilgili kodu doner
- `StoreGuard` / `MarketStoreGuard`:
  - `store` header'indan gelen store id'nin varligini dogrular
- `AccountGuard`:
  - owner-store iliskisini dogrular
- `SchemaGuard`:
  - Joi schema ile `req.body` dogrular

## Header Sozlesmeleri

- `Authorization`: session token veya admin hash
- `store`: store id (store/market/menu'nin bazi endpointlerinde zorunlu)

## Endpoint Envanteri

Asagidaki liste route seviyesindeki resmi envanterdir.

### Management (`/management`)

Auth:

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/verify`

CRUD domainleri (tekil + liste + create/update/delete):

- `account`, `owner`, `database`, `user`, `group`, `store`, `product`, `supplier`, `producer`, `brand`, `campaign`, `category`, `sub_category`, `invoice`, `company`

Ornekler:

- `GET /account/:id`, `GET /accounts`, `POST /account`, `PUT /account/:id`, `DELETE /account/:id`
- `GET /store/:id/query` (store dokuman sorgulama)
- `GET /database/remote/:id`
- `GET /database/remote/:id/:db`
- `PUT /database/remote/:id/:db`
- `GET /database/social/:db`

Session/util endpointleri:

- `GET /session/:id`
- `DELETE /session/:id`
- `GET /sessions`
- `GET /invoice/show/:id` (auth middleware yorum satirinda)
- `GET /invoice/pdf/:id` (auth middleware yorum satirinda)
- `GET /address/:country?/:state?/:province?/:district?`
- `GET /utils/images/:text`
- `GET /utils/logs/errors`
- `GET /utils/logs/access`
- `GET /utils/venues/:text`
- `GET /utils/currency/:currency?`
- `GET /utils/tapdk/:id`

### Store (`/store`)

Auth:

- `POST /login`
- `POST /logout`
- `POST /verify`
- `POST /refresh`
- `POST /message`
- `POST /change`

Settings ve profile:

- `GET /settings`
- `POST /settings`
- `GET /agreements/:type`

Operasyonel endpointler:

- `POST /endday`
- `POST /backup` (`StoreGuard` var, `StoreAuthenticateGuard` yok)
- `GET /list`
- `GET /info`
- `GET /infos`

Raporlar:

- `GET /reports/products/:start?/:end?`
- `GET /reports/users/:start?/:end?`
- `GET /reports/tables/:start?/:end?`
- `GET /reports/activities/:start?/:end?`
- `GET /reports/sales/:start?/:end?`
- `GET /reports/day/:start?/:end?`

Generic dokuman endpointleri:

- `GET /db/:db_name/:id`
- `POST /db/:db_name`
- `PUT /db/:db_name/:id`
- `DELETE /db/:db_name/:id`
- `GET /db/:db_name`

Menu/order/receipt/cashbox:

- `GET /menu/:store`
- `POST /menu/:store`
- `POST /menu/upload/:store`
- `POST /order/accept`
- `POST /order/approovee`
- `POST /order/cancel`
- `POST /receipt/accept`
- `POST /receipt/approovee`
- `POST /receipt/cancel`
- `GET /cashbox/:id`
- `POST /cashbox`
- `PUT /cashbox/:id`
- `DELETE /cashbox/:id`
- `GET /cashbox`

Invoice:

- `GET /invoice/:id`
- `GET /invoices`

### Market (`/market`)

Read odakli endpointler:

- `GET /product/:id`, `GET /products`
- `GET /supplier/:id`, `GET /suppliers`
- `GET /producer/:id`, `GET /producers`
- `GET /brand/:id`, `GET /brands`
- `GET /campaigns`
- `GET /category/:id`, `GET /categories`
- `GET /sub_category/:id`, `GET /sub_categories`

Stok hareketi:

- `POST /add_stock/:product_id/:quantity`

### Menu (`/menu`)

- `POST /comment/new` (captcha kontrolu ile)
- `POST /check/:token`
- `POST /payment/:token`
- `GET /slug/:slug`

### Order (`/order`)

- `Express-PouchDB` middleware mount edilir
- CORS, `corsOptions` allowlist'i ile sinirlanir
- Bu alan order/receipt canli dokuman sinkronizasyonu icin kullanilir

## Hata Semantigi

- Auth ve session hatalari: `SessionMessages` uzerinden doner
- Schema hatalari: `400 { ok: false, message: <joi error> }`
- JSON parse hatalari: `500 { msg: 'Unvalid JSON Schema!' }`

## Su Anda Aktif Olmayan Route Alani

- `src/routes/social.ts` dosyasi bos ve `src/server.ts` tarafinda mount edilmedigi icin `/social` endpointi aktif degil.

## API Tuketici Notlari

- Store/market endpointlerinde tokena ek olarak `store` header'i zorunludur
- Token timeout davranisi middleware seviyesinde uygulanir
- Query tabanli endpointlerde `limit`/`skip` semasi desteklenir (QueryGuard pattern'i)
