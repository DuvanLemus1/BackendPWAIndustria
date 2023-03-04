import nodemailer from 'nodemailer';

export const correoRegistro = async (datos)=>{
    const {correoElectronico, nombreDoctor, token} = datos;

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
            user: "739099f6f54182",
            pass: "f0c32c032f1e35"
            }
        });

        //Informacion del correo
        const info = await transport.sendMail({
            from: "'Sistema Medico' <cuentas@uptask.com>",
            to: correoElectronico,
            subject:"Autentificacion de Cuenta",
            text: "Comprueba tu cuenta en nuestro sistema",
            html:`
                <p> Hola, ${nombreDoctor}. Comprueba tu cuenta. </p>
                <p> Sigue el siguiente enlace para validar tu cuenta:</p>
                <p> <a href="http://127.0.0.1:5173/confirmarCuenta/${token}"> Comprueba tu correo</a></p>
                `

        })

}

export const correoRecuperacion = async (datos)=>{
    const {correoElectronico, nombreDoctor, token} = datos;

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
            user: "739099f6f54182",
            pass: "f0c32c032f1e35"
            }
        });

        //Informacion del correo
        const info = await transport.sendMail({
            from: "'Reestablece tu contraseña' <cuentas@uptask.com>",
            to: correoElectronico,
            subject:"Recuperación de contraseña",
            text: "Has solicitado una recuperación de contreseña",
            html:`
                <p> Hola, ${nombreDoctor}. Establece una nueva contraseña. </p>
                <p> Sigue el siguiente enlace para establecer una nueva contraseña:</p>
                <p> <a href="http://127.0.0.1:5173/olvideContrasena/${token}"> Reestablecer contrasena</a></p>
                `

        })

}