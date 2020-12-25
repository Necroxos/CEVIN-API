const { connect, sql, checkError } = require('../database/cnxn');

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Hay varios mensajes de error que se pueden encontrar en el archivo en el archivo CNXN en la carpeta DATABASE      *
 * La función execute llama a procedimientos almacenados de SQL Server (revisar scripts)                             *
 *********************************************************************************************************************/

/**
 * OBTENER TODOS los role de [Usuario.Rol]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerTodos = async(req, res) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    const result = await pool.request().query(`select * from [Usuario.Rol]`);

    res.json({
        ok: true,
        response: result.recordset
    });

    pool.close();

};

// rol.post('/rol', async (req, res) => {

//     let pool = await connect();
//     if (!pool) return res.status(403);

//     await pool.request()
//         .input('descripcion', sql.NVarChar, req.body.descripcion)
//         .execute('InsertRol')
//         .then((result) => {
//             if (result) res.json({
//                 ok: true,
//                 message: 'Inserción correcta',
//                 response: { titulo: req.body.descripcion }
//             });
//         })
//         .catch((err) => checkError(err, res));

//     pool.close();

// });

// rol.put('/rol', [ verificaToken ], async (req, res) => {

//     let pool = await connect();
//     if (!pool) return res.status(403);

//     await pool.request()
//         .input('descripcion', sql.NVarChar, req.body.descripcion)
//         .input('id', sql.NVarChar, req.body.id)
//         .execute('UpdateRol')
//         .then((result) => {
//             if (result) res.json({
//                 ok: true,
//                 message: 'Actualización correcta',
//                 response: { titulo: req.body.descripcion }
//             });
//         })
//         .catch((err) => checkError(err, res));

//     pool.close();

// });

// rol.put('/cambio-estado/rol', [ verificaToken, verificaAdminRole ], async (req, res) => {

//     let pool = await connect();
//     if (!pool) return res.status(403);

//     /** validaciones */


//     /** Stored Procedure: Return */
//     await pool.request()
//         .input('activo', sql.NVarChar, req.body.activo)
//         .input('id', sql.NVarChar, req.body.id)
//         .execute('ToggleStatusRol')
//         .then((result) => {
//             if (result) res.json({
//                 ok: true,
//                 message: 'Cambio de estado',
//                 response: { activo: !!Number(req.body.activo) }
//             });
//         })
//         .catch((err) => checkError(err, res));

//     pool.close();

// });