const { connect, sql, checkError } = require('../database/cnxn');

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Hay varios mensajes de error que se pueden encontrar en el archivo en el archivo CNXN en la carpeta DATABASE      *
 * La función execute llama a procedimientos almacenados de SQL Server (revisar scripts)                             *
 *********************************************************************************************************************/

/**
 * Realizamos la petición GET para OBTENER TODAS las zonas de [Direccion.Zona]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerTodos = async(req, res) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    await pool.request()
        .execute('SelectZonas')
        .then((result) => {
            if (result.recordset) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * Realizamos la petición GET para OBTENER las zonas de [Direccion.Zona] en base a una comuna
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerPorComuna = async(req, res) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    await pool.request()
        .input('comuna_id', sql.NVarChar, req.params.id)
        .execute('SelectZonasPorComuna')
        .then((result) => {
            if (result.recordset) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};