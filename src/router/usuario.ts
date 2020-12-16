// Importaciones
// Conexiones a la base de datos y algunos estandar de errores
const { connect, sql, checkError, errorBD, errorRespuesta } = require('../database/cnxn');
// Middleware para verificaciones
const { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');
// Inicializa express con las dependencias necesarias
const usuario = require('./app');
// Módulo para encriptar la contraseña
const bycrpt = require('bcrypt');

/**
 * Realizamos la petición GET para OBTENER TODOS los usuarios de [Usuario.Info]
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 */
usuario.get('/usuarios', [verificaToken], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    const result = await pool.request().query(`select * from [Usuario.Info]`);

    if (result.recordset[0]) res.json({
        ok: true,
        message: 'Petición finalizada',
        response: result.recordset
    });
    else errorRespuesta(res);

    pool.close();

});

/**
 * Se realiza una petición POST para INGRESAR un nuevo usuario
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Y se verifica que sólo los administradores pueden crear más usuarios
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto ingresado } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 * Se ingresa a la base de datos llamando al procedimiento almacenado [InsertCilindro]
 * El objeto debe contener los campos de
 * { dni: nvarchar(30), dv: nvarchar(1), email: nvarchar(), nombres: nvarchar(30), apellidos: nvarhcar(30),
 *   password: nvarchar(MAX), rol_id: int }
 */
usuario.post('/usuario', [verificaToken, verificaAdminRole], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('dni', sql.NVarChar, req.body.dni)
        .input('dv', sql.NVarChar, req.body.dv)
        .input('email', sql.NVarChar, req.body.email)
        .input('nombres', sql.NVarChar, req.body.nombres)
        .input('apellidos', sql.NVarChar, req.body.apellidos)
        .input('password', sql.NVarChar, bycrpt.hashSync(req.body.password, 10))
        .input('rol_id', sql.Int, req.body.rol_id)
        .execute('InsertUsuario')
        .then((result: any) => {
            if (result) res.json({
                ok: true,
                message: 'Inserción correcta',
                response: {
                    nombre: req.body.nombres + ' ' + req.body.apellidos,
                    rut: req.body.dni + '-' + req.body.dv,
                    email: req.body.email
                }
            });
        })
        .catch((err: any) => checkError(err, res));

    pool.close();

});

/**
 * Se realiza una petición PUT para ACTUALIZAR un nuevo usuario
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto actualizado } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 * Se ingresa a la base de datos llamando al procedimiento almacenado [InsertCilindro]
 * El objeto debe contener los campos de
 * { dni: nvarchar(30), dv: nvarchar(1), email: nvarchar(), nombres: nvarchar(30), apellidos: nvarhcar(30), id: int }
 */
usuario.put('/usuario', [verificaToken], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('dni', sql.NVarChar, req.body.dni)
        .input('dv', sql.NVarChar, req.body.dv)
        .input('email', sql.NVarChar, req.body.email)
        .input('nombres', sql.NVarChar, req.body.nombres)
        .input('apellidos', sql.NVarChar, req.body.apellidos)
        .input('id', sql.Int, req.body.id)
        .execute('UpdateUsuario')
        .then((result: any) => {
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
        .catch((err: any) => checkError(err, res));

    pool.close();

});

/**
 * Se realiza una petición PUT para DESACTIVAR o ACTIVAR un usuario de la base de datos
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Y se verifica que sólo los administradores pueden realizar esta función
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: estado del objeto } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 * Se ingresa a la base de datos llamando al procedimiento almacenado [InsertCilindro]
 * El objeto debe contener los campos de
 * { dni: nvarchar(30), dv: nvarchar(1), email: nvarchar(), nombres: nvarchar(30), apellidos: nvarhcar(30),
 *   password: nvarchar(MAX), rol_id: int }
 */
usuario.put('/cambio-estado/usuario', [verificaToken, verificaAdminRole], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);
    /** validaciones */


    /** Stored Procedure: Return */
    await pool.request()
        .input('activo', sql.NVarChar, req.body.activo)
        .input('id', sql.NVarChar, req.body.id)
        .execute('ToggleStatusUsuario')
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

export default usuario;