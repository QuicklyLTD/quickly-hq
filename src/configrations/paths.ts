import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(__dirname, '../..');

const ensureTrailingSeparator = (value: string) => {
    return value.endsWith(path.sep) ? value : value + path.sep;
};

const resolveRuntimePath = (envName: string, defaultPath: string) => {
    const rawValue = process.env[envName];
    const resolvedPath = rawValue ? path.resolve(rawValue) : defaultPath;
    return ensureTrailingSeparator(resolvedPath);
};

const ensureDirectory = (targetPath: string) => {
    fs.mkdirSync(targetPath, { recursive: true });
    return ensureTrailingSeparator(targetPath);
};

export const ACCESS_LOGS = process.env.ACCESS_LOGS_PATH
    ? path.resolve(process.env.ACCESS_LOGS_PATH)
    : path.join(projectRoot, 'dist', 'access.log');

export const DATABASE_PATH = ensureDirectory(resolveRuntimePath('DATABASE_PATH', path.join(projectRoot, 'db')));
export const BACKUP_PATH = ensureDirectory(resolveRuntimePath('BACKUP_PATH', path.join(projectRoot, 'backup')));
export const DOCUMENTS_PATH = ensureDirectory(resolveRuntimePath('DOCUMENTS_PATH', path.join(projectRoot, 'documents')));
export const ADDRESES_PATH = ensureDirectory(resolveRuntimePath('ADDRESES_PATH', path.join(projectRoot, 'address')));
export const CERTIFICATES_PATH = ensureDirectory(resolveRuntimePath('CERTIFICATES_PATH', path.join(projectRoot, 'certificates')));

export const APN_AUTHKEY_PATH = process.env.APN_AUTHKEY_PATH
    ? path.resolve(process.env.APN_AUTHKEY_PATH)
    : path.join(CERTIFICATES_PATH, 'AuthKey_788GCC9YS7.p8');

export const CDN_MENU_PATH = ensureDirectory(resolveRuntimePath('CDN_MENU_PATH', path.join(projectRoot, 'public', 'quickly-menu')));

// E Invoice Integration Paths
export const UYUMSOFT_WSDL_URL = "https://efatura-test.uyumsoft.com.tr/Services/Integration?wsdl";
export const UYUMSOFT_WSDL_PATH = path.join(projectRoot, 'src', 'integration', 'uyumsoft.wsdl');

export const ISNET_WSDL_URL = "http://einvoiceservicetest.isnet.net.tr/InvoiceService/ServiceContract/InvoiceService.svc?singleWsdl";
export const ISNET_WSDL_PATH = path.join(projectRoot, 'src', 'integration', 'isnet.wsdl');
