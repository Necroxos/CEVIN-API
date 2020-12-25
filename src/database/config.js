import { config } from 'dotenv';
config();

/**
 * Entorno
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Vencimiento del Token
 */

process.env.CADUCIDAD_TOKEN = '1d';

/**
 * Secret para generar Tokens
 */

process.env.SEED = process.env.SEED || 'secret-desarrollo';

/**
 * Puerto API
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * Base de Datos
 */

const db = {
    user: String(process.env.DB_USER),
    password: String(process.env.DB_PASS),
    server: String(process.env.DB_SERVER),
    database: String(process.env.DB_NAME),
    port: Number(process.env.DB_PORT),
    options: {
        enableArithAbort: true
    }
}

export default db;