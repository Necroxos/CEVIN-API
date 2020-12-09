// Importaciones
// Conexiones a la base de datos y algunos estandar de errores
const { connect, sql, checkError, errorBD, errorRespuesta } = require('../database/cnxn');
// Middleware para verificaciones
const { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');
// Inicializa express con las dependencias necesarias
const cilindro = require('./app');
const _ = require('underscore');

/**
 * Realizamos la petición GET para OBTENER UN [Activo.Cilindro] en base a su [codigo_activo]
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo en el archivo CNXN en la carpeta DATABASE
 */
cilindro.get('/cilindro/:code', [verificaToken], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    const code = req.params.code;
    await pool.request()
        .input('codigo', sql.NVarChar, code)
        .execute('SelectCilindro')
        .then((result: any) => {
            if (result.recordset[0]) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset[0]
            });
            else errorRespuesta(res);
        })
        .catch((err: any) => checkError(err, res));


    pool.close();

});

/**
 * Se realiza la petición GET para OBTENER TODOS los activos en la base de datos
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el en el archivo CNXN en la carpeta DATABASE
 */
cilindro.get('/cilindros', [verificaToken], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .execute('SelectCilindros')
        .then((result: any) => {
            if (result.recordset[0]) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
            else errorRespuesta(res);
        })
        .catch((err: any) => checkError(err, res));

    pool.close();

});

/**
 * Se realiza una petición POST para INGRESAR un nuevo cilindro
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto ingresado } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 * Se ingresa a la base de datos llamando al procedimiento almacenado [InsertCilindro]
 * El objeto debe contener los campos de
 * { metros_cubicos: int, codigo_activo: nvarchar(MAX), tipo_id: int, fecha_mantencion: nvarchar(30), desc_mantenimiento: nvarhcar(30) }
 */
cilindro.post('/cilindro', [verificaToken], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let body = _.pick(req.body, ['metros_cubicos', 'codigo_activo', 'tipo_id', 'fecha_mantencion', 'desc_mantenimiento']);
    console.log(body);

    await pool.request()
        .input('capacidad', sql.Int, req.body.metros_cubicos)
        .input('codigo', sql.NVarChar, req.body.codigo_activo)
        .input('tipo_id', sql.Int, req.body.tipo_id)
        .input('fecha_mantencion', sql.NVarChar, req.body.fecha_mantencion)
        .input('desc_mantencion', sql.NVarChar, req.body.desc_mantenimiento || null)
        .input('propietario_id', sql.NVarChar, req.body.propietario_id)
        .execute('InsertCilindro')
        .then((result: any) => {
            if (result) res.json({
                ok: true,
                message: 'Inserción correcta',
                response: {
                    capacidad: req.body.metros_cubicos + ' metros cúbicos',
                    codigo: req.body.codigo,
                    ult_mantenimiento: req.body.fecha_mantencion
                }
            });
        })
        .catch((err: any) => checkError(err, res));

    pool.close();

});

/**
 * Se realiza una petición PUT para ACTUALIZAR un nuevo cilindro
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto actualizado } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 * Se ingresa a la base de datos llamando al procedimiento almacenado [InsertCilindro]
 * El objeto debe contener los campos de
 * { cilindro_id: int, metros_cubicos: int, codigo_activo: nvarchar(MAX), tipo_id: int, fecha_mantencion: nvarchar(30), desc_mantenimiento: nvarhcar(30) }
 */
cilindro.put('/cilindro', [verificaToken], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('id', sql.Int, req.body.cilindro_id)
        .input('capacidad', sql.Int, req.body.metros_cubicos)
        .input('codigo', sql.NVarChar, req.body.codigo_activo)
        .input('tipo_id', sql.Int, req.body.tipo_id)
        .input('fecha_mantencion', sql.NVarChar, req.body.fecha_mantencion)
        .input('desc_mantencion', sql.NVarChar, req.body.desc_mantenimiento || null)
        .execute('UpdateCilindro')
        .then((result: any) => {
            if (result) res.json({
                ok: true,
                message: 'Actualización correcta',
                response: {
                    capacidad: req.body.metros_cubicos + ' metros cúbicos',
                    codigo: req.body.codigo,
                    ult_mantenimiento: req.body.fecha_mantencion
                }
            });
        })
        .catch((err: any) => checkError(err, res));

    pool.close();

});

/**
 * Se realiza una petición DELETE para DESACTIVAR o ACTIVAR un usuario de la base de datos
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Y se verifica que sólo los administradores pueden realizar esta función
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: estado del objeto } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 * Se ingresa a la base de datos llamando al procedimiento almacenado [InsertCilindro]
 * El objeto debe contener los campos de
 * { dni: nvarchar(30), dv: nvarchar(1), email: nvarchar(), nombres: nvarchar(30), apellidos: nvarhcar(30),
 *   password: nvarchar(MAX), rol_id: int }
 */
cilindro.put('/cambio-estado/cilindro', [verificaToken, verificaAdminRole], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);
    /** validaciones */


    /** Stored Procedure: Return */
    await pool.request()
        .input('activo', sql.Bit, req.body.activo)
        .input('id', sql.Int, req.body.cilindro_id)
        .execute('ToggleStatusCilindro')
        .then((result: any) => {
            if (result) res.json({
                ok: true,
                message: 'Cambio de estado',
                response: { activo: !!Number(req.body.activo) }
            });
        })
        .catch((err: any) => checkError(err, res));

    pool.close();

});

export default cilindro;