# quickly-hq

Quickly ekosisteminin merkezi API servisidir. Proje; management paneli, magazalar, menu/public istemcileri ve market akislarini tek bir Node.js + TypeScript backend uzerinden sunar.

## Icerik

- [Hizli baslangic](#hizli-baslangic)
- [Teknik ozet](#teknik-ozet)
- [Dokumantasyon haritasi](#dokumantasyon-haritasi)
- [Calistirma komutlari](#calistirma-komutlari)
- [Konfigurasyon dosyalari](#konfigurasyon-dosyalari)
- [Dogrulama ve kalite kapilari](#dogrulama-ve-kalite-kapilari)
- [Deploy ozeti](#deploy-ozeti)

## Hizli baslangic

```bash
npm ci
cp .env.example .env
npm run build-ts
npm run start
```

Yerel smoke test:

```bash
curl http://127.0.0.1:3000/health
```

## Teknik ozet

- Runtime: `Node.js` + `Express` + `TypeScript`
- Veri katmani: `PouchDB` (yerel) + `CouchDB` (uzak) + `Nano`
- Domain alanlari: `management`, `store`, `market`, `menu`, `order`
- Guvenlik: oturum tabanli guardlar, Joi schema validasyonu, rate-limit, CORS allowlist
- Gozlemlenebilirlik: morgan access log + uygulama ici hata loglari

## Dokumantasyon haritasi

- Dokuman merkezi: `docs/README.md`
- Mimari ve moduller: `docs/architecture.md`
- API yuzeyi ve endpoint envanteri: `docs/api-reference.md`
- Ortam degiskenleri ve runtime pathleri: `docs/configuration.md`
- Deploy, release ve rollback: `docs/deployment.md`
- Operasyon runbook ve troubleshooting: `docs/operations-runbook.md`
- Guvenlik notlari ve hardening plani: `docs/security.md`
- Gelistirici is akisi ve katkida bulunma: `docs/development-workflow.md`

## Calistirma komutlari

- `npm run dev`: TypeScript watch + nodemon
- `npm run build`: temiz derleme (`dist/`)
- `npm run build-ts`: deploy oncesi derleme akisi
- `npm run start`: derlenmis uygulamayi calistirir (`dist/server.js`)
- `npm run verify`: minimum kalite kapisi (`npm run build`)
- `npm run deploy`: derle + FTPS uzerinden paket yukle

## Konfigurasyon dosyalari

- `.env.example`: runtime konfigurasyon sablonu
- `.deploy.env.example`: FTPS deploy konfigurasyon sablonu
- `.env`: local/production runtime degerleri (commit edilmez)
- `.deploy.env`: deploy kimlik bilgileri (commit edilmez)

Commit disi tutulmasi gereken dizin/dosyalar:

- `db/`, `backup/`, `documents/`, `dist/`
- `.env`, `.deploy.env`

## Dogrulama ve kalite kapilari

- Minimum: `npm run build-ts`
- API davranisi degistiginde: `npm run build && node dist/server.js`
- Saglik endpointi: `GET /health`

## Deploy ozeti

FTPS tabanli deploy scripti: `scripts/deploy-ftps.sh`

- Varsayilan hedef host: `.deploy.env` icindeki `FTP_HOST`
- Varsayilan hedef dizin: `FTP_REMOTE_DIR` (varsayilan `/hq.quickly.host`)
- Zorunlu alanlar: `FTP_HOST`, `FTP_USER`, `FTP_PASS`

Opsiyonel uploadlar:

- `package.json`
- `web.config.deploy` -> `web.config`
- `run-quickly-hq.ps1`
- `setup-quickly-hq-task.ps1`

Detayli release/deploy stratejisi icin `docs/deployment.md` dosyasina bakiniz.
