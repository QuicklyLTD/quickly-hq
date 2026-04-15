# Operations Runbook

## Servis Sagligi

Hizli saglik kontrolu:

```bash
curl -sS http://127.0.0.1:3000/health
```

Beklenen cevap:

```json
{"ok":true}
```

## Log Kaynaklari

- Access log: `ACCESS_LOGS_PATH` (varsayilan `dist/access.log`)
- Uygulama ici hata kayitlari: logger altyapisi (`src/utils/logger`)

## Sik Incident Senaryolari

### 1) 401 Unauthorized artis

Kontrol:

- Authorization header var mi?
- Session kaydi mevcut mu (`StoresDB.Sessions` / `ManagementDB.Sessions`)?
- Session timeout'a dusmus mu?

Muhtemel kok neden:

- Token expiry
- Store header eksikligi
- Owner-store iliskisinin bozulmasi

### 2) CORS red hatalari

Kontrol:

- Istek origin'i `CORS_ORIGINS` veya whitelist icinde mi?
- `/order` cagrilarinda `corsOptions` aktif mi?

### 3) Store DB erisim hatalari

Kontrol:

- `management/stores` ve `management/databases` kayitlari dogru mu?
- CouchDB host/port/credential degerleri guncel mi?

### 4) Menu initialization basarisiz

Kontrol:

- `management/databases` icinde `codename: CouchRadore` var mi?
- Uzak DB `quickly-menu-app` erisilebilir mi?

## Operasyonel Komutlar

Yerel derleme dogrulamasi:

```bash
npm run build-ts
```

Manuel runtime:

```bash
npm run build && node dist/server.js
```

## Veri Guvenligi ve Yedekleme Notlari

- `DATABASE_PATH` altindaki veriler kritik oldugu icin deploy oncesi snapshot alinmalidir
- `BACKUP_PATH` duzenli backup joblari ile beslenmelidir
- `documents/` klasoru operasyonel dosya kaybi riskine karsi dis depolamaya yedeklenmelidir

## Degrade Modu Onerisi

Asagidaki durumlarda read-only fallback tanimlanmasi onerilir:

- CouchDB ulasilamazsa son bilinen cache verisinden menu sunumu
- Payment entegrasyonu gecici kapaliysa kritik satis akisini bozmayan uyari modu
