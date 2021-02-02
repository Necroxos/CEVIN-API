const { connect, sql, checkError } = require('../database/cnxn');
// Control del body
const _ = require('underscore');

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Hay varios mensajes de error que se pueden encontrar en el archivo en el archivo CNXN en la carpeta DATABASE      *
 * La función execute llama a procedimientos almacenados de SQL Server (revisar scripts)                             *
 *********************************************************************************************************************/

/**
 * INGRESAR un nuevo costo a un tipo de gas
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, response: descripcion }
 */
export const ingresar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let body = _.pick(req.body, ['costo', 'tipo_id']);

    await pool.request()
        .input('costo', sql.NVarChar, body.costo)
        .input('tipo_id', sql.Int, body.tipo_id)
        .execute('InsertCostoUnitario')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Inserción correcta',
                response: req.body.costo
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * ACTUALIZAR un tipo de gas
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, response: descripcion }
 */
export const actualizar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let body = _.pick(req.body, ['costo', 'tipo_id']);

    await pool.request()
        .input('costo', sql.NVarChar, body.costo)
        .input('tipo_id', sql.Int, body.tipo_id)
        .execute('UpdateCostoUnitario')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Inserción correcta',
                response: req.body.costo
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};