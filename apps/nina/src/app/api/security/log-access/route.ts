import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { portalName } = await req.json();
    const email = user.email || "";

    const isAuthorized = email === "iagif1964@gmail.com";

    // Forwarded IP tracking if behind proxy/Vercel
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    // Insert into Supabase
    await supabase.from("access_logs").insert({
      user_id: user.id,
      email: email,
      portal_name: portalName || "Nina",
      is_authorized: isAuthorized,
      ip_address: ip,
      user_agent: req.headers.get("user-agent") || "unknown"
    });

    // If unauthorized, send email alert
    if (!isAuthorized && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true" || false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"Security Bot" <${process.env.SMTP_USER}>`,
        to: "iagif1964@gmail.com",
        subject: `🚨 ALERTA: Acceso NO autorizado en ${portalName || "Nina"}`,
        html: `
          <h2>Alerta de Seguridad</h2>
          <p>Un usuario no autorizado ha entrado al portal <b>${portalName || "Nina"}</b>.</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Fecha y Hora:</strong> ${new Date().toISOString()}</p>
          <p><strong>IP:</strong> ${ip}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true, authorized: isAuthorized });
  } catch (error: any) {
    console.error("Error logging access:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
