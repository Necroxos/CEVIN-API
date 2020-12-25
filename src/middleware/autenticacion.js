// Importaciones
// Conexiones a la base de datos y algunos estandar de errores
const { connect } = require('../database/cnxn');
// jsonwebtoken para verficar validéz
const jwt = require('jsonwebtoken');

/**
 * Verificar token
 */
let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El token no es válido'
                }
            });
        }

        if (decoded.usuario.recordset) req.usuario = decoded.usuario.recordset[0];
        else req.usuario = decoded.usuario;
        next();
    });
}

/**
 * Verifica AdminRole
 */
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.rol_id === 1) { // usar el id del rol de administración
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}

module.exports = {
    verificaToken,
    verificaAdminRole
}