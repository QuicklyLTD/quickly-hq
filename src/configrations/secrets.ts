const fromEnv = (name: string, fallback: string = '') => {
    return process.env[name] ?? fallback;
};

const fromEnvNumber = (name: string, fallback: number) => {
    const rawValue = process.env[name];
    if (!rawValue) {
        return fallback;
    }
    const parsedValue = Number(rawValue);
    return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

export const AdminHash: string = fromEnv('ADMIN_HASH', '$2y$12$9pi4zxNqO8ydwx4/ucJk.OtMN/9CQqZ7sq6ojkY1P6ttB7YdmnwHW');
export const RECAPTCHA_SECRET: string = fromEnv('RECAPTCHA_SECRET', '6LeIMd0ZAAAAADX49SeapQIgcde5v8wzKwvRDj-M');

export const NESTPAY_USERNAME: string = fromEnv('NESTPAY_USERNAME', 'quicklyhq');
export const NESTPAY_SECRET: string = fromEnv('NESTPAY_SECRET', 'zUXnAMmP92Lj7yC');
export const NESTPAY_CLIENT_ID: number = fromEnvNumber('NESTPAY_CLIENT_ID', 700668268733);
export const NESTPAY_STORE_KEY: string = fromEnv('NESTPAY_STORE_KEY', '668268733');
export const NESTPAY_CUSTOMER: string = fromEnv('NESTPAY_CUSTOMER', '390108385');

export const eFaturaUserName: string = fromEnv('EFATURA_USERNAME', '63208717');
export const eFaturaSecret: string = fromEnv('EFATURA_SECRET', '454043');

export const NETGSM_USERNAME: string = fromEnv('NETGSM_USERNAME', '8503055352');
export const NETGSM_PASSWORD: string = fromEnv('NETGSM_PASSWORD', '68F64.3');
export const NETGSM_BRAND: string = fromEnv('NETGSM_BRAND', 'QUICKLY');

export const ISNET_USERNAME = fromEnv('ISNET_USERNAME', '16867951058');
export const ISNET_PASSWORD = fromEnv('ISNET_PASSWORD', 'Caner23!');

export const UYUMSOFT_USERNAME = fromEnv('UYUMSOFT_USERNAME', 'Uyumsoft');
export const UYUMSOFT_PASSWORD = fromEnv('UYUMSOFT_PASSWORD', 'Uyumsoft');

export const GOOGLE_GMAIL_KEY = {
    type: fromEnv('GOOGLE_GMAIL_TYPE', 'service_account'),
    project_id: fromEnv('GOOGLE_GMAIL_PROJECT_ID', 'tactile-shelter-250709'),
    private_key_id: fromEnv('GOOGLE_GMAIL_PRIVATE_KEY_ID', 'c5a7074ad681b41e5fb0bfd050304e02fb6796f4'),
    private_key: fromEnv('GOOGLE_GMAIL_PRIVATE_KEY', "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtChHPRLGf71Q5\nALq759OAonI3CEiioZKrAXicvbnnMLFT7mtWMc7HdXK1QXDgfv9t8JySbQ3LHsPE\nJkpQjIjakolvSgQNACzV5iXYnNdR4DjiaOMl8q6TYhcfU6IAOJJO6tv7xqIVatoa\ncvyOOJ9uQ+0Q6OCrREVvEZzO4oPeXG/V2j2wyT/7gr2tB2HOq3NtQL3ASHmOv2NA\nDfd94cQeMB28XsSTCaLli1RT9jfpfpCI9HP1aISYHUJzjtaAHerkKPs+Ye4I9MwK\nYfvjh52w5uJfT6sVoAvsSvgPWqUjtqSDe+clzE+RFNfNLevcC0Y+5f+eBSvCeCti\n0q4E2CKfAgMBAAECggEAA8z+UiaoniI0H+Jnt5videdbieDpM4VIAvCP1SWHsU/M\n/VJ10hla+N+YCuoqkAvKEYCg98hkbqs40pSiuj0z/lUMpsCh8SUpVvNsrmLXiela\nZoK2Ro2bjwovBtWf79BOSmR3O4MD6WOE8eLHsFoHCnV8fgwXbzubKNLitlqcWeR1\nmUYtt6o7ublufyz3aQvQO5F/w7sQazDjUXiIZp9O/VUweu1ouqfq2dEpBJebuEV3\nDlPfy7lz7jNrK2fC7n29J7nvft1k9jbV/hb4Z6TcAwwXh1U34WTc/XjamtQCbYoe\ndcs7nby7EZBklyBvGDr1XJDTVFYWsqE9RmlGdEhqJQKBgQDm4Vh0DzDXF78D3xnV\nniLkwp+ZclyQPDYK56/8spUqN5HQM03CQgaM2btqNW3lcV+oPpFfl+gS8r8wws5L\negVWK7aiEPhTwJzy3UFXN9nX7bUiy/uP6rOUPyC3FophOn2beSlFPDJ+pB8a03WV\nPYqdAxyndb/Nx61RJxj2LqiGTQKBgQC/3bG3hPjRd4VxUNMIw5EiBxCWhoFFIZN6\n9cgVcUZyIOr8Jy97DtRm6+NUERVLHDvWRte4Z5gocArc/gkhbl5bX5mFwv7Af6/u\nWjdoXNlQwrs0bfA2FyPillclBMwhInqRubomrM6Ufyad2Z2fgQ+J7fLMs8z2tHfR\nfgz4j1camwKBgBpbu7d0TIUh5uLQQ6jJpv4q4gGotryYwyq3jLXyxWjOc00rrkLx\nOsI10Vmsw+Ef8mXIztv1Ab+4Cu/MLbUcNyPBVdZmzZLyOHjZna4RaENolfdlBlFF\n4D6afmeooR+8h76KNJX8617d6dcsMQ5aukp2onzTypP5qeXL6uOgLAk5AoGBAK4b\ncFy3xs7WJfq5PHfUeAwn2w6tSftAx8Mp7AJBQ4rngjWFHZoO0AIBhs3PnsIFAeul\nZ7ZIE5SGb+UwhXqX2/oQ25C9bU2j0TN7HJKQxwd5XkXqibOb9g11HelS3CYpUo6Q\nunLEF8Y7SACv7FBE3qPskIrfklxBUgWB3CVmdcWHAoGBAInoP7atayeQhhvJ9NZI\nTI79lGz68VKtnpkhSRhLUPCjimg91jnYhh5pLdcuoZZEyGZEB+Chn1V2NeLQthrw\n4mLVlvragDk7t8zhmNG8ofwd2i5ohucKgTrTQ4+j64anZVfxAxlj7L9sHdfBuaWc\nMFXB6envb7SVYZ98Gn7qUiu6\n-----END PRIVATE KEY-----\n"),
    client_email: fromEnv('GOOGLE_GMAIL_CLIENT_EMAIL', 'hq-mailer-service@tactile-shelter-250709.iam.gserviceaccount.com'),
    client_id: fromEnv('GOOGLE_GMAIL_CLIENT_ID', '101771804009140167111'),
    auth_uri: fromEnv('GOOGLE_GMAIL_AUTH_URI', 'https://accounts.google.com/o/oauth2/auth'),
    token_uri: fromEnv('GOOGLE_GMAIL_TOKEN_URI', 'https://oauth2.googleapis.com/token'),
    auth_provider_x509_cert_url: fromEnv('GOOGLE_GMAIL_AUTH_PROVIDER_CERT_URL', 'https://www.googleapis.com/oauth2/v1/certs'),
    client_x509_cert_url: fromEnv('GOOGLE_GMAIL_CLIENT_CERT_URL', 'https://www.googleapis.com/robot/v1/metadata/x509/hq-mailer-service%40tactile-shelter-250709.iam.gserviceaccount.com')
}
