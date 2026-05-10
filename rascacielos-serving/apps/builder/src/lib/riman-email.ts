import { getSmtpTransport } from '@/lib/email'
import { supabaseAdmin } from '@/lib/supabase/admin'

export function buildRimanEmailTemplate(options: {
  title: string
  greeting: string
  bodyLines: string[]
  ctaText?: string
  ctaUrl?: string
  footerText?: string
}): string {
  const { title, greeting, bodyLines, ctaText, ctaUrl, footerText } = options

  // Estética Premium K-Beauty (Negro y Dorado)
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <!-- Card Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #0a0a0a; border: 1px solid #D4AF37; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(212,175,55,0.15);">
          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">
              <h1 style="color: #ffffff; font-weight: 900; font-size: 24px; letter-spacing: 2px; margin: 0;">
                skingif<span style="color: #D4AF37;">1</span>
              </h1>
              <div style="height: 2px; width: 40px; background-color: #D4AF37; margin-top: 10px;"></div>
            </td>
          </tr>

          <!-- Content Section -->
          <tr>
            <td style="padding: 20px 40px 40px 40px;">
              <h2 style="color: #D4AF37; font-size: 22px; font-weight: 800; margin: 0 0 20px 0;">${title}</h2>
              <p style="color: #ffffff; font-size: 16px; font-weight: 600; margin: 0 0 20px 0;">${greeting}</p>
              
              ${bodyLines.map(line => `<p style="color: #cccccc; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">${line}</p>`).join('')}

              ${ctaText && ctaUrl ? `
                <table border="0" cellpadding="0" cellspacing="0" style="margin-top: 35px; width: 100%;">
                  <tr>
                    <td align="center">
                      <a href="${ctaUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 14px; font-weight: bold; color: #000000; background-color: #D4AF37; border-radius: 8px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
                        ${ctaText}
                      </a>
                    </td>
                  </tr>
                </table>
              ` : ''}
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 20px; text-align: center;">
                <p style="color: #666666; font-size: 11px; margin: 0; line-height: 1.5;">
                  ${footerText || 'Este mensaje es confidencial y ha sido enviado por tu plataforma automatizada Skingif1.'}
                </p>
                <p style="color: #444444; font-size: 10px; margin: 10px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">
                  © 2026 SKINGIF1 MUNDIAL
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export async function sendRimanEmail(options: {
  to: string
  subject: string
  html: string
}): Promise<{ success: boolean; message: string }> {
  try {
    const transport = await getSmtpTransport()
    if (!transport) {
      return { success: false, message: 'SMTP no configurado' }
    }

    const { data: settings } = await supabaseAdmin
      .from('smtp_settings')
      .select('*')
      .single()

    const info = await transport.sendMail({
      from: `"Skingif1 Admin" <${settings.from_email}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    return { success: true, message: info.response }
  } catch (error: any) {
    console.error('Error enviando email RIMAN:', error)
    return { success: false, message: error.message }
  }
}

// 1. EVENTO: Bienvenida al Planner
export async function sendPlannerWelcomeEmail(to: string, idSkingif: string) {
  const html = buildRimanEmailTemplate({
    title: '¡Bienvenido Pionero a Skingif1!',
    greeting: 'Tu suscripción está activa.',
    bodyLines: [
      'Felicitaciones por asegurar tu posición en la red de K-Beauty más tecnológica del mercado.',
      'Tu sucursal digital y tu Escáner Facial con IA están listos para trabajar por ti 24/7.',
      `Tu enlace exclusivo es: <strong>skingif1.com/${idSkingif}/scanner</strong>`,
      'Te recomendamos entrar al Dashboard inmediatamente para configurar tu perfil y comenzar tus cursos de la Academia Express.'
    ],
    ctaText: 'Entrar a mi Oficina',
    ctaUrl: 'https://skingif1.com/riman/login'
  })
  return sendRimanEmail({ to, subject: '🚀 ¡Tu Sucursal Skingif1 está Activa!', html })
}

// 2. EVENTO: Alerta de Lead Nuevo (EL NERVIO DIGITAL)
export async function sendLeadAlertEmail(plannerEmail: string, clientName: string) {
  const html = buildRimanEmailTemplate({
    title: '¡NOTICIA BOMBA! 💣',
    greeting: '¡Alguien acaba de usar tu Escáner Facial!',
    bodyLines: [
      `El sistema detecta que <strong>${clientName}</strong> acaba de finalizar un diagnóstico facial usando tu enlace de socio.`,
      'La Inteligencia Artificial ya le entregó su receta de productos RIMAN.',
      '¡Es tu momento! Entra de inmediato a tu CRM, haz clic en las Acciones Sugeridas y envíale un WhatsApp de seguimiento para cerrar la venta.'
    ],
    ctaText: 'Abrir mi CRM Ahora',
    ctaUrl: 'https://skingif1.com/riman/dashboard'
  })
  return sendRimanEmail({ to: plannerEmail, subject: '🚨 ¡Nuevo Diagnóstico de Piel en tu Sucursal!', html })
}

// 3. EVENTO: Diagnóstico Médico al Cliente
export async function sendDiagnosticResultEmail(clientEmail: string, clientName: string, plannerId: string) {
  const html = buildRimanEmailTemplate({
    title: 'Tu Diagnóstico Facial K-Beauty',
    greeting: `Hola ${clientName},`,
    bodyLines: [
      'Gracias por confiar en el Escáner Facial Inteligente de Skingif1.',
      'Nuestra Inteligencia Artificial ha analizado los parámetros de tu piel (hidratación, textura, sensibilidad y líneas de expresión).',
      'Hemos diseñado un ritual de K-Beauty (Jeju) personalizado específicamente para reparar tu barrera cutánea.',
      'Puedes adquirir tu tratamiento directamente desde la tienda oficial segura.'
    ],
    ctaText: 'Comprar Mi Ritual',
    ctaUrl: `https://mall.riman.com/tu-carro?ref=${plannerId}`,
    footerText: 'Si tienes dudas, contesta a este correo para que tu Planner se ponga en contacto contigo.'
  })
  return sendRimanEmail({ to: clientEmail, subject: '✨ Tu Receta Dermatológica Skingif1', html })
}
