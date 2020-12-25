// Conexiones a la base de datos y algunos estandar de errores
const { connect, sql, checkError, errorBD, sinResultados } = require('../database/cnxn');

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Hay varios mensajes de error que se pueden encontrar en el archivo en el archivo CNXN en la carpeta DATABASE      *
 * La función execute llama a procedimientos almacenados de SQL Server (revisar scripts)                             *
 *********************************************************************************************************************/

/**
 * OBTENER UN [Cliente.Info] en base a su [rut]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerUno = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let rut = req.params.rut;
    rut = rut.split('-');
    await pool.request()
        .input('dni', sql.NVarChar, rut[0])
        .input('dv', sql.NVarChar, rut[1])
        .execute('SelectCliente')
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
 * OBTENER TODOS los clientes de [Cliente.Info]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerTodos = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    const result = await pool.request()
        .execute('SelectClientes')
        .then((result) => {
            res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * INGRESAR un nuevo cliente
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto ingresado } }
 * El objeto debe contener los campos de
 * { dni: nvarchar(30), dv: nvarchar(1), email: nvarchar(30), nombres: nvarchar(30), apellidos: nvarhcar(30),
 *   razon_social: nvarchar(30), telefono: int, empresa: bit }
 */
export const ingresar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('dni', sql.NVarChar, req.body.dni)
        .input('dv', sql.NVarChar, req.body.dv)
        .input('email', sql.NVarChar, req.body.email || null)
        .input('nombres', sql.NVarChar, req.body.nombres)
        .input('apellidos', sql.NVarChar, req.body.apellidos)
        .input('razon_social', sql.NVarChar, req.body.razon_social || null)
        .input('telefono', sql.Int, req.body.telefono || null)
        .input('empresa', sql.NVarChar, req.body.empresa)
        .execute('InsertCliente')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Inserción correcta',
                response: {
                    nombre: req.body.nombres + ' ' + req.body.apellidos,
                    rut: req.body.dni + '-' + req.body.dv
                }
            });
        })
        .catch((err) => checkError(err, res));

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

    await pool.request()
        .input('dni', sql.NVarChar, req.body.dni)
        .input('dv', sql.NVarChar, req.body.dv)
        .input('email', sql.NVarChar, req.body.email || null)
        .input('nombres', sql.NVarChar, req.body.nombres)
        .input('apellidos', sql.NVarChar, req.body.apellidos)
        .input('razon_social', sql.NVarChar, req.body.razon_social || null)
        .input('telefono', sql.Int, req.body.telefono || null)
        .input('empresa', sql.NVarChar, req.body.empresa)
        .input('id', sql.Int, req.body.cliente_id)
        .execute('UpdateCliente')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Actualización correcta',
                response: {
                    Rut: req.body.dni + '-' + req.body.dv,
                    Nombre: req.body.nombres + ' ' + req.body.apellidos,
                    Correo: req.body.email
                }
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * DESACTIVAR o ACTIVAR un cliente de la base de datos
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: estado del objeto } }
 */
export const cambiarEstado = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);
    /** validaciones */


    /** Stored Procedure: Return */
    await pool.request()
        .input('activo', sql.NVarChar, req.body.activo)
        .input('id', sql.NVarChar, req.body.id)
        .execute('ToggleStatusCliente')
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