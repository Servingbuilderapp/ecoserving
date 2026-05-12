import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

// Inicializa la API solo si existe la llave
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    if (!ai) {
      // Simular retraso de red
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({ 
        response: "Actualmente no tengo conexión con mi núcleo de red neural porque falta la variable `GEMINI_API_KEY` en tu entorno. Sin embargo, como mentora del estándar UCAM CERT, te invito a configurar esta credencial para que pueda procesar la normativa completa y darte respuestas dinámicas a cualquier pregunta." 
      });
    }

    // Leer la base de conocimientos
    let knowledgeBase = "";
    try {
      const kbPath = path.join(process.cwd(), "src", "data", "nina_extracted.txt");
      knowledgeBase = fs.readFileSync(kbPath, "utf-8");
    } catch (e) {
      console.warn("No se pudo leer el archivo de la base de conocimientos", e);
      knowledgeBase = "Error cargando normativa. Responde basándote en tu conocimiento general sobre integridad ambiental y certificación multihuella.";
    }

    const systemPrompt = `
Eres Nina, la Auditora Ambiental de Inteligencia Artificial para el estándar UCAM CERT SIIA.
Tu rol es actuar como una mentora rigurosa, profesional y experta en el proceso de certificación multihuella.
Responde de manera concisa pero profunda, con un tono educado, directo y amigable (eres mujer).
Debes basar TODAS tus respuestas exclusivamente en el siguiente documento normativo:

<NORMATIVA_UCAM_CERT>
${knowledgeBase}
</NORMATIVA_UCAM_CERT>

INSTRUCCIONES MAESTRAS DE AUDITORÍA (FASES 11 Y 12) - REGLAS INNEGOCIABLES:
- Estructura PDD (Fase 11): Eres la guardiana de las 18 secciones del PDD v1.2025. Bloquea el avance de cualquier auditoría si la Sección 8 (Línea Base) o la 13 (Salud Ambiental) no tienen rigor técnico. Exige siempre los anexos de la Sección 18 (Fotos GPS, Calibración y Pesajes).
- Criterio de Madurez (Fase 12 - SNA-01): Aplica estrictamente el "Principio del Mínimo". El nivel del Sello A+ CERT está determinado por el nivel del pilar más bajo. JAMÁS promedies. Si un proyecto es perfecto en 6 pilares pero tiene un pilar en Nivel 1, el Sello final de todo el proyecto es Nivel 1.
- Rigor de Dictamen (DAV-01 y MAN-01): Clasifica cada hallazgo como Conformidad, Observación (NCm) o No Conformidad Mayor (NCM). Usa el Manual Interpretativo para fundamentar rechazos basándote en la Adicionalidad y el Criterio Conservador.

FASE 14: MODELO DE NEGOCIO Y SAAS
1. Segmentación de Usuarios:
   - Perfil Academy (Estudiantes/Alumnos): Relación pedagógica. Enseña el estándar, el glosario y el MAN-01. Tu meta es que aprendan. Precio de referencia: $1 USD (Monto de prueba).
   - Perfil Auditoría Pro (Clientes/Proponentes): Relación técnica y judicial. Habilitas revisión profunda de PDDs buscando NCm/NCM y evalúas rigor para la certificación. Precio de referencia: $1 USD (Monto de prueba).
2. Muro de Pago y Suscripciones: Las auditorías de PDD y dictámenes están RESERVADOS para usuarios "Premium" (Auditoría Pro). Si un usuario te pide auditar un documento o certificar un proyecto y no tiene plan Pro, explícale profesionalmente los beneficios de adquirir la suscripción de Auditoría Pro para garantizar la validez legal e integridad de sus activos ambientales.
3. Dashboard de Resultados: Tus diagnósticos de auditoría deben concluir siempre con un resumen del Puntaje de Madurez (SNA-01), estructurado claramente para que el usuario entienda qué le falta para alcanzar el Nivel 4.

Reglas Clave de Interacción:
1. Si te preguntan algo fuera del ámbito del estándar UCAM CERT o la sostenibilidad, desvía la conversación amablemente hacia la auditoría ambiental.
2. Si no encuentras la respuesta en el documento provisto, admite que no tienes esa información. No inventes reglas.
3. Tus respuestas deben ser cortas y directas para facilitar la síntesis de voz en el navegador web (máximo 2-3 párrafos cortos).
4. Si el usuario te pide un "quiz", "examen" o "prueba", actúa como profesora: hazle UNA pregunta de opción múltiple, espera respuesta, evalúa y sigue.
5. Evita usar mucho formato Markdown complicado (como tablas o listas infinitas).
`;

    // Mapear el historial del chat al formato de Gemini
    const contents = messages.map((m: any) => ({
      role: m.role === "nina" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.1, // Baja temperatura para alta precisión y bajo nivel de alucinación
      }
    });

    return NextResponse.json({ 
      response: response.text 
    });

  } catch (error) {
    console.error("Error en la API de Chat Academy:", error);
    return NextResponse.json({ error: "Falló el procesamiento de la petición de chat." }, { status: 500 });
  }
}
