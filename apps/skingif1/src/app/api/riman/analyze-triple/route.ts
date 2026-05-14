import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { imagesBase64 } = await req.json();

    if (!imagesBase64 || !Array.isArray(imagesBase64) || imagesBase64.length !== 3) {
      return NextResponse.json({ error: 'Se requieren 3 imágenes (frontal, perfil izquierdo, perfil derecho)' }, { status: 400 });
    }

    // Clean Base64 headers
    const imagesData = imagesBase64.map(img => img.replace(/^data:image\/\w+;base64,/, ''));

    const apiKey = process.env.GEMINI_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Advertencia: GEMINI_KEY no encontrada. Usando mock provisorio.");
      await new Promise(r => setTimeout(r, 2500));
      return NextResponse.json({
        "edad_facial": { "score": 90, "justificacion": "Tu piel refleja vitalidad y firmeza, restando años a tu edad cronológica." },
        "brillo": { "score": 85, "justificacion": "Buena retención de luz, aunque puedes potenciar ese 'Glow' coreano." },
        "hidratacion": { "score": 72, "justificacion": "Tu barrera cutánea necesita agua para evitar la pérdida transepidérmica." },
        "carga_estres": { "score": 45, "justificacion": "Detectamos signos de fatiga y estrés oxidativo en el contorno facial." }
      });
    }

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Actúa como un Dermatólogo Científico Experto de la multinacional K-Beauty RIMAN. Analiza las siguientes 3 imágenes (Frontal, Perfil Izquierdo, Perfil Derecho) de un rostro humano.
Evalúa del 1 al 100 las siguientes 4 variables clínicas y proporciona una justificación concisa de alto impacto (1-2 oraciones) para cada una:
1. edad_facial (brecha de edad positiva, 100 es mejor)
2. brillo (Glow Score, luminosidad)
3. hidratacion (Hydration Level)
4. carga_estres (Skin Stress Load, donde 1 es mucho estrés/fatiga y 100 es piel súper relajada y saludable)

Devuelve ESTRICTAMENTE UN OBJETO JSON VÁLIDO con esta estructura exacta. NO incluyas markdown, NO backticks:
{
  "edad_facial": { "score": 85, "justificacion": "..." },
  "brillo": { "score": 88, "justificacion": "..." },
  "hidratacion": { "score": 78, "justificacion": "..." },
  "carga_estres": { "score": 90, "justificacion": "..." }
}`
            },
            { inline_data: { mime_type: "image/jpeg", data: imagesData[0] } },
            { inline_data: { mime_type: "image/jpeg", data: imagesData[1] } },
            { inline_data: { mime_type: "image/jpeg", data: imagesData[2] } }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
        responseMimeType: "application/json"
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("El motor de IA falló.");
    }

    const data = await response.json();
    let textResult = data.candidates[0].content.parts[0].text;
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(textResult));

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: 'Error procesando la imagen' }, { status: 500 });
  }
}
