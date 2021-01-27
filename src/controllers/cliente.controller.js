// Conexiones a la base de datos y algunos estandar de errores
const { connect, sql, checkError, errorBD, sinResultados } = require('../database/cnxn');
// Coordenadas
const nodeGeocoder = require('node-geocoder');

/**********************************************************************************************************************
 * OBSERVACIONES:                                                                                                    *
 * Hay varios mensajes de error que se pueden encontrar en el archivo en el archivo CNXN en la carpeta DATABASE      *
 * La función execute llama a procedimientos almacenados de SQL Server (revisar scripts)                             *
 *********************************************************************************************************************/

/**
 * OBTENER UN [Cliente.Info] en base a su [rut]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerUno = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    let rut = req.params.rut;
    rut = rut.split('-');

    await pool.request()
        .input('dni', sql.NVarChar, rut[0])
        .input('dv', sql.NVarChar, rut[1])
        .execute('SelectCliente')
        .then((result) => {
            if (result.recordset[0]) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset[0]
            });
            else sinResultados(res);
        })
        .catch((err) => checkError(err, res));


    pool.close();

};

/**
 * OBTENER TODOS los clientes de [Cliente.Info]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerTodos = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .execute('SelectClientes')
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
 * OBTENER UN [Cliente.Direccion] en base a su [id]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerDireccion = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('id', sql.NVarChar, req.params.id)
        .execute('SelectDireccion')
        .then((result) => {
            if (result.recordset[0]) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset[0]
            });
            else sinResultados(res);
        })
        .catch((err) => checkError(err, res));


    pool.close();

};

/**
 * OBTENER TODO [Cliente.Direccion] en base al [rut] del cliente
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerDirecciones = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('cliente_id', sql.NVarChar, req.params.id)
        .execute('SelectDireccionesCliente')
        .then((result) => {
            if (result.recordset[0]) res.json({
                ok: true,
                message: 'Petición finalizada',
                response: result.recordset
            });
            else sinResultados(res);
        })
        .catch((err) => checkError(err, res));


    pool.close();

};

/**
 * OBTENER TODOS los activos involucrados en una [venta]
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto de la base de datos } }
 */
export const obtenerCilindrosComprados = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    await pool.request()
        .input('cliente_id', sql.NVarChar, req.params.id)
        .execute('SelectCilindrosComprados')
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
 * INGRESAR un nuevo cliente
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto ingresado } }
 */
export const ingresar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    const cliente = req.body.cliente;
    const direccion = req.body.direccion;

    const coordenadas = await obtenerCoordenadas(direccion);
    if (coordenadas.message) { return checkError(coordenadas, res); }

    const clienteBD = await ingresarCliente(pool, cliente);
    if (clienteBD.message) { return checkError(clienteBD, res); }

    await pool.request()
        .input('cliente_id', sql.Int, clienteBD.id)
        .input('calle', sql.NVarChar, direccion.calle)
        .input('numero', sql.NVarChar, direccion.numero)
        .input('depto', sql.NVarChar, direccion.departamento || null)
        .input('bloque', sql.NVarChar, direccion.bloque || null)
        .input('latitud', sql.NVarChar, coordenadas.latitude || null)
        .input('longitud', sql.NVarChar, coordenadas.longitude || null)
        .input('zona_id', sql.Int, direccion.zona_id)
        .execute('InsertDireccion')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Inserción correcta',
                response: {
                    cliente,
                    direccion
                }
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * ACTUALIZAR un cliente
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: objeto actualizado } }
 */
export const actualizar = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);

    const cliente = req.body.cliente;
    const direccion = req.body.direccion;

    const coordenadas = await obtenerCoordenadas(direccion);
    if (coordenadas.message) { return checkError(coordenadas, res); }

    const clienteBD = await actualizarCliente(pool, cliente);
    if (clienteBD.message) { return checkError(clienteBD, res); }

    await pool.request()
        .input('cliente_id', sql.Int, cliente.cliente_id)
        .input('calle', sql.NVarChar, direccion.calle)
        .input('numero', sql.NVarChar, direccion.numero)
        .input('latitud', sql.NVarChar, coordenadas.latitude || null)
        .input('longitud', sql.NVarChar, coordenadas.longitude || null)
        .input('depto', sql.NVarChar, direccion.departamento || null)
        .input('bloque', sql.NVarChar, direccion.bloque || null)
        .input('zona_id', sql.Int, direccion.zona_id)
        .execute('UpdateDireccion')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Actualización correcta',
                response: {
                    cliente,
                    direccion
                }
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/**
 * DESACTIVAR o ACTIVAR un cliente de la base de datos
 * Si todo sale bien retorna un objeto con { ok: boolean, message: texto, { response: estado del objeto } }
 */
export const cambiarEstado = async(req, res) => {

    let pool = await connect();
    if (!pool) return errorBD(res);
    /** validaciones */

    /** Stored Procedure: Return */
    await pool.request()
        .input('activo', sql.NVarChar, req.body.activo)
        .input('id', sql.NVarChar, req.body.cliente_id)
        .execute('ToggleStatusCliente')
        .then((result) => {
            if (result) res.json({
                ok: true,
                message: 'Cambio de estado',
                response: { activo: !!Number(req.body.activo) }
            });
        })
        .catch((err) => checkError(err, res));

    pool.close();

};

/****************************************************************************************************
 *                                      FUNCIONES DEL CONTROLLER
 ****************************************************************************************************/

/**
 * Esta función se encarga de obtener la longitud y latitud de una dirección
 * @param {calle, numero, zona, comuna} direccion Dirección que se ingresa en el formulario
 */
async function obtenerCoordenadas(direccion) {
    const options = { provider: 'openstreetmap' };
    const geoCoder = nodeGeocoder(options);
    const error = { ok: false, response: 'Error en dirección', code: 'geocode', err: { message: 'No se pudo obtener coordenadas' } };
    let fullAddress = '';
    if (direccion.zona.toLowerCase() == 'otros') {
        fullAddress = direccion.calle + ' ' + direccion.numero + ', ' + direccion.comuna;
    } else {
        fullAddress = direccion.calle + ' ' + direccion.numero + ', ' + direccion.zona + ', ' + direccion.comuna;
    }

    try {
        const result = await geoCoder.geocode(fullAddress);
        if (result[0].latitude) {
            return { latitude: result[0].latitude, longitude: result[0].longitude }
        } else {
            return { latitude: null, longitude: null };
        }
    } catch (err) {
        return error;
    }
}

/**
 * Esta función se encarga de ingresar al cliente en la base de datos
 * @param {dni, dv, email, telefon, nombre_completo, razon_social, empresa} cliente
 */
async function ingresarCliente(pool, cliente) {

    try {
        const result = await pool.request()
            .input('dni', sql.NVarChar, cliente.dni)
            .input('dv', sql.NVarChar, cliente.dv)
            .input('email', sql.NVarChar, cliente.email)
            .input('nombre', sql.NVarChar, cliente.nombre_completo)
            .input('razon_social', sql.NVarChar, cliente.razon_social || null)
            .input('telefono', sql.Int, cliente.telefono)
            .input('empresa', sql.NVarChar, cliente.empresa)
            .execute('InsertCliente');

        return result.recordset[0];
    } catch (err) {
        return err;
    }
}

/**
 * Esta función se encarga de actualizar al cliente en la base de datos
 * @param {dni, dv, email, telefon, nombre_completo, razon_social, empresa} cliente
 */
async function actualizarCliente(pool, cliente) {

    try {
        const result = await pool.request()
            .input('dni', sql.NVarChar, cliente.dni)
            .input('dv', sql.NVarChar, cliente.dv)
            .input('email', sql.NVarChar, cliente.email)
            .input('nombre', sql.NVarChar, cliente.nombre_completo)
            .input('razon_social', sql.NVarChar, cliente.razon_social || null)
            .input('telefono', sql.Int, cliente.telefono)
            .input('empresa', sql.NVarChar, cliente.empresa)
            .input('id', sql.Int, cliente.cliente_id)
            .execute('UpdateCliente')

        return result.recordset[0];
    } catch (err) {
        return err;
    }
}