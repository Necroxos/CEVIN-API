// Importa conexiones a la BD y errores estándar
const { connect, sql, checkError, errorBD } = require('../database/cnxn');
// Se inicializa express y dependencias
const login = require('./app');
// Importamos módulos para encriptar password y gnerar tokens
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

/**
 * Se realiza una petición POST para verificar que el usuario exista
 * Si todo sale bien retorna un objeto con { ok: boolean, { response: usuarioDB }, token: string }
 * De caso contrario hay mensajes de error que se pueden encontrar en el archivo cnxn en la carpeta database
 * La consulta se hace mediante el procedimiento almacenado [Login]
 * El objeto debe contener los campos de
 * { email: nvarchar(30), password: nvarhcar(MAX) }
 * El password no se verifica en el procedimiento almacenado, ya que bcrypt tiene una función de comparación integrada
 * El token utiliza la variable de SEED como base y el CADUCIDAD_TOKEN para el tiempo de expiración, los que se pueden encontrar en config
 */
login.post('/login', async (req: any, res: any) => {
    let body = req.body;

    let pool = await connect();
    if (!pool) return errorBD(res);

    let usuarioDB = await pool.request()
        .input('email', sql.NVarChar, body.email)
        .execute('Login')
        .then((result: any) => result)
        .catch((err: any) => checkError(err, res));

    if (!usuarioDB.recordset[0] || !bcrypt.compareSync(body.password, usuarioDB.recordset[0].password)) {
        return res.status(400).json({
            ok: false,
            response: 'Usuario y/o contraseña incorrectos',
            err: {
                message: "No se pudo iniciar sesión por credenciales incorrectas"
            }
        });
    }

    usuarioDB = usuarioDB.recordset[0];
    delete usuarioDB.password;

    let token = jwt.sign({
        usuario: usuarioDB
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

    res.json({
        ok: true,
        usuario: usuarioDB,
        token
    });
});

export default login;