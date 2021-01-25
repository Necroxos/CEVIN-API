// Conexiones a la base de datos y algunos estandar de errores
const { connect, sql, checkError, errorBD, sinResultados } = require('../database/cnxn');
// Módulo para encriptar la contraseña
const bycrpt = require('bcrypt');

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Hay varios mensajes de error que se pueden encontrar en el archivo en el archivo CNXN en la carpeta DATABASE      *
 * La función execute llama a procedimientos almacenados de SQL Server (revisar scripts)                             *
 *********************************************************************************************************************/

/**
 * OBTENER UN [Usuario.Info] en base a su [rut]
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
        .execute('SelectUsuario')
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
 * OBTENER TODOS los usuarios de [Usuario.Info]
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerTodos = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    const result = await pool.request()
        .execute('SelectUsuarios')
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
 * INGRESAR un nuevo usuario
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Y se verifica que sólo los administradores pueden crear más usuarios
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto ingresado } }
 * El objeto debe contener los campos de
 * { dni: nvarchar(30), dv: nvarchar(1), email: nvarchar(30), nombres: nvarchar(30), apellidos: nvarhcar(30),
 *   password: nvarchar(MAX), rol_id: int }
 */
export const ingresar = async(req, res) => {

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
        .then((result) => {
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
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * ACTUALIZAR un usuario
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto actualizado } }
 * El objeto debe contener los campos de
 * { dni: nvarchar(30), dv: nvarchar(1), email: nvarchar(30), nombres: nvarchar(30), apellidos: nvarhcar(30), id: int }
 */
export const actualizar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('dni', sql.NVarChar, req.body.dni)
        .input('dv', sql.NVarChar, req.body.dv)
        .input('email', sql.NVarChar, req.body.email)
        .input('nombres', sql.NVarChar, req.body.nombres)
        .input('apellidos', sql.NVarChar, req.body.apellidos)
        .input('rol_id', sql.Int, req.body.rol_id)
        .input('id', sql.Int, req.body.usuario_id)
        .execute('UpdateUsuario')
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

/* ACTUALIZAR la contraseña de un usuario
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto actualizado } }
 */
export const cambiarPass = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    console.log(req.body);
    await pool.request()
        .input('password', sql.NVarChar, bycrpt.hashSync(req.body.password, 10))
        .input('id', sql.Int, req.body.usuario_id)
        .execute('UpdatePassword')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Actualización correcta',
                response: {
                    message: 'Contraseña cambiada',
                    usuario_id: req.body.usuario_id
                }
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * DESACTIVAR o ACTIVAR un usuario de la base de datos
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: estado del objeto } }
 */
export const cambiarEstado = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);
    /** validaciones */


    /** Stored Procedure: Return */
    await pool.request()
        .input('activo', sql.NVarChar, req.body.activo)
        .input('id', sql.NVarChar, req.body.usuario_id)
        .execute('ToggleStatusUsuario')
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