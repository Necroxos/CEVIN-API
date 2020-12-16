const { connect, sql, checkError } = require('../database/cnxn');
const { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');

const tipoGas = require('./app');

tipoGas.get('/gases', [ verificaToken ], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    const result = await pool.request().query(`select * from [Activo.Tipo]`);

    res.json({
        ok: true,
        response: result.recordset
    });

    pool.close();

});

export default tipoGas;