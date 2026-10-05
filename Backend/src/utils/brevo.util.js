// Envío de correo por la API REST de Brevo (HTTPS, no usa puertos SMTP)
export const enviarCorreoBrevo = async ({ para, nombrePara, asunto, html }) => {
    const respuesta = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            sender: { name: process.env.BREVO_SENDER_NAME, email: process.env.BREVO_SENDER_EMAIL },
            to: [{ email: para, name: nombrePara }],
            subject: asunto,
            htmlContent: html
        })
    });

    if (!respuesta.ok) {
        const detalle = await respuesta.text();
        console.error('Error Brevo:', respuesta.status, detalle);
        const error = new Error('No se pudo enviar el correo de verificación');
        error.status = 502;
        throw error;
    }
};