// Importaciones
// Conexiones a la base de datos y algunos estandar de errores
const { connect, sql, checkError, errorBD } = require('../database/cnxn');
// Middleware para verificaciones
const { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');
// Inicializa express con las dependencias necesarias
const admin = require('./app');
// Módulo para encriptar la contraseña
const bycrpt = require('bcrypt');


/**
 * Se realiza una petición POST para INGRESAR el PRIMER usuario
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto ingresado } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 * Se ingresa a la base de datos llamando al procedimiento almacenado [InsertCilindro]
 * El objeto debe contener los campos de
 * { dni: nvarchar(30), dv: nvarchar(1), email: nvarchar(), nombres: nvarchar(30), apellidos: nvarhcar(30),
 *   password: nvarchar(MAX), rol_id: int }
 */
admin.post('/primer-admin', async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('dni', sql.NVarChar, req.body.dni)
        .input('dv', sql.NVarChar, req.body.dv)
        .input('email', sql.NVarChar, req.body.email)
        .input('nombres', sql.NVarChar, req.body.nombres)
        .input('apellidos', sql.NVarChar, req.body.apellidos)
        .input('password', sql.NVarChar, bycrpt.hashSync(req.body.password, 10))
        .input('rol', sql.Int, 1)
        .execute('InsertAdmin')
        .then((result: any) => {
            if (result.rowsAffected.length !== 0) res.json({
                ok: true,
                message: 'Inserción correcta',
                response: {
                    nombre: req.body.nombres + ' ' + req.body.apellidos,
                    rut: req.body.dni + '-' + req.body.dv,
                    email: req.body.email
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
        .catch((err: any) => checkError(err, res));

    pool.close();

});

/**
 * Realizamos la petición GET para OBTENER TODOS los usuarios de [Usuario.Info] que sean ADMIN o SUPER_ADMIN
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 */
admin.get('/primer-admin', async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    const existenAdmins = await pool.request().query(`SELECT * FROM [Usuario.Info] WHERE rol_id = 1 OR rol_id = 2`);

    if (existenAdmins.recordset.length === 0) {
        res.json({
            ok: true,
            message: 'No existen administradores',
            response: {
                result: `Se puede usar este link, ya que no existen administradores`
            }
        });
    } else {
        res.status(403).json({
            ok: false,
            response: 'Existen administradores',
            err: {
                message: `No se puede usar este link si ya hay un administrador`
            }
        });
    }

    pool.close();

});

/**
 * Realizamos la petición GET para OBTENER al usuario de [Usuario.Info] y verificar su ROL
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 */
admin.get('/es-admin/:id', [verificaToken, verificaAdminRole], async (req: any, res: any) => {

    res.json({
        ok: true,
        message: 'Es Admin',
        response: {
            message: 'El usuario es un administrador'
        }
    });

});

export default admin;