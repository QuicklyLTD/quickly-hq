import { CorsOptions } from 'cors';

const whitelist = [
    'https://qr.quickly.com.tr',
    'https://manage.quickly.com.tr',
    'https://quickly.cafe',
    'https://quickly.restaurant',
    'https://quickly.market',
];

const extraOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

const allowlist = new Set([...whitelist, ...extraOrigins]);

export const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowlist.has(origin)) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    },
    credentials: true,
}
