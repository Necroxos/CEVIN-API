const { connect, sql, checkError } = require('../database/cnxn');
const { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');

const rol = require('./app');

rol.get('/roles', [ verificaToken ], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    const result = await pool.request().query(`select * from [Usuario.Rol]`);

    res.json({
        ok: true,
        query: result.recordset
    });

    pool.close();

});

rol.post('/rol', async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    await pool.request()
        .input('descripcion', sql.NVarChar, req.body.descripcion)
        .execute('InsertRol')
        .then((result: any) => {
            if (result) res.json({
                ok: true,
                message: 'Inserción correcta',
                response: { titulo: req.body.descripcion }
            });
        })
        .catch((err: any) => checkError(err, res));

    pool.close();

});

rol.put('/rol', [ verificaToken ], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    await pool.request()
        .input('descripcion', sql.NVarChar, req.body.descripcion)
        .input('id', sql.NVarChar, req.body.id)
        .execute('UpdateRol')
        .then((result: any) => {
            if (result) res.json({
                ok: true,
                message: 'Actualización correcta',
                response: { titulo: req.body.descripcion }
            });
        })
        .catch((err: any) => checkError(err, res));

    pool.close();

});

rol.delete('/rol', [ verificaToken, verificaAdminRole ], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    /** validaciones */


    /** Stored Procedure: Return */
    await pool.request()
        .input('activo', sql.NVarChar, req.body.activo)
        .input('id', sql.NVarChar, req.body.id)
        .execute('ToggleStatusRol')
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

export default rol;