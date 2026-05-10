"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import MetodologiaHub from '@/components/auditoria/MetodologiaHub';

type Message = {
  role: "nina" | "user" | "proactive" | "alert" | "system";
  content: string;
};

const pddSections = [
  { 
    title: "1. Encabezado Oficial", 
    prompt: "Vamos a configurar el Encabezado Oficial del PDD. Por favor indícame el nombre legal de la organización y el título propuesto para este proyecto ambiental.",
    proactiveContext: "💡 Para la validez legal, el nombre debe coincidir exactamente con el registro comercial. Sigue adelante indicándome estos datos.",
    valueAlert: "Excelente. Datos iniciales registrados y validados."
  },
  { 
    title: "2. Síntesis Técnica", 
    prompt: "Para la Síntesis Técnica, necesito un resumen ejecutivo sobre los objetivos principales de mitigación o adaptación de tu proyecto.",
    proactiveContext: "💡 Sé conciso pero específico: menciona qué recurso proteges o qué daño mitigas. Continúa escribiendo tu resumen.",
    valueAlert: "Resumen técnico guardado. Esto da claridad inmediata a nuestro panel de auditores."
  },
  { 
    title: "3. Fundamentos del Estándar", 
    conceptTitle: "UCAM CERT SIIA & Pilar 2",
    conceptDescription: "La UCAM (Unidad de Activo Ambiental Multihuella) no es un bono tradicional. Representa una mejora verificada en la salud del ecosistema. Su corazón es el Pilar 2 (Ciencia Médica-Ambiental), lo que significa que diagnosticamos y tratamos al medio ambiente como un paciente vivo, no solo medimos carbono.",
    prompt: "En esta sección, confirmaremos tu alineación con el estándar UCAM CERT SIIA. ¿A cuál de las 7 categorías (HPR, HP, HC, HH, CE, SE, ED) pertenece tu iniciativa?",
    proactiveContext: "💡 Elegir la categoría correcta es vital porque determina la metodología de cálculo que usaremos. Adelante con tu elección.",
    valueAlert: "Categoría validada. Ya estamos en el marco metodológico correcto."
  },
  { 
    title: "4. Gobernanza Institucional", 
    prompt: "Hablemos de Gobernanza. ¿Quiénes son los responsables legales y técnicos del proyecto? Necesitaré conocer sus políticas de sostenibilidad corporativa.",
    proactiveContext: "💡 La gobernanza asegura que el proyecto trasciende a las personas y se arraiga en la institución. Sigue detallando el equipo.",
    valueAlert: "Estructura de gobernanza documentada exitosamente."
  },
  { 
    title: "5. Línea de Base y Adicionalidad", 
    conceptTitle: "Adicionalidad y Línea de Base",
    conceptDescription: "La Adicionalidad es el principio que asegura que el impacto ambiental positivo NO habría ocurrido sin la existencia de este proyecto. No premiamos lo que ya iba a pasar por inercia, premiamos el esfuerzo extra. La Línea de Base es la fotografía del problema antes de tu intervención.",
    prompt: "Entrando a la Línea de Base (Pilar 5). ¿Qué datos históricos tienes documentados sobre tu impacto ambiental ANTES de implementar el proyecto?",
    proactiveContext: "💡 Necesitamos evidencia medible (ej. facturas de luz anteriores, análisis de agua previos). Describe lo que tienes y avanzamos.",
    valueAlert: "Línea de base establecida. Ahora podemos medir la verdadera cura."
  },
  { 
    title: "6. Definición del Proyecto", 
    prompt: "Define detalladamente las actividades del proyecto, la ubicación geográfica exacta y la tecnología o estrategias que estás implementando.",
    proactiveContext: "💡 Entre más detallada la ubicación (coordenadas GPS), mayor trazabilidad. Procede con la descripción.",
    valueAlert: "Proyecto definido. Las coordenadas blindan la ubicación de tu activo."
  },
  { 
    title: "7. Metodología UCAM", 
    prompt: "Basado en la categoría elegida, aplicaremos la metodología UCAM correspondiente. ¿Tienes los cálculos preliminares de reducción de impacto?",
    proactiveContext: "💡 Si no tienes cálculos exactos, ingresa un estimado y el sistema te ayudará a refinarlos después. Continúa.",
    valueAlert: "Metodología asignada. Fórmulas paramétricas listas."
  },
  { 
    title: "8. Sistema MRV", 
    conceptTitle: "Sistema MRV",
    conceptDescription: "MRV significa Monitoreo, Reporte y Verificación. Es la garantía absoluta de que todo impacto se mide con rigor científico, se reporta con transparencia y se verifica independientemente. Piensa en ello como el historial clínico inviolable de tu ecosistema.",
    prompt: "Para el sistema de MRV, ¿qué equipos de medición o software de trazabilidad utilizarás durante la vida del proyecto?",
    proactiveContext: "💡 Menciona marcas de sensores, software de IoT, o entidades que calibran tus equipos. Adelante con tus equipos.",
    valueAlert: "¡Perfecto! Un MRV sólido blinda la transparencia de tu activo ambiental."
  },
  { 
    title: "9. Calidad de Datos", 
    conceptTitle: "Criterio Conservador",
    conceptDescription: "El Criterio Conservador es nuestra armadura de titanio contra el greenwashing. Ante cualquier duda o margen de error en las mediciones, siempre asumimos el escenario que arroje el MENOR beneficio ambiental. Preferimos subestimar nuestro impacto que sobreestimarlo.",
    prompt: "Evaluemos la Calidad de Datos. ¿Qué nivel de incertidumbre tienen tus mediciones? Necesitaremos aplicar los factores de descuento conservadores de UCAM.",
    proactiveContext: "💡 Por ejemplo, si tu sensor tiene +-5% de error, aplicaremos un descuento del 5% al impacto total. Indícame la incertidumbre.",
    valueAlert: "Criterio conservador aplicado. Tu certificado ahora es estadísticamente indiscutible."
  },
  { 
    title: "10. Trazabilidad de Cadena", 
    prompt: "Sobre la Trazabilidad (Pilar 6), ¿cómo aseguras que el impacto ambiental positivo no se esté contabilizando dos veces (Double Counting) a lo largo de tu cadena de valor?",
    proactiveContext: "💡 El Doble Conteo invalida los créditos en el mercado internacional. Explica tus mecanismos de control y sigue.",
    valueAlert: "Riesgo de doble conteo mitigado. Excelente trabajo."
  },
  { 
    title: "11. Evidencia del Proyecto", 
    prompt: "Por favor, adjunta o describe las evidencias documentales que subirás: facturas, registros fotográficos, certificaciones de calibración.",
    proactiveContext: "💡 Noto dificultades con este tipo de archivos frecuentemente; recuerda que para la validez del Sello A+, la imagen debe ser original de cámara con GPS activo. Describe qué subirás.",
    valueAlert: "Evidencias pre-aprobadas para sellado criptográfico."
  },
  { 
    title: "12. Impacto de Salud Ambiental", 
    prompt: "Evalúa el Pilar 2 (Química y Salud): ¿El proyecto utiliza, genera o reduce sustancias químicas peligrosas? Requerimos el análisis de mitigación toxicológica.",
    proactiveContext: "💡 Este es el diferencial clave. Si eliminas plásticos, estás reduciendo microplásticos tóxicos. Cuéntame los detalles.",
    valueAlert: "Análisis toxicológico integrado. El paciente-ecosistema está mejorando."
  },
  { 
    title: "13. Integración ESG", 
    prompt: "A nivel ESG, ¿cómo contribuye el proyecto a la equidad social en la comunidad local y qué políticas de gobernanza económica se aplican?",
    proactiveContext: "💡 Menciona empleos generados, mejoras en la salud de la comunidad o equidad de género. Continúa.",
    valueAlert: "Variables ESG consolidadas. Tu proyecto tiene impacto humano directo."
  },
  { 
    title: "14. Auditoría y Emisión", 
    conceptTitle: "Trazabilidad Inalterable (CUV)",
    conceptDescription: "El CUV (Código Único de Validación) es el sello criptográfico final. Convierte todos los datos que hemos recopilado y verificado en un activo digital inmutable. Garantiza que tu UCAM no puede ser alterada ni duplicada.",
    prompt: "Hemos llegado a la fase final. He revisado todo tu PDD compilado. Todo está conforme a la normativa.\n\nEl Comité Técnico ha autorizado la certificación.\n\nTu Código Único de Validación ha sido emitido:\n**UCAM-HC-SALARG-2026-DEMO001**",
    proactiveContext: "💡 Este es el paso final. Confirma que estás de acuerdo para sellar la emisión oficial.",
    valueAlert: "¡Felicidades! Certificado emitido."
  }
];

const dictionaryConcepts = pddSections.filter(s => s.conceptTitle);

export default function AuditoriaPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showGlobalDictionary, setShowGlobalDictionary] = useState(false);
  const [selectedConceptTitle, setSelectedConceptTitle] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showModal]);

  // Initial load logic
  useEffect(() => {
    if (isInitializing) {
      const sec = pddSections[0];
      if (sec.conceptTitle) {
        setShowModal(true);
      } else {
        setMessages([
          { role: "proactive", content: sec.proactiveContext },
          { role: "nina", content: sec.prompt }
        ]);
      }
      setIsInitializing(false);
    }
  }, [isInitializing]);

  const progress = Math.round((currentSection / (pddSections.length - 1)) * 100);

  const handleConceptAcknowledge = () => {
    setShowModal(false);
    const sec = pddSections[currentSection];
    
    // Only add messages if they aren't already the last ones (prevents dupes when jumping)
    setMessages(prev => {
      const isAlreadyAdded = prev.length >= 2 && prev[prev.length - 1].content === sec.prompt;
      if (isAlreadyAdded) return prev;
      
      return [
        ...prev,
        { role: "proactive", content: sec.proactiveContext },
        { role: "nina", content: sec.prompt }
      ];
    });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    
    setTimeout(() => {
      if (currentSection < pddSections.length - 1) {
        const nextSecIdx = currentSection + 1;
        
        // Alerta de Valor del paso anterior
        setMessages(prev => [...prev, { role: "alert", content: pddSections[currentSection].valueAlert }]);
        
        setTimeout(() => {
          setCurrentSection(nextSecIdx);
          const nextSec = pddSections[nextSecIdx];
          
          // Si la nueva sección tiene concepto, mostrar modal. Si no, mostrar directo en chat.
          if (nextSec.conceptTitle) {
            setShowModal(true);
          } else {
            setMessages(prev => [
              ...prev, 
              { role: "proactive", content: nextSec.proactiveContext },
              { role: "nina", content: nextSec.prompt }
            ]);
          }
        }, 1200);
      } else {
         setMessages(prev => [...prev, { role: "alert", content: pddSections[currentSection].valueAlert }]);
      }
    }, 500);
  };

  const jumpToSection = (idx: number) => {
    setCurrentSection(idx);
    setShowModal(false);
    const sec = pddSections[idx];
    
    setMessages(prev => [
      ...prev,
      { role: "system", content: `[Admin] Saltando a la sección: ${sec.title}` }
    ]);
    
    setTimeout(() => {
      if (sec.conceptTitle) {
        setShowModal(true);
      } else {
        setMessages(prev => [
          ...prev,
          { role: "proactive", content: sec.proactiveContext },
          { role: "nina", content: sec.prompt }
        ]);
      }
    }, 300);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      
      {/* Modal: Diccionario del Éxito */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-surface border border-brand-blue/30 p-8 rounded-2xl max-w-lg w-full shadow-[0_0_40px_rgba(14,165,233,0.15)] transform transition-all scale-100 animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4 text-brand-blue">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h2 className="text-xl font-bold tracking-wide">Diccionario del Éxito</h2>
            </div>
            
            <h3 className="text-2xl font-extrabold text-white mb-3">
              {pddSections[currentSection].conceptTitle}
            </h3>
            
            <p className="text-gray-300 leading-relaxed mb-8 text-lg">
              {pddSections[currentSection].conceptDescription}
            </p>
            
            <button 
              onClick={handleConceptAcknowledge}
              className="w-full py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-blue/20 flex justify-center items-center gap-2"
            >
              <span>Entendido, continuar</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Hub Metodológico */}
      {showGlobalDictionary && (
        <MetodologiaHub onClose={() => setShowGlobalDictionary(false)} />
      )}

      {/* Sidebar: PDD Structure */}
      <aside className="w-80 border-r border-white/10 bg-surface/50 backdrop-blur-md flex flex-col z-10">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight">
            Nina<span className="text-brand-orange">.</span>
          </Link>
          <span className="text-xs font-mono text-brand-blue bg-brand-blue/10 px-2 py-1 rounded">v1.1</span>
        </div>
        
        {/* Nina Photo Placeholder */}
        <div className="p-4 border-b border-white/10 flex flex-col items-center">
          <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-brand-orange shadow-[0_0_20px_rgba(249,115,22,0.2)] mb-3 group">
            <Image 
              src="/nina.jpeg" 
              alt="Nina - UCAM CERT" 
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <h3 className="font-bold text-white tracking-wide">Agente Nina</h3>
          <p className="text-xs text-brand-blue font-medium">Mentora de Proceso</p>
        </div>

        <div className="p-4 border-b border-white/10">
          <button 
            onClick={() => {
              setShowGlobalDictionary(true);
              setSelectedConceptTitle(dictionaryConcepts[0]?.conceptTitle || null);
            }}
            className="w-full py-3 px-4 bg-brand-orange/20 hover:bg-brand-orange/30 border border-brand-orange/50 text-brand-orange font-bold rounded-xl transition-all shadow-lg shadow-brand-orange/10 flex items-center justify-center gap-2"
          >
            <span className="text-lg">📖</span>
            <span>Aprender Metodología</span>
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4 ml-2">Menú Interactivo (Admin)</h3>
          <ul className="space-y-1">
            {pddSections.map((section, idx) => (
              <li key={idx}>
                <button 
                  onClick={() => jumpToSection(idx)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all flex items-center ${
                    idx === currentSection 
                      ? 'bg-brand-blue/10 text-brand-blue font-medium border border-brand-blue/20 shadow-[0_0_10px_rgba(14,165,233,0.1)]' 
                      : idx < currentSection 
                        ? 'text-gray-300 hover:bg-white/5' 
                        : 'text-gray-500 hover:bg-white/5'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mr-3 shrink-0 ${idx < currentSection ? 'bg-green-500' : idx === currentSection ? 'bg-brand-blue animate-pulse' : 'bg-gray-700'}`}></span>
                  <span className="truncate">{section.title}</span>
                  {section.conceptTitle && <span className="ml-auto text-xs opacity-50" title="Contiene concepto didáctico">📚</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 border-t border-white/10">
          <div className="bg-gradient-to-r from-brand-orange/20 to-brand-blue/20 p-4 rounded-xl border border-white/5 text-sm">
            <p className="text-gray-300 mb-2">Progreso del Diagnóstico</p>
            <div className="w-full bg-surface-hover rounded-full h-1.5 mb-2">
              <div className="bg-gradient-to-r from-brand-orange to-brand-blue h-1.5 rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-xs text-right text-brand-blue font-mono">{progress}% Completado</p>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center px-8 justify-between bg-surface/30 backdrop-blur-sm z-10">
          <div className="flex items-center">
            <div className="ml-2">
              <h2 className="font-semibold text-gray-100">Auditoría en Curso</h2>
              <p className="text-xs text-green-400 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                Nina conectada • Mentoría Activa
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => {
                setIsInitializing(true);
                setCurrentSection(0);
                setMessages([]);
              }}
              className="text-sm font-bold px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover border border-white/10 transition-colors text-gray-300"
            >
              🔄 Reiniciar
            </button>
            <button className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-blue/20 text-brand-blue hover:bg-brand-blue/30 border border-brand-blue/50 transition-colors">
              Exportar PDD Parcial
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar for Nina/Proactive/Alert */}
                {['nina', 'proactive', 'alert'].includes(msg.role) && (
                  <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden border border-brand-blue flex items-center justify-center bg-surface relative mb-1">
                    <Image src="/nina.jpeg" alt="Nina" fill className="object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                  </div>
                )}
                
                {/* System Message */}
                {msg.role === 'system' && (
                  <div className="w-full text-center my-4">
                    <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">{msg.content}</span>
                  </div>
                )}

                {/* User Message */}
                {msg.role === 'user' && (
                  <div className="p-4 rounded-2xl bg-surface-hover border border-white/5 text-gray-200 rounded-br-sm shadow-sm">
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                )}

                {/* Nina Prompt */}
                {msg.role === 'nina' && (
                  <div className="p-4 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 text-gray-100 rounded-bl-sm shadow-[0_0_15px_rgba(14,165,233,0.05)]">
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                )}

                {/* Proactive Context (Mentorship) */}
                {msg.role === 'proactive' && (
                  <div className="p-3.5 rounded-2xl bg-surface border border-white/10 text-gray-300 rounded-bl-sm shadow-inner relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500/50"></div>
                    <div className="pl-2">
                      <span className="text-xs font-bold text-yellow-500/80 uppercase tracking-wider mb-1 block">Contexto de la Mentora</span>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                )}

                {/* Value Alert */}
                {msg.role === 'alert' && (
                  <div className="p-3.5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-100 rounded-bl-sm shadow-[0_0_15px_rgba(34,197,94,0.05)] relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                    <div className="pl-2 flex gap-2 items-start">
                      <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="text-xs font-bold text-green-400 uppercase tracking-wider mb-0.5 block">Alerta de Valor</span>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-surface/30 backdrop-blur-md border-t border-white/10 relative z-10">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={showModal}
              placeholder={showModal ? "Lee el concepto para continuar..." : "Escribe tu respuesta o presiona Enter para avanzar..."}
              className="w-full bg-surface border border-white/10 rounded-full py-4 pl-6 pr-16 text-gray-200 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors shadow-inner disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!input.trim() || showModal}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-blue hover:bg-brand-blue-dark flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

