// Conexiones a la base de datos y algunos estandar de errores
const { connect, sql, checkError, errorBD, sinResultados } = require('../database/cnxn');

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

    const result = await pool.request()
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
export const ingresar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let ventaObj;
    let cilindroObj = new Array();
    const cilindros = req.body.cilindros;

    await pool.request()
        .input('codigo', sql.NVarChar, req.body.codigo)
        .input('cliente_id', sql.NVarChar, req.body.cliente_id)
        .execute('InsertVenta')
        .then((result) => {
            if (result) ventaObj = result.recordset[0];
        })
        .catch((err) => checkError(err, res));

    for (let i = 0; i < cilindros.length; i++) {
        await pool.request()
            .input('venta_id', sql.Int, ventaObj['id'])
            .input('cilindro_id', sql.Int, cilindros[i])
            .input('fecha_entrega', sql.NVarChar, req.body.fecha_entrega)
            .execute('InsertCilindroVenta')
            .then((result) => {
                if (result) cilindroObj.push(result.recordset[0]);
            })
            .catch((err) => checkError(err, res));
    }

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
 * El objeto debe contener los campos de
 * { dni: nvarchar(30), dv: nvarchar(1), email: nvarchar(30), nombres: nvarchar(30), apellidos: nvarhcar(30),
 *   razon_social: nvarchar(30), telefono: int, empresa: bit }
 */
export const actualizar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    console.log('actualizar');

    pool.close();

};

/**
 * DESACTIVAR o ACTIVAR un cliente de la base de datos
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: estado del objeto } }
 */
export const cambiarEstado = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    /** Stored Procedure: Return */
    console.log('eliminar');

    pool.close();

};