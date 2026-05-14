/**
 * Esquema de Integración de Correo (SendGrid / Resend)
 * 
 * Este archivo está preparado para enviar automáticamente la "Guía de Masajes"
 * o cualquier otro recurso descargable a los leads una vez que se registran
 * en el embudo de /scan-gratis.
 */

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendMailOptions) {
  // Aquí se insertará la clave de tu proveedor favorito (Resend es recomendado por su facilidad con Next.js)
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.warn("⚠️ Advertencia: RESEND_API_KEY no configurada. Simulando envío de correo a:", to);
    // Simulación de envío exitoso para no romper el flujo
    return { success: true, simulated: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "SkinIQ <hola@tudominio.com>", // Cambia por tu dominio verificado
        to: [to],
        subject: subject,
        html: html
      })
    });

    if (!res.ok) {
      throw new Error("Error enviando el correo con Resend");
    }

    return await res.json();
  } catch (error) {
    console.error("Error en sendEmail:", error);
    return { success: false, error };
  }
}

/**
 * Función de utilidad para enviar la Guía de Masajes tras el registro
 */
export async function sendMassageGuide(email: string, name: string) {
  const subject = `🎁 Tu Guía de Masajes y Diagnóstico SkinIQ, ${name}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #D4AF37;">Bienvenida a SkinIQ™</h2>
      <p>Hola <strong>${name}</strong>,</p>
      <p>Gracias por realizar tu diagnóstico facial gratuito. Como te prometimos, aquí tienes tu acceso exclusivo a nuestra Guía de Masajes Faciales Coreanos (K-Beauty):</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://tudominio.com/guia-masajes.pdf" style="background-color: #D4AF37; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px;">
          Descargar Guía de Masajes PDF
        </a>
      </div>
      <p>Si deseas llevar tu rutina al siguiente nivel, un asesor se contactará contigo por WhatsApp pronto.</p>
      <br />
      <p>Con cariño,</p>
      <p><strong>El Equipo de SkinIQ</strong></p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}
