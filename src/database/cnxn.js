// Importa las configuraciones de la base de datos
import db from './config';
// Módulo para conectar a SQL Server
const sql = require('mssql');

/**
 * Función que realiza la conexión a la base de datos
 * Utiliza las configuraciones importadas
 */
async function connect() {
    try {
        let pool = await sql.connect(db);
        return pool;
    } catch (err) {
        console.log('Conexión fallida: ', err.message)
        console.log('code: ', err.code)
        return null;
    }
}

/**
 * Esta función es el estándar para los errores, donde se verifica que el error es de tipo paámetros o de procedimiento almacenado
 * @param err Recibe el parametro de error de la función origian (petición a la base de datos)
 * @param res Recibe la respuesta original de la función para retornar
 */
function checkError(err, res) {
    if (err.code === "EREQUEST") res.status(403).json({
        ok: false,
        response: `Proceso fallido para el procedimiento almacenado ${err.procName}`,
        err: {
            code: err.originalError.info.number,
            message: err.originalError.info.message
        }
    });
    else if (err.code === "EPARAM") res.status(403).json({
        ok: false,
        response: 'Existe un error con los parámetros necesarios',
        err: {
            message: err.originalError.message
        }
    });
    else res.status(403).json({
        ok: false,
        response: 'Error desconocido',
        err: err
    })
}

/**
 * Esta función manda un error en caso de que no se pueda conectar a la base de datos
 * @param res Recibe la respuesta original de la función para retornar
 */
function errorBD(res) {
    res.status(500).json({
        ok: false,
        response: 'Error de conexión a la base de datos',
        err: {
            message: 'No se pudo conectar con la base de datos'
        }
    });
}

/**
 * Esta función es el estandar para cuando la información proporcionada es correcta en formato
 * Pero no se encuentra información que concuerde en la base de datos
 * @param res Recibe la respuesta original de la función para retornar
 */
function sinResultados(res) {
    res.status(204).json({
        ok: false,
        response: 'Sin información en la base de datos',
        err: {
            message: `No se encontró información para el parametro de filtro en la base de datos`
        }
    });
}

module.exports = {
    connect,
    checkError,
    errorBD,
    sinResultados,
    sql
}