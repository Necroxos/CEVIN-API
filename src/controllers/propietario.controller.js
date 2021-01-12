const { connect, sql, checkError } = require('../database/cnxn');
// Control del body
const _ = require('underscore');

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Hay varios mensajes de error que se pueden encontrar en el archivo en el archivo CNXN en la carpeta DATABASE      *
 * La función execute llama a procedimientos almacenados de SQL Server (revisar scripts)                             *
 *********************************************************************************************************************/

/**
 * OBTENER TODOS los propietarios de [Activo.Propietario]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerTodos = async(req, res) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    await pool.request()
        .execute('SelectPropietarios')
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
 * OBTENER TODOS los propietarios de [Activo.Propietario] que tengan [activo = true]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerActivos = async(req, res) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    await pool.request()
        .execute('SelectPropietariosActivos')
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
 * INGRESAR un nuevo propietario
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, response: descripcion }
 */
export const ingresar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let body = _.pick(req.body, ['descripcion']);

    await pool.request()
        .input('descripcion', sql.NVarChar, body.descripcion)
        .execute('InsertPropietario')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Inserción correcta',
                response: req.body.descripcion
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * ACTUALIZAR un propietario
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, response: descripcion }
 */
export const actualizar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('descripcion', sql.NVarChar, req.body.descripcion)
        .input('id', sql.Int, req.body.id)
        .execute('UpdatePropietario')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Actualización correcta',
                response: {
                    descripcion: req.body.descripcion
                }
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * DESACTIVAR o ACTIVAR un propietario de la base de datos
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: estado del objeto } }
 */
export const cambiarEstado = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('activo', sql.Bit, req.body.activo)
        .input('id', sql.Int, req.body.id)
        .execute('ToggleStatusPropietario')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Cambio de estado',
                response: { activo: !!Number(req.body.activo) }
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};