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
export const obtenerUno = async (req, res) => {

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
export const obtenerTodos = async (req, res) => {

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
 * INGRESAR una nueva venta
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto ingresado } }
 * El objeto debe contener los campos de
 * { codigo: nvarchar(255), cliente_id: int, fecha_entrega: date, cilindros: string para split }
 */
export const ingresar = async (req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let cilindroObj = new Array();
    const cilindros = req.body.cobros;
    const venta = _.pick(req.body, ['codigo', 'cliente_id', 'venta_id', 'monto', 'fecha_entrega']);
    const usuario_id = req.usuario.id;

    const ventaDB = await ingresarVenta(pool, venta, usuario_id);
    const checkLista = await checkCilindros(cilindros);

    if (!checkLista.ok) {
        return res.status(400).json(checkLista);
    } else if (ventaDB.message) {
        return checkError(ventaDB, res);
    }

    for (let i = 0; i < cilindros.length; i++) {
        await pool.request()
            .input('venta_id', sql.Int, ventaDB.id)
            .input('cilindro_id', sql.Int, cilindros[i].cilindro_id)
            .input('cobro', sql.Int, cilindros[i].cobro)
            .input('fecha_entrega', sql.NVarChar, venta.fecha_entrega)
            .execute('InsertCilindroVenta')
            .then((result) => {
                if (result) cilindroObj.push(result.recordset[0]);
            })
            .catch((err) => checkError(err, res));
    }

    res.json({
        ok: true,
        message: 'Petición finalizada',
        response: ventaDB,
        list: cilindroObj
    });

    pool.close();

};

/**
 * ACTUALIZAR una venta
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto actualizado } }
 */
export const actualizar = async (req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let cilindroObj = new Array();
    const cilindros = req.body.cobros;
    const venta = _.pick(req.body, ['codigo', 'cliente_id', 'venta_id', 'monto', 'fecha_entrega']);

    const ventaDB = await actualizarVenta(pool, venta);
    const checkLista = await checkCilindros(cilindros);

    if (!checkLista.ok) {
        return res.status(400).json(checkLista);
    } else if (ventaDB.message) {
        return checkError(ventaDB, res);
    }

    for (let i = 0; i < cilindros.length; i++) {
        await pool.request()
            .input('venta_id', sql.Int, ventaDB.id)
            .input('cilindro_id', sql.Int, cilindros[i].cilindro_id)
            .input('cobro', sql.Int, cilindros[i].cobro)
            .input('fecha_entrega', sql.NVarChar, venta.fecha_entrega)
            .execute('InsertCilindroVenta')
            .then((result) => {
                if (result.recordset) cilindroObj.push(result.recordset[0]);
            })
            .catch((err) => checkError(err, res));
    }

    res.json({
        ok: true,
        message: 'Petición finalizada',
        response: ventaDB,
        list: cilindroObj
    });

    pool.close();

};

/**
 * DESACTIVAR o ACTIVAR una venta de la base de datos
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: estado del objeto } }
 */
export const cambiarEstado = async (req, res) => {

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

/**********************************************************************************************************************
 *                                                 INFORMACIÓN PARA FORMULARIOS                                      *
 *********************************************************************************************************************/

/**
 * OBTENER TODOS los tipos de demora/atrasos
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: estado del objeto } }
 */
export const obtenerDemoras = async (req, res) => {

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

/**
 * OBTENER TODOS los clientes de [Cliente.Info]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerClientes = async (req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .execute('SelectClientesVenta')
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

/****************************************************************************************************
 *                                      FUNCIONES DEL CONTROLLER
 ****************************************************************************************************/

/**
 * Esta función se encarga de ingresar la venta en la base de datos
 * @param {codigo, cliente_id, monto} venta
 */
async function checkCilindros(cilindros) {

    try {
        if (cilindros.length < 1)
            return {
                ok: false,
                message: 'Se necesita al menos un cilindro en la venta',
                response: 'No se envió el listado de cilindros para la venta o arriendo'
            };
        else return { ok: true }
    } catch (error) {
        return {
            ok: false,
            message: 'Se necesita al menos un cilindro en la venta',
            response: error.message
        };
    }
}

/**
 * Esta función se encarga de ingresar la venta en la base de datos
 * @param {codigo, cliente_id, monto} venta
 */
async function ingresarVenta(pool, venta, usuario_id) {

    try {
        const result = await pool.request()
            .input('cliente_id', sql.NVarChar, venta.cliente_id)
            .input('fecha', sql.NVarChar, venta.fecha_entrega)
            .input('usuario_id', sql.NVarChar, usuario_id)
            .input('codigo', sql.NVarChar, venta.codigo)
            .input('monto', sql.NVarChar, venta.monto)
            .execute('InsertVenta')

        return result.recordset[0];
    } catch (err) {
        return err;
    }
}

/**
 * Esta función se encarga de ingresar la venta en la base de datos
 * @param {codigo, cliente_id, venta_id, monto} venta
 */
async function actualizarVenta(pool, venta) {

    try {
        const result = await pool.request()
            .input('cliente_id', sql.NVarChar, venta.cliente_id)
            .input('fecha', sql.NVarChar, venta.fecha_entrega)
            .input('venta_id', sql.NVarChar, venta.venta_id)
            .input('codigo', sql.NVarChar, venta.codigo)
            .input('monto', sql.NVarChar, venta.monto)
            .execute('UpdateVenta')

        return result.recordset[0];
    } catch (err) {
        return err;
    }
}