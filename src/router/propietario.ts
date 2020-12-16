const { connect, sql, checkError } = require('../database/cnxn');
const { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');

const propietario = require('./app');

/**
 * Realizamos la petición GET para OBTENER TODOS los propietarios de [Activo.Propietario]
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo CNXN en la carpeta DATABASE
 */
propietario.get('/propietarios', [ verificaToken ], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    const result = await pool.request().query(`select * from [Activo.Propietario]`);

    res.json({
        ok: true,
        response: result.recordset
    });

    pool.close();

});

export default propietario;