import { MailSender } from '../../domain/ports/mail-sender.js';
import { ErrorServicioExterno } from '../../application/errors/errores.js';

// Envío de correo por la API REST de Brevo (HTTPS, no usa puertos SMTP)
export class BrevoMailSender extends MailSender {
  constructor({ apiKey, remitenteNombre, remitenteCorreo }) {
    super();
    this.apiKey = apiKey;
    this.remitenteNombre = remitenteNombre;
    this.remitenteCorreo = remitenteCorreo;
  }

  async enviar({ para, nombrePara, asunto, html }) {
    const respuesta = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': this.apiKey
      },
      body: JSON.stringify({
        sender: { name: this.remitenteNombre, email: this.remitenteCorreo },
        to: [{ email: para, name: nombrePara }],
        subject: asunto,
        htmlContent: html
      })
    });

    if (!respuesta.ok) {
      console.error('Error Brevo:', respuesta.status, await respuesta.text());
      throw new ErrorServicioExterno('No se pudo enviar el correo de verificación');
    }
  }
}