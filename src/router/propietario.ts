const { connect, sql, checkError } = require('../database/cnxn');
const { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');

const propietario = require('./app');

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