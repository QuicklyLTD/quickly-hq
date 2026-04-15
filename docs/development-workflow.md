# Development Workflow

## Yerel Gelistirme

Kurulum:

```bash
npm ci
cp .env.example .env
```

Derleme:

```bash
npm run build-ts
```

Calistirma:

```bash
npm run dev
```

## Kod Organizasyonu

- Route: `src/routes/*`
- Middleware: `src/middlewares/*`
- Controller: `src/controllers/**`
- Model: `src/models/**`
- Fonksiyonel helperlar: `src/functions/**`
- Konfigurasyon: `src/configrations/*`

Yeni endpoint eklerken izlenecek sira:

1. Joi schema tanimi (`src/schemas`)
2. Controller implementasyonu
3. Middleware zinciri secimi
4. Route kaydi
5. Lokal smoke test
6. Dokumantasyon guncellemesi (`docs/api-reference.md`)

## Dogrulama Standardi

- Minimum gate: `npm run build-ts`
- API davranisi degistikse manuel smoke:

```bash
npm run build && node dist/server.js
```

## Kod Degisiklik Ilkeleri

- `AGENTS.md` kuralina gore operasyonel scriptleri (`fetch:*`, `upload:*`) gereksiz degistirme
- DB/path degisikliklerinde migration etkisini PR aciklamasinda belirt
- Secret veya credential dosyalarini asla commit etme

## Dokumantasyon Politikasi

- Her yeni route degisikliginde `docs/api-reference.md` guncellenir
- Konfigurasyon degisikliginde `docs/configuration.md` guncellenir
- Deploy akisinda degisiklik varsa `docs/deployment.md` guncellenir

## PR Kontrol Listesi Onerisi

- [ ] Build geciyor (`npm run build-ts`)
- [ ] Kritik endpoint smoke test edildi
- [ ] Dokumantasyon guncellendi
- [ ] Secret/credential dosyalari staged degil
- [ ] Riskli degisikliklerde rollback notu eklendi
