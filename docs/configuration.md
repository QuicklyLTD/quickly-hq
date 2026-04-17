# Configuration

## Ortam Degiskenleri

Temel runtime ayarlari `.env` ile yonetilir. Baslangic noktasi: `.env.example`.

## Cekirdek Runtime Degerleri

- `PORT`: API portu (varsayilan `3000`)
- `HOST`: bind adresi (varsayilan `0.0.0.0`)
- `INTERNAL_ORDER_BASE_URL`: order ic servis URL'i
- `CORS_ORIGINS`: virgulle ayrilmis ek origin listesi

## Path Tabanli Degiskenler

`src/configrations/paths.ts` runtime sirasinda dizinleri otomatik olusturur.

- `DATABASE_PATH`
- `BACKUP_PATH`
- `DOCUMENTS_PATH`
- `ADDRESES_PATH`
- `CERTIFICATES_PATH`
- `CDN_MENU_PATH`
- `ACCESS_LOGS_PATH`
- `APN_AUTHKEY_PATH`

Notlar:

- Path degerleri absolute olarak resolve edilir
- Dizin olmayan pathler recursive olarak olusturulur

## Is Integrasyonu Secretlari

- Odeme: `NESTPAY_*`
- E-fatura: `EFATURA_*`, `ISNET_*`, `UYUMSOFT_*`
- SMS: `NETGSM_*`
- Captcha: `RECAPTCHA_SECRET`
- Admin bypass: `ADMIN_HASH`
- Gmail service account: `GOOGLE_GMAIL_*`

## Konfigurasyon Onceligi

1. Process env (`process.env`)
2. Kod icindeki fallback degerleri (`src/configrations/secrets.ts`)

Bu fallback yapisi teknik olarak calisabilir olsa da production guvenligi acisindan risklidir. Ayrintili risk listesi icin `security.md` dosyasina bakiniz.

## CORS Modeli

- Statik whitelist (`quickly.host` ve ilgili domainler)
- `.env` uzerinden gelen `CORS_ORIGINS`
- Set birlestirme ile final allowlist

`/order` mount noktasinda bu allowlist aktif olarak uygulanir.

## Session Konfigurasyonu

- Varsayilan session suresi: `604800000` ms (7 gun)
- Tanim: `src/configrations/session.ts`

## Ortam Profilleri Onerisi

- `local`: local pathler + localhost originleri
- `staging`: canliya yakin CORS + test entegrasyon secretlari
- `production`: sadece gerekli originler + tum fallback'ler kapali

## Konfigurasyon Dogrulama Checklist

- [ ] `.env` dosyasi mevcut
- [ ] Kritik secret alanlari bos degil
- [ ] Path izinleri yazma/okuma icin uygun
- [ ] `CORS_ORIGINS` degerleri gecerli URL formatinda
- [ ] `ACCESS_LOGS_PATH` yazilabilir durumda
