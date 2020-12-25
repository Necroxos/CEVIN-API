const { connect, sql, checkError } = require('../database/cnxn');

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Hay varios mensajes de error que se pueden encontrar en el archivo en el archivo CNXN en la carpeta DATABASE      *
 * La función execute llama a procedimientos almacenados de SQL Server (revisar scripts)                             *
 *********************************************************************************************************************/

/**
 * OBTENER TODOS los propietarios de [Activo.Propietario]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerTodos = async(req, res) => {

    let pool = await connect();
    if (!pool) return res.status(403);

    const result = await pool.request().query(`select * from [Activo.Propietario]`);

    res.json({
        ok: true,
        response: result.recordset
    });

    pool.close();

};