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
        "salud_piel": 88,
        "brillo": 85,
        "edad_facial": 90,
        "hidratacion": 72,
        "elasticidad": 86,
        "varianza_pigmentacion": 80,
        "profundidad_arrugas": 78,
        "textura_poros": 82
      });
    }

      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Actúa como un Dermatólogo Científico Experto de la multinacional de K-Beauty RIMAN. Analiza la siguiente imagen facial detalladamente y evalúa del 1 al 100 las siguientes variables críticas: 
1. salud_piel (donde 1 es muy mala salud y 100 es salud óptima).
2. brillo (donde 1 es opaca y 100 es brillo radiante).
3. edad_facial (calcula una brecha de edad positiva, 100 es lo mejor).
4. hidratacion (donde 1 es piel extremadamente deshidratada/descamada y 100 es piel perfecta y luminosa). 
5. elasticidad (donde 1 es muy flácida y 100 es firme).
6. varianza_pigmentacion (donde 1 es manchas extremas y 100 es tono parejo).
7. profundidad_arrugas (donde 1 son arrugas muy profundas/envejecimiento severo y 100 es piel totalmente lisa y joven). 
8. textura_poros (donde 1 es textura muy irregular/poros muy obstruidos y 100 es piel de porcelana). 

Devuelve ESTRICTAMENTE UN SOLO OBJETO JSON VÁLIDO con el siguiente formato y claves exactas. NO incluyas markdown, NO incluyas backticks, NO incluyas texto fuera de las llaves: 
{ "salud_piel": 92, "brillo": 88, "edad_facial": 85, "hidratacion": 78, "elasticidad": 90, "varianza_pigmentacion": 82, "profundidad_arrugas": 75, "textura_poros": 89 }`
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
