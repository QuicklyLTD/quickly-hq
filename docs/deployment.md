# Deployment

## Deployment Modeli

Proje, temel olarak FTPS tabanli artifact transfer modeli kullanir.

Akis:

1. TypeScript derleme (`dist/`)
2. `scripts/deploy-ftps.sh` ile hedefe yukleme
3. Script tamamlandiginda artifact transferi biter (`FTPS deploy completed` mesaji)

Not: Mevcut `scripts/deploy-ftps.sh` yalnizca dosya transferi yapar; uzaktaki process restart/symlink switch adimlari bu scriptte yoktur.

## On Kosullar

- `npm ci`
- `.deploy.env` dosyasi
- `lftp` kurulu olmali
- FTPS kimlik bilgileri dogru olmali

## Gerekli .deploy.env Alanlari

- `FTP_HOST`
- `FTP_USER`
- `FTP_PASS`

Opsiyonel:

- `FTP_PORT` (varsayilan `21`)
- `FTP_REMOTE_DIR` (varsayilan `/hq.quickly.host`)
- `DEPLOY_PACKAGE_JSON`
- `DEPLOY_WEB_CONFIG`
- `DEPLOY_RUNNER_SCRIPT`
- `DEPLOY_TASK_SETUP_SCRIPT`

## Deploy Komutlari

Build:

```bash
npm run build-ts
```

Deploy:

```bash
npm run deploy
```

Scriptin yaptiklari:

- `dist/` klasorunu mirror eder
- flaglere gore ek dosyalari yukler
- FTPS SSL zorlamasi ile baglanir

## Release Stratejisi Onerisi

Mevcut script FTPS transfer yapiyor; modern bir release guvencesi icin asagidaki katmanlar eklenmelidir:

- [ ] versioned release klasorleri (`releases/<timestamp>`)
- [ ] `current` symlink switch yaklasimi
- [ ] canary/smoke check (`/health`) sonrasi trafik acma
- [ ] otomatik rollback komutu

## Sonraki Seviyede CI/CD Onerisi

- Build + static kontrol + package imzalama
- Secretlarin CI vault'tan okunmasi
- Deploy sonrasi endpoint smoke testleri
- Basarisiz smoke testte otomatik rollback

## Deployment Sonrasi Dogrulama

- `GET /health` -> `200 { ok: true }`
- Access log akisi aktif
- Store login/verify akislari calisiyor
- Kritik endpointlerden en az birer smoke testi geciyor
