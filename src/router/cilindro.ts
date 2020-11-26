// Importaciones
// Conexiones a la base de datos y algunos estandar de errores
const { connect, sql, checkError, errorBD, errorRespuesta } = require('../database/cnxn');
// Middleware para verificaciones
const { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');
// Inicializa express con las dependencias necesarias
const cilindro = require('./app');

/**
 * Realizamos la petición GET para obtener un [Activo.Cilindro] en base a su [codigo_activo]
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo cnxn en la carpeta database
 */
cilindro.get('/cilindro/:code', [ verificaToken ], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let code = req.params.code;
    await pool.request()
        .input('codigo', sql.NVarChar, code)
        .execute('SelectCilindro')
        .then((result: any) => {
            if (result.recordset[0]) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset[0]
            });
            else errorRespuesta(res);
        })
        .catch((err: any) => checkError(err, res));


    pool.close();

});

/**
 * Se realiza la petición GET que retorne todos los activos en la base de datos
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo cnxn en la carpeta database
 */
cilindro.get('/cilindros', [ verificaToken ], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    const result = await pool.request().query(`select * from [Activo.Cilindro]`);

    res.json({
        ok: true,
        query: result.recordset
    });

    pool.close();

});

/**
 * Se realiza una petición POST para ingresar un nuevo cilindro
 * También se utiliza el middleware para verificar que el token que se utiliza es válido
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto ingresado } }
 * De caso contrario hay varios mensajes de error que se pueden encontrar en el archivo cnxn en la carpeta database
 * Se ingresa a la base de datos llamando al procedimiento almacenado [InsertCilindro]
 * El objeto debe contener los campos de
 * { metros_cubicos: int, codigo_activo: nvarchar(MAX), tipo_id: int, fecha_mantencion: nvarchar(30), desc_mantenimiento: nvarhcar(30) }
 */
cilindro.post('/cilindro', [ verificaToken ], async (req: any, res: any) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('capacidad', sql.Int, req.body.metros_cubicos)
        .input('codigo', sql.NVarChar, req.body.codigo_activo)
        .input('tipo_id', sql.Int, req.body.tipo_id)
        .input('fecha_mantencion', sql.NVarChar, req.body.fecha_mantencion)
        .input('desc_mantencion', sql.NVarChar, req.body.desc_mantenimiento || null)
        .execute('InsertCilindro')
        .then((result: any) => {
            if (result) res.json({
                ok: true,
                message: 'Inserción correcta',
                response: {
                    capacidad: req.body.metros_cubicos + ' metros cúbicos',
                    codigo: req.body.codigo,
                    ult_mantenimiento: req.body.fecha_mantencion
                }
            });
        })
        .catch((err: any) => checkError(err, res));

    pool.close();

});


export default cilindro;