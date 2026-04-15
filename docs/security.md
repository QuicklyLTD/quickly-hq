# Security

## Guvenlik Ozeti

Proje temel guvenlik kontrollerini (rate-limit, session guard, schema validation, CORS) uygulasa da, production seviyesinde kapatilmasi gereken onemli riskler vardir.

## Mevcut Kontroller

- Rate limiting (`express-rate-limit`)
- Auth/session guardlari
- Joi schema validasyonu
- CORS allowlist
- JSON parse hata yakalama

## Kritik Riskler

### 1) Hardcoded secret fallback'leri

`src/configrations/secrets.ts` dosyasinda fallback olarak gercek secret degerlerine benzeyen alanlar mevcut.

Risk:

- Kaynak koddan secret sizdirma
- Ortam degiskeni eksikse fark edilmeden fallback ile calisma

Aksiyon:

- [ ] Tum fallback degerleri kaldirilmali
- [ ] Secretlar zorunlu env olarak fail-fast dogrulanmali

### 2) Admin hash bypass modeli

`AuthenticateGuard`, `Authorization == AdminHash` ise session kontrolunu bypass eder.

Risk:

- Tek degerli master token ile yuksek etki alani

Aksiyon:

- [ ] Admin bypass kaldirilmali veya kisa omurlu signed token modeli uygulanmali

### 3) Genis CORS konfig riski

`CORS_ORIGINS` env degeri kontrolsuz sekilde buyutulebilir.

Aksiyon:

- [ ] Origin whitelist governance'i (allowlisted env policy) uygulanmali

### 4) Loglarda hassas veri riski

Request body/headers loglanmiyorsa bile hata loglarinda hassas degerler sizabilir.

Aksiyon:

- [ ] Logger redaction kurallari eklenmeli (token, password, card alanlari)

## Guvenlik Hardening Backlog

- [ ] `zod` veya `joi` ile merkezi env validation startup gate'i
- [ ] Secret manager entegrasyonu (Vault/Cloud Secrets)
- [ ] Dependency vulnerability taramasi (SCA) CI pipeline'a eklenmeli
- [ ] Auth denemeleri icin brute-force alarm kurallari
- [ ] Audit log standardi (kim, neyi, ne zaman degistirdi)
- [ ] Data-at-rest encryption ve key rotation plani

## Olay Mudahale Kisa Plani

1. Etki alani tespiti (hangi endpoint/veri etkilendi)
2. Gecici containment (token rotate, route disable, origin daraltma)
3. Kok neden analizi
4. Kalici duzeltme + regression kontrolu
5. Olay raporu ve takip maddeleri
