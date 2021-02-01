// Módulo para enviar correo
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: String(process.env.EMAIL),
        pass: String(process.env.EMAIL_PASS)
    }
});

let mailOptions = {
    from: `"CEVIN" <${String(process.env.EMAIL)}>`,
    to: '',
    subject: 'Recuperación de contraseña ✔',
    text: '',
    html: ''
};

const configOptions = (correo, contraseña) => {
    mailOptions.to = correo;
    mailOptions.html = `<p>Su nueva contraseña es:\n<b>${ contraseña }</b></p>`;
}

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