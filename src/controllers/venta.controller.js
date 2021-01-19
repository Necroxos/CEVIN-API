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
 * OBTENER UN [Venta.Info] en base a su [codigo]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerUno = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('codigo', sql.NVarChar, req.params.code)
        .execute('SelectVenta')
        .then((result) => {
            if (result.recordset[0]) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset[0]
            });
            else sinResultados(res);
        })
        .catch((err) => checkError(err, res));


    pool.close();

};

/**
 * OBTENER TODOS las ventas de [Venta.Info]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerTodos = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .execute('SelectVentas')
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
 * INGRESAR una nueva venta
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto ingresado } }
 * El objeto debe contener los campos de
 * { codigo: nvarchar(255), cliente_id: int, fecha_entrega: date, cilindros: string para split }
 */
export const ingresar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let ventaObj;
    let cilindroObj = new Array();
    const cilindros = req.body.cilindros;
    const usuario_id = req.usuario.id;

    try {
        if (cilindros.length < 1)
            return res.status(400).json({
                ok: false,
                message: 'Se necesita al menos un cilindro en la venta',
                response: 'No se envió el listado de cilindros para la venta o arriendo'
            });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Se necesita al menos un cilindro en la venta',
            response: error.message
        });
    }

    await pool.request()
        .input('codigo', sql.NVarChar, req.body.codigo)
        .input('cliente_id', sql.NVarChar, req.body.cliente_id)
        .input('usuario_id', sql.NVarChar, usuario_id)
        .execute('InsertVenta')
        .then((result) => {
            if (result.recordset) ventaObj = result.recordset[0];
        })
        .catch((err) => checkError(err, res));

    for (let i = 0; i < cilindros.length; i++) {
        await pool.request()
            .input('venta_id', sql.Int, ventaObj.id)
            .input('cilindro_id', sql.Int, cilindros[i])
            .input('fecha_entrega', sql.NVarChar, req.body.fecha_entrega)
            .execute('InsertCilindroVenta')
            .then((result) => {
                if (result) cilindroObj.push(result.recordset[0]);
            })
            .catch((err) => checkError(err, res));
    }

    console.log(ventaObj);

    res.json({
        ok: true,
        message: 'Petición finalizada',
        response: ventaObj,
        list: cilindroObj
    });

    pool.close();

};

/**
 * ACTUALIZAR un cliente
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto actualizado } }
 */
export const actualizar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let ventaObj;
    let cilindroObj = new Array();
    const cilindros = req.body.cilindros;
    const body = _.pick(req.body, ['codigo', 'cliente_id', 'venta_id']);

    try {
        if (cilindros.length < 1)
            return res.status(400).json({
                ok: false,
                message: 'Se necesita al menos un cilindro en la venta',
                response: 'No se envió el listado de cilindros para la venta o arriendo'
            });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Se necesita al menos un cilindro en la venta',
            response: error.message
        });
    }

    await pool.request()
        .input('codigo', sql.NVarChar, body.codigo)
        .input('cliente_id', sql.NVarChar, body.cliente_id)
        .input('venta_id', sql.NVarChar, body.venta_id)
        .execute('UpdateVenta')
        .then((result) => {
            if (result.recordset) ventaObj = result.recordset[0];
        })
        .catch((err) => checkError(err, res));

    for (let i = 0; i < cilindros.length; i++) {
        await pool.request()
            .input('venta_id', sql.Int, ventaObj.id)
            .input('cilindro_id', sql.Int, cilindros[i])
            .input('fecha_entrega', sql.NVarChar, req.body.fecha_entrega)
            .execute('InsertCilindroVenta')
            .then((result) => {
                if (result.recordset) cilindroObj.push(result.recordset[0]);
            })
            .catch((err) => checkError(err, res));
    }

    console.log(ventaObj);

    res.json({
        ok: true,
        message: 'Petición finalizada',
        response: ventaObj,
        list: cilindroObj
    });

    pool.close();

};

/**
 * ACTUALIZAR un cliente
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto actualizado } }
 */
export const devolverCilindro = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    const body = _.pick(req.body, ['finalizado', 'cilindro_id', 'venta_id', 'fecha_retorno']);
    let cilindroDB;
    let ventaDB;

    await pool.request()
        .input('fecha_retorno', sql.NVarChar, body.fecha_retorno)
        .input('cilindro_id', sql.NVarChar, body.cilindro_id)
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
 * DESACTIVAR o ACTIVAR un cliente de la base de datos
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: estado del objeto } }
 */
export const cambiarEstado = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let ventaDB;
    const body = _.pick(req.body, ['venta_id']);

    /** Stored Procedure: Return */
    await pool.request()
        .input('venta_id', sql.Int, body.venta_id)
        .execute('ToggleStatusVenta')
        .then((result) => {
            if (result) ventaDB = result.recordset[0];
        })
        .catch((err) => checkError(err, res));

    if (ventaDB.activo) res.status(304).json({
        ok: false,
        message: 'Venta Desactivada',
        response: ventaDB
    });

    else res.status(200).json({
        ok: true,
        message: 'Venta Desactivada',
        response: ventaDB
    });

    pool.close();

};