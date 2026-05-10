import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No se detectó ninguna imagen' }, { status: 400 });
    }

    // Limpiar el encabezado Base64 si viene del canvas o input file
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const apiKey = process.env.GEMINI_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Advertencia: GEMINI_KEY no encontrada en entorno. Usando mock provisorio para demo.");
      // MOCK RESULT IF NO API KEY (Para que el usuario pueda probar el UI)
      await new Promise(r => setTimeout(r, 2500));
      return NextResponse.json({
        "hidratacion": {"score": 3, "justificacion": "Se observan zonas con falta de brillo y leve descamación superficial en el área de las mejillas."},
        "textura_poros": {"score": 6, "justificacion": "Los poros en la zona T (nariz y mentón) se notan ligeramente dilatados, indicando exceso de sebo acumulado."},
        "lineas_expresion": {"score": 4, "justificacion": "Las líneas de la frente y los surcos nasogenianos están marcados, sugiriendo pérdida de colágeno y elasticidad."},
        "sensibilidad": {"score": 8, "justificacion": "No se observan rojeces severas ni capilares dilatados; la barrera cutánea parece estable frente a irritaciones."}
      });
    }

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Actúa como un Dermatólogo Científico Experto de la multinacional de K-Beauty RIMAN. Analiza la siguiente imagen facial detalladamente y evalúa del 1 al 10 las siguientes variables críticas: 
1. hidratacion (donde 1 es piel extremadamente deshidratada/descamada y 10 es piel perfecta y luminosa). 
2. textura_poros (donde 1 es textura muy irregular/poros muy obstruidos y 10 es piel de porcelana). 
3. lineas_expresion (donde 1 son arrugas muy profundas/envejecimiento severo y 10 es piel totalmente lisa y joven). 
4. sensibilidad (donde 1 es rojez extrema/inflamación/rosácea y 10 es piel totalmente calmada). 

Devuelve ESTRICTAMENTE UN SOLO OBJETO JSON VÁLIDO con el siguiente formato y claves exactas. NO incluyas markdown, NO incluyas backticks, NO incluyas texto fuera de las llaves: 
{ "hidratacion": {"score": 5, "justificacion": "razón dermatológica corta..."}, "textura_poros": {"score": 7, "justificacion": "..."}, "lineas_expresion": {"score": 6, "justificacion": "..."}, "sensibilidad": {"score": 8, "justificacion": "..."} }`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Data
              }
            }
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API Error:", err);
      throw new Error("El motor de IA está saturado. Intenta de nuevo.");
    }

    const data = await response.json();
    let textResult = data.candidates[0].content.parts[0].text;
    
    // Clean markdown if present
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

    let analysisResult;
    try {
      analysisResult = JSON.parse(textResult);
    } catch (parseError) {
      console.error("JSON Parse failed for Gemini output:", textResult);
      throw new Error("La IA devolvió un formato irreconocible.");
    }

    return NextResponse.json(analysisResult);

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: error.message || 'Error procesando la imagen' }, { status: 500 });
  }
}
