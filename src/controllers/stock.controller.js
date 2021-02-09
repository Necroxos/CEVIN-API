// Conexiones a la base de datos y algunos estandar de errores
const { connect, sql, checkError, errorBD } = require('../database/cnxn');

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Hay varios mensajes de error que se pueden encontrar en el archivo en el archivo CNXN en la carpeta DATABASE      *
 * La función execute llama a procedimientos almacenados de SQL Server (revisar scripts)                             *
 *********************************************************************************************************************/

/**
 * OBTENER stock de cilindros llenos y en bodega
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerLlenos = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .execute('SelectStockLlenos')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * OBTENER stock de cilindros vacios y en bodega
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerVacios = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .execute('SelectStockVacios')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * OBTENER los cilindros en arriendo
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerArrendados = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .execute('SelectArrendados')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * OBTENER los cilindros en Air Liquide (Santiago)
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerRotados = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .execute('SelectRotados')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * ACTUALIZAR los estados de cilindros al momento de devolverlos
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto actualizado } }
 */
export const rotacionCilindros = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    const cilindros = req.body;
    let cilindroDB;

    for (let i = 0; i < cilindros.length; i++) {
        await pool.request()
            .input('id', sql.Int, cilindros[i].cilindro_id)
            .input('activo', sql.NVarChar, cilindros[i].activo)
            .execute('RotarCilindro')
            .then((result) => {
                if (result.recordset) cilindroDB = result.recordset[0];
            })
            .catch((err) => checkError(err, res));
    }

    res.json({
        ok: true,
        message: 'Petición finalizada',
        response: {
            cilindroDB
        }
    });

    pool.close();

};