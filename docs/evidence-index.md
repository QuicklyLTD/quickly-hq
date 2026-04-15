# Evidence Index

Bu dosya, dokumantasyondaki temel teknik iddialarin kaynak koddaki kanit noktalarini listeler.

## Server ve Router Mountlari

- HTTP app olusturma ve middleware zinciri: `src/server.ts:22`, `src/server.ts:30`, `src/server.ts:32`
- Router mountlari:
  - `/management`: `src/server.ts:40`
  - `/store`: `src/server.ts:41`
  - `/market`: `src/server.ts:42`
  - `/menu`: `src/server.ts:43`
  - `/order` (corsOptions + OrderMiddleware): `src/server.ts:44`
- Health endpointi: `src/server.ts:50`
- 404 fallback: `src/server.ts:51`

## CORS ve Rate Limit

- Global rate limit (`15 min / 1000`): `src/server.ts:32`
- `/order` icin allowlist tabanli CORS: `src/server.ts:44`, `src/configrations/cors.ts:18`
- `CORS_ORIGINS` birlestirme mantigi: `src/configrations/cors.ts:11`, `src/configrations/cors.ts:16`

## Auth ve Guard Davranislari

- Management `AuthenticateGuard` (admin hash bypass + session check): `src/middlewares/management.ts:8`, `src/middlewares/management.ts:11`, `src/middlewares/management.ts:14`
- `SchemaGuard` Joi validasyonu: `src/middlewares/management.ts:33`, `src/middlewares/management.ts:35`
- Store session guard: `src/middlewares/store.ts:9`, `src/middlewares/store.ts:12`
- Session expire kontrolu ve silme: `src/middlewares/store.ts:15`, `src/middlewares/store.ts:16`
- Store/owner iliski kontrolleri: `src/middlewares/store.ts:48`, `src/middlewares/store.ts:59`, `src/middlewares/store.ts:63`
- Market guardlari: `src/middlewares/market.ts:11`, `src/middlewares/market.ts:45`

## API Endpoint Kanitlari

- Management auth endpointleri: `src/routes/management.ts:29`, `src/routes/management.ts:33`, `src/routes/management.ts:37`
- Management remote database endpointleri: `src/routes/management.ts:112`, `src/routes/management.ts:116`, `src/routes/management.ts:120`, `src/routes/management.ts:124`
- Management invoice show/pdf endpointleri: `src/routes/management.ts:396`, `src/routes/management.ts:400`
- Store auth endpointleri: `src/routes/store.ts:33`, `src/routes/store.ts:37`, `src/routes/store.ts:41`, `src/routes/store.ts:45`
- Store `POST /backup` guard farki: `src/routes/store.ts:110`, `src/routes/store.ts:111`
- Store duplicate `GET /settings`: `src/routes/store.ts:58`, `src/routes/store.ts:66`
- Market endpointleri: `src/routes/market.ts:16`, `src/routes/market.ts:21`, `src/routes/market.ts:91`
- Menu endpointleri: `src/routes/menu.ts:9`, `src/routes/menu.ts:14`, `src/routes/menu.ts:18`, `src/routes/menu.ts:22`
- Social route dosyasi bos: `src/routes/social.ts:1`

## Veri Katmani ve Topoloji

- PouchDB plugin ve konfigurasyonlar: `src/configrations/database.ts:35`, `src/configrations/database.ts:44`
- `ManagementDB` tanimlari: `src/configrations/database.ts:48`
- `StoresDB` tanimlari: `src/configrations/database.ts:71`
- `SocialDB` tanimlari: `src/configrations/database.ts:91`
- `MenuDB` tanimlari: `src/configrations/database.ts:106`
- `StoreDB(store_id)` dinamik remote baglanti: `src/configrations/database.ts:119`
- `OrderMiddleware` (Express-PouchDB): `src/configrations/database.ts:134`

## Baslangic/Lifecycle ve Menu Init

- `initializeMenu()` cagrisi: `src/server.ts:54`
- `initializeMenu` CouchRadore lookup: `src/services/database.ts:6`
- `quickly-menu-app` replikasyonu: `src/services/database.ts:11`, `src/services/database.ts:12`
- `local_mutations` importu: `src/server.ts:101`

## Path ve Runtime Konfigurasyonlari

- Path resolve ve otomatik dizin olusturma: `src/configrations/paths.ts:10`, `src/configrations/paths.ts:16`
- Varsayilan path exportlari: `src/configrations/paths.ts:25`, `src/configrations/paths.ts:26`, `src/configrations/paths.ts:27`
- Access log path kurali: `src/configrations/paths.ts:21`
- APN key path: `src/configrations/paths.ts:31`

## Secret ve Guvenlik Risk Kanitlari

- Secret fallback modeli: `src/configrations/secrets.ts:1`, `src/configrations/secrets.ts:14`
- Odeme/SMS/e-fatura fallback degerleri: `src/configrations/secrets.ts:17`, `src/configrations/secrets.ts:26`, `src/configrations/secrets.ts:30`, `src/configrations/secrets.ts:33`
- Logger'in header/body kaydetmesi: `src/utils/logger.ts:25`

## Deploy Kanitlari

- FTPS env dosyasi ve zorunlu alanlar: `scripts/deploy-ftps.sh:6`, `scripts/deploy-ftps.sh:13`, `scripts/deploy-ftps.sh:14`, `scripts/deploy-ftps.sh:15`
- Varsayilan remote dir: `scripts/deploy-ftps.sh:18`
- `dist` mirror transferi: `scripts/deploy-ftps.sh:40`
- Opsiyonel dosya uploadlari: `scripts/deploy-ftps.sh:41`, `scripts/deploy-ftps.sh:42`, `scripts/deploy-ftps.sh:43`, `scripts/deploy-ftps.sh:44`
- Script cikis mesaji: `scripts/deploy-ftps.sh:48`
- `.deploy.env` ornek degerleri: `.deploy.env.example:1`, `.deploy.env.example:5`
