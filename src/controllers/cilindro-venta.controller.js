// Conexiones a la base de datos y algunos estandar de errores
const { connect, sql, checkError, errorBD, sinResultados } = require('../database/cnxn');
// Control del body
const _ = require('underscore');

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Hay varios mensajes de error que se pueden encontrar en el archivo en el archivo CNXN en la carpeta DATABASE      *
 * La función execute llama a procedimientos almacenados de SQL Server (revisar scripts)                             *
 *********************************************************************************************************************/

/**
 * OBTENER TODOS los activos involucrados en una [venta]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerCilindrosDeVenta = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('venta_id', sql.NVarChar, req.params.id)
        .execute('SelectCilindrosDeVenta')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * OBTENER TODOS los activos disponibles para una [venta]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerCilindrosParaVenta = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .execute('SelectCilindrosParaVenta')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * ACTUALIZAR el estado de un cilindro al momento de devolverlo
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto actualizado } }
 */
export const devolverCilindro = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    const body = _.pick(req.body, ['finalizado', 'cilindro_id', 'venta_id', 'fecha_retorno', 'demora_id']);
    let cilindroDB;
    let ventaDB;

    await pool.request()
        .input('fecha_retorno', sql.NVarChar, body.fecha_retorno)
        .input('cilindro_id', sql.NVarChar, body.cilindro_id)
        .input('demora_id', sql.NVarChar, body.demora_id)
        .input('estado', sql.NVarChar, body.finalizado)
        .input('venta_id', sql.NVarChar, body.venta_id)
        .execute('UpdateCilindroVenta')
        .then((result) => {
            if (result.recordset) cilindroDB = result.recordset[0];
        })
        .catch((err) => checkError(err, res));

    await pool.request()
        .input('venta_id', sql.NVarChar, body.venta_id)
        .execute('finalizarVenta')
        .then((result) => {
            if (result) ventaDB = result.recordset[0];
        })
        .catch((err) => checkError(err, res));

    res.json({
        ok: true,
        message: 'Petición finalizada',
        response: {
            cilindroDB,
            ventaDB
        }
    });

    pool.close();

};

/**
 * OBTENER TODOS los tipos de demora/atrasos
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: estado del objeto } }
 */
export const obtenerDemoras = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    /** Stored Procedure: Return */
    await pool.request()
        .execute('SelectDemoras')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};