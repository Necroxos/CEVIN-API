// Módulo para enviar correo
const nodemailer = require('nodemailer');

/**
 * Inicializamos el nodemailer con el correo y contraseña
 * Obtenidos del archivo .env
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: String(process.env.EMAIL),
        pass: String(process.env.EMAIL_PASS)
    }
});

/**
 * Configuración de opciones para el Mail
 * Destinatario, cuerpo, tema, etc.
 */
let mailOptions = {
    from: `"CEVIN" <${String(process.env.EMAIL)}>`,
    to: '',
    subject: 'Recuperación de contraseña ✔',
    text: '',
    html: ''
};

/**
 * Función para cambiar las opciones
 * @param {recibe el correo del usuario} correo
 * @param {recibe la nueva contraseña} contraseña
 */
const configOptions = (correo, contraseña) => {
    mailOptions.to = correo;
    mailOptions.html = `<p>Su nueva contraseña es:\n<b>${ contraseña }</b></p>`;
}

/**
 * Función que envía el correo con los parámetros anteriores
 * @param {usuario.email} correo 
 * @param {nueva pass} contraseña 
 */
export const enviarCorreo = (correo, contraseña) => {
    configOptions(correo, contraseña);

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado a: ' + info.response);
        }
    });
}