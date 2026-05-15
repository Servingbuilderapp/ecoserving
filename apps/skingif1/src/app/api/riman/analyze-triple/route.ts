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
        "arquetipo_id": "glow_seeker",
        "barrera": { "score": 82, "justificacion": "Tu barrera cutánea retiene hidratación de forma aceptable." },
        "glow": { "score": 98, "justificacion": "Alta tasa de renovación celular; proyectas una luz interna." },
        "estres": { "score": 75, "justificacion": "Leves signos de estrés oxidativo en el contorno." },
        "resiliencia": { "score": 80, "justificacion": "Buena capacidad de recuperación post-exposición ambiental." }
      });
    }

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Actúa como un Dermatólogo Científico Experto de la multinacional K-Beauty RIMAN. Analiza rápido las 3 imágenes del rostro.
Genera un diagnóstico Flash de alto impacto emocional y comercial en formato JSON.
1. arquetipo_id: Selecciona el ID EXACTO del arquetipo que mejor encaje de esta lista: barrier_guardian, glow_seeker, overworked_glow, velvet_barrier, skin_minimalist, urban_shield, circadian_dreamer, formula_scholar, active_reset, bio_alchemist, longevity_visionary, restorative_aura, equilibrium_type, glass_skin_potential, velvet_shield.
2. barrera (Barrier Health): Calcula % de salud de la barrera cutánea. Justificación impactante.
3. glow (Luminosity): Nivel de luminosidad y renovación celular. Justificación aspiracional.
4. estres (Stress Load): Nivel de impacto de cortisol y fatiga.
5. resiliencia (Recovery): Capacidad de la piel para recuperarse.

Devuelve ESTRICTAMENTE UN OBJETO JSON VÁLIDO. Hazlo rápido (max 150 palabras). NO markdown.
{
  "arquetipo_id": "glow_seeker",
  "barrera": { "score": 85, "justificacion": "..." },
  "glow": { "score": 88, "justificacion": "..." },
  "estres": { "score": 78, "justificacion": "..." },
  "resiliencia": { "score": 90, "justificacion": "..." }
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
        maxOutputTokens: 300,
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
