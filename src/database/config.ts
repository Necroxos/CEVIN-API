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
 * Base de Datos
 */

const config = {
    user: 'Dratt',
    password: 'zerox971123',
    server: '192.168.0.9',
    database: 'Cevin_Tracking',
    port: 1433,
    options: {
        enableArithAbort: true
    }
}

export default config;