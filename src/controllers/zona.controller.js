const { connect, sql, checkError } = require('../database/cnxn');
// Control del body
const _ = require('underscore');

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Hay varios mensajes de error que se pueden encontrar en el archivo en el archivo CNXN en la carpeta DATABASE      *
 * La función execute llama a procedimientos almacenados de SQL Server (revisar scripts)                             *
 *********************************************************************************************************************/

/**
 * Realizamos la petición GET para OBTENER TODAS las zonas de [Direccion.Zona]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerTodos = async(req, res) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    await pool.request()
        .execute('SelectZonas')
        .then((result) => {
            if (result.recordset) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * Realizamos la petición GET para OBTENER TODAS las zonas de [Direccion.Zona] que tengan [activo = true]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerActivos = async(req, res) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    await pool.request()
        .execute('SelectZonasActivas')
        .then((result) => {
            if (result.recordset) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * Realizamos la petición GET para OBTENER las zonas de [Direccion.Zona] en base a una comuna
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerPorComuna = async(req, res) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    await pool.request()
        .input('comuna_id', sql.NVarChar, req.params.id)
        .execute('SelectZonasPorComuna')
        .then((result) => {
            if (result.recordset) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * INGRESAR una nueva zona
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, response: descripcion }
 */
export const ingresar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let body = _.pick(req.body, ['descripcion', 'comuna_id']);

    await pool.request()
        .input('descripcion', sql.NVarChar, body.descripcion)
        .input('comuna_id', sql.NVarChar, body.comuna_id)
        .execute('InsertZona')
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
 * ACTUALIZAR una zona
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, response: descripcion }
 */
export const actualizar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('descripcion', sql.NVarChar, req.body.descripcion)
        .input('comuna_id', sql.NVarChar, req.body.comuna_id)
        .input('id', sql.Int, req.body.id)
        .execute('UpdateZona')
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
 * DESACTIVAR o ACTIVAR una zona de la base de datos
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: estado del objeto } }
 */
export const cambiarEstado = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('activo', sql.Bit, req.body.activo)
        .input('id', sql.Int, req.body.id)
        .execute('ToggleStatusZona')
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