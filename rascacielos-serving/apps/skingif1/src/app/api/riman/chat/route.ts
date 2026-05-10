import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { input, systemRole } = await req.json();

    if (!input) {
      return NextResponse.json({ error: 'Falta el prompt' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Advertencia: GEMINI_KEY no encontrada en entorno. Usando mock provisorio.");
      await new Promise(r => setTimeout(r, 2000));
      return NextResponse.json({
        text: `**Advertencia:** No se ha configurado la API de Gemini en el servidor.\n\nSimulación de respuesta basada en tu entrada: *${input}*\n\nPor favor, ingresa \`GEMINI_KEY\` en el archivo \`.env.local\`.`
      });
    }

    const payload = {
      contents: [
        {
          parts: [
            { text: input }
          ]
        }
      ],
      systemInstruction: {
        parts: [
          { text: systemRole || "Eres un asistente maestro experto en negocios y liderazgo para Skingif1." }
        ]
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
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
      throw new Error("El motor de IA está saturado o hubo un error de conexión.");
    }

    const data = await response.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResult) {
      throw new Error("La IA no devolvió ninguna respuesta válida.");
    }

    return NextResponse.json({ text: textResult });

  } catch (error: any) {
    console.error("Generation Error:", error);
    return NextResponse.json({ error: error.message || 'Error procesando la petición a la IA' }, { status: 500 });
  }
}
