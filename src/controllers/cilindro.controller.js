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
 * OBTENER UN [Activo.Cilindro] en base a su [codigo_activo]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerUno = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    const code = req.params.code;
    await pool.request()
        .input('codigo', sql.NVarChar, code)
        .execute('SelectCilindro')
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
 * OBTENER TODOS los activos en la base de datos
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerTodos = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .execute('SelectCilindros')
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
 * INGRESAR un nuevo cilindro
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto ingresado } }
 * El objeto debe contener los campos de
 * { metros_cubicos: int, codigo_activo: nvarchar(MAX), tipo_id: int, fecha_mantencion: nvarchar(30), desc_mantenimiento: nvarhcar(30) }
 */
export const ingresar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let body = _.pick(req.body, ['metros_cubicos', 'codigo_activo', 'tipo_id', 'fecha_mantencion', 'desc_mantenimiento', 'propietario_id']);

    console.log(body);

    await pool.request()
        .input('tipo_id', sql.Int, body.tipo_id)
        .input('capacidad', sql.Int, body.metros_cubicos)
        .input('codigo', sql.NVarChar, body.codigo_activo)
        .input('fecha_mantencion', sql.NVarChar, body.fecha_mantencion || null)
        .input('desc_mantencion', sql.NVarChar, body.desc_mantenimiento || null)
        .input('propietario_id', sql.Int, body.propietario_id)
        .execute('InsertCilindro')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Inserción correcta',
                response: {
                    capacidad: body.metros_cubicos + ' metros cúbicos',
                    codigo: body.codigo_activo,
                    ult_mantenimiento: body.fecha_mantencion
                }
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * ACTUALIZAR un nuevo cilindro
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto actualizado } }
 * El objeto debe contener los campos de
 * { cilindro_id: int, metros_cubicos: int, codigo_activo: nvarchar(MAX), tipo_id: int, fecha_mantencion: nvarchar(30), desc_mantenimiento: nvarhcar(30) }
 */
export const actualizar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let seguir = false;

    await pool.request()
        .input('id', sql.Int, req.body.cilindro_id)
        .input('tipo_id', sql.Int, req.body.tipo_id)
        .input('stock', sql.NVarChar, req.body.stock)
        .input('cargado', sql.NVarChar, req.body.cargado)
        .input('capacidad', sql.Int, req.body.metros_cubicos)
        .input('codigo', sql.NVarChar, req.body.codigo_activo)
        .input('propietario_id', sql.NVarChar, req.body.propietario_id)
        .execute('UpdateCilindro')
        .then(() => seguir = true)
        .catch((err) => checkError(err, res));

    if (seguir) {
        await pool.request()
            .input('id', sql.Int, req.body.cilindro_id)
            .input('fecha_mantencion', sql.NVarChar, req.body.fecha_mantencion)
            .input('desc_mantencion', sql.NVarChar, req.body.desc_mantenimiento || null)
            .execute('UpdateMantencion')
            .then((result) => {
                if (result) res.json({
                    ok: true,
                    message: 'Actualización correcta',
                    response: {
                        capacidad: req.body.metros_cubicos + ' metros cúbicos',
                        codigo: req.body.codigo,
                        ult_mantenimiento: req.body.fecha_mantencion,
                        stock: !!Number(req.body.stock),
                        cargado: !!Number(req.body.cargado)
                    }
                });
            })
            .catch((err) => checkError(err, res));
    }

    pool.close();

};

/**
 * DESACTIVAR o ACTIVAR un usuario de la base de datos
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: estado del objeto } }
 * El objeto debe contener los campos de
 * { dni: nvarchar(30), dv: nvarchar(1), email: nvarchar(), nombres: nvarchar(30), apellidos: nvarhcar(30),
 *   password: nvarchar(MAX), rol_id: int }
 */
export const cambiarEstado = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('activo', sql.Bit, req.body.activo)
        .input('id', sql.Int, req.body.cilindro_id)
        .execute('ToggleStatusCilindro')
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