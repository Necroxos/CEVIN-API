// Importaciones
// Conexiones a la base de datos y algunos estandar de errores
const { connect, sql, checkError, errorBD } = require('../database/cnxn');
// Módulo para encriptar la contraseña
const bycrpt = require('bcrypt');

/**
 * INGRESAR el PRIMER usuario
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto ingresado } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 * Se ingresa a la base de datos llamando al procedimiento almacenado [InsertCilindro]
 * El objeto debe contener los campos de
 * { dni: nvarchar(30), dv: nvarchar(1), email: nvarchar(), nombres: nvarchar(30), apellidos: nvarhcar(30),
 *   password: nvarchar(MAX), rol_id: int }
 */
export const primerAdmin = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('dni', sql.NVarChar, '18372498')
        .input('dv', sql.NVarChar, '3')
        .input('email', sql.NVarChar, 'rdoratm@gmail.com')
        .input('nombres', sql.NVarChar, 'Rodrigo Isaías')
        .input('apellidos', sql.NVarChar, 'Dorat Merejo')
        .input('password', sql.NVarChar, bycrpt.hashSync('123456', 10))
        .execute('InsertAdmin')
        .then((result) => {
            if (result.rowsAffected.length !== 0) res.json({
                ok: true,
                message: 'Inserción correcta',
                response: {
                    message: 'Primer usuario generado!'
                }
            });
            else res.status(403).json({
                ok: false,
                response: 'Inserción fallida',
                err: {
                    message: `No se pudo ingresar al usuario administrador, ya existen administradores en el sistema`
                }
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * OBTENER al usuario de [Usuario.Info] y verificar su ROL
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 */
export const esAdmin = async(req, res) => {

    res.json({
        ok: true,
        message: 'Es Admin',
        response: {
            message: 'El usuario es un administrador'
        }
    });

};