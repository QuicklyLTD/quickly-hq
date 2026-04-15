# Mimari

## Sistem Ozeti

`quickly-hq`, tek process uzerinde birden fazla is alani endpointini expose eden monolitik API servisidir.

- HTTP sunucu: `src/server.ts`
- Ana router mountlari:
  - `/management`
  - `/store`
  - `/market`
  - `/menu`
  - `/order` (Express-PouchDB middleware)
- Saglik kontrolu: `GET /health`

## Katmanlar

1. **Transport Katmani**
   - Express route tanimlari (`src/routes/*`)
   - Middleware zinciri (auth, store/account kontrolu, schema kontrolu)
2. **Application Katmani**
   - Controllerlar (`src/controllers/**`)
   - Domain use-case operasyonlari
3. **Data Access Katmani**
   - PouchDB baglantilari (`src/configrations/database.ts`)
   - CouchDB erisimi (`Nano` + `pouchdb-adapter-http`)
4. **Cross-Cutting Katman**
   - Logger, mesaj sabitleri, validasyon semalari, secret/path konfigurasyonlari

## Domain Sinirlari

- **management**: yonetim paneli, ana veriler, tenant/owner/store konfigurasyonu
- **store**: magaza kimligi ile calisan POS odakli operasyonlar
- **market**: stok ve tedarik odakli market endpointleri
- **menu**: public menu, yorum, captcha, odeme tetikleme
- **order**: Express-PouchDB ile live order/receipt dokuman akislarina ag gecidi

## Veri Topolojisi

`src/configrations/database.ts` icerisinde birden fazla DB grubu tanimlidir:

- `ManagementDB`: users, groups, stores, owners, products, invoices vb.
- `StoresDB`: store-level session/settings/info/invoice verileri
- `SocialDB`: sosyal/menu tabanli koleksiyonlar
- `UtilsDB`, `AdressDB`, `MenuDB`
- `StoreDB(store_id)`: ilgili store'un uzaktaki CouchDB koleksiyonuna dinamik baglanti
- `OrderDB(...)`: in-memory gecici DB + secili dokumanlar icin replication/sync

## Baslangic ve Lifecycle

Sunucu acilisinda:

1. Pathler ve log dizinleri olusturulur (`paths.ts`)
2. Global middlewareler uygulanir (compression, rate limit, body parser, query int)
3. Routerlar mount edilir
4. `initializeMenu()` calisir ve menu cache senkronizasyonu dener
5. `local_mutations.ts` import edilir (simdilik operasyonel helper alani)

## Teknik Borc ve Dikkat Noktalari

- `social` route dosyasi bos (`src/routes/social.ts`) ve `src/server.ts` icinde mount edilmiyor
- `store` route dosyasinda tekrar eden `GET /settings` tanimi bulunuyor
- Secret fallback degerleri kod icinde tanimli (`src/configrations/secrets.ts`)
- `local_mutations.ts` operasyonel helper kodlarini tek noktada topluyor; production guardlariyla ayrilmasi onerilir

## Dis Integrasyonlar

- NestPay (`src/configrations/payments.ts`)
- NetGSM (`src/configrations/sms.ts`)
- APN (`src/configrations/apn.ts`)
- e-Fatura servisleri (ISNET/Uyumsoft WSDL pathleri `paths.ts`)

## Mimari Karar Onerileri (ADR Backlog)

- [ ] Domain bazli moduler monolit yapisina gecis (`management`, `store`, `market`, `menu`)
- [ ] Controller + service + repository ayrimini standartlastirma
- [ ] Secret fallbacklarini kaldirip strict env validation ekleme
- [ ] Read/write operasyonlari icin audit event modeli ekleme
