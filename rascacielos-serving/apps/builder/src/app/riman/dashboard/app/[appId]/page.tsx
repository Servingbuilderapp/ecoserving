'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, Send, Bot, CheckCircle2, Sparkles, Megaphone, Target, Music, Star, Stethoscope, Activity, FileText, Wallet, Mail, Settings, Award, TrendingUp, Copy, Download, RefreshCcw, BookOpen, Network, Compass, Users } from 'lucide-react';
import { IdeaGenerator } from '@/components/landing/IdeaGenerator';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Configuración específica para que CADA app tenga su propia personalidad, prompts y placeholders
const AI_APP_CONFIG: Record<string, any> = {
  kpop: {
    placeholder: "Ej: Quiero lanzar una campaña para el contorno de ojos Botalab usando la tendencia K-Pop de NewJeans...",
    quickActions: ["Guion para TikTok", "Estrategia Meta Ads", "Copys para Instagram"],
    systemRole: "Experto en marketing digital y tendencias K-Pop para Skingif1.",
    aiGreeting: "Soy tu estratega K-Pop. Ingresa tu objetivo publicitario y crearé una campaña viral."
  },
  derma: {
    placeholder: "Ej: Cliente femenina de 35 años, presenta melasma leve en mejillas y piel muy seca...",
    quickActions: ["Protocolo Anti-Manchas", "Rutina Hidratación Extrema", "Análisis de Ingredientes"],
    systemRole: "Dermatólogo IA experto en los productos Riman Incellderm.",
    aiGreeting: "Ingresa los síntomas o el tipo de piel de tu cliente para generar una rutina dermatológica precisa."
  },
  objeciones: {
    placeholder: "Ej: El cliente dice que Incellderm es muy costoso en comparación con marcas de farmacia...",
    quickActions: ["Rebatir Precio", "Rebatir Falta de Tiempo", "Rebatir 'No conozco la marca'"],
    systemRole: "Master en ventas directas y neuroventas especializado en Riman.",
    aiGreeting: "Escribe la objeción que te dio tu cliente y te daré el script exacto de neuroventas para cerrarlo."
  },
  fidelizacion: {
    placeholder: "Ej: Tengo una clienta que compró hace 1 mes el set Botalab y no ha vuelto a escribir...",
    quickActions: ["Mensaje de Seguimiento", "Oferta de Reactivación", "Encuesta de Satisfacción"],
    systemRole: "Especialista en Customer Success y Retención.",
    aiGreeting: "No dejes ir a tus clientes. Escribe el caso y te daré la estrategia exacta para que vuelvan a comprar."
  },
  // Default config para las demás
  default: {
    placeholder: "Describe detalladamente lo que necesitas que la IA resuelva por ti...",
    quickActions: ["Mejorar texto", "Crear estrategia paso a paso", "Generar ideas clave"],
    systemRole: "Asistente Maestro de Skingif1.",
    aiGreeting: "Soy tu asistente de inteligencia artificial avanzado. ¿En qué te ayudo hoy?"
  }
};

function AISpecializedEngine({ app }: { app: any }) {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Dynamic Config Generator for Apps without specific config
  const config = AI_APP_CONFIG[app.id] || {
    placeholder: `Describe el escenario o la información que necesitas procesar en el módulo de ${app.title}...`,
    quickActions: [`Estrategia para ${app.title}`, "Mejores prácticas", "Analizar situación"],
    systemRole: `Eres el Asistente Maestro experto en ${app.title} para la corporación Riman. Tu deber es dar consejos altamente técnicos y procesables.`,
    aiGreeting: `Hola, soy tu especialista en ${app.title}. Explícame la situación y te daré un plan de acción.`
  };

  const handleGenerate = async (customInput?: string) => {
    const textToProcess = customInput || input;
    if (!textToProcess) return;
    
    setIsGenerating(true);
    setInput(textToProcess); // update input if quick action was used

    try {
      const res = await fetch('/api/riman/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: textToProcess,
          systemRole: config.systemRole
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en la respuesta del servidor');

      setResult(data.text);
    } catch (err: any) {
      console.error(err);
      setResult(`**Error de Conexión:** ${err.message}\n\nPor favor, verifica tu clave de API o tu conexión a internet.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
        
        {/* PANEL IZQUIERDO: INPUT Y CONTEXTO */}
        <div className="xl:col-span-5 flex flex-col h-full">
          <div className="p-8 bg-[#0a0a0a] border border-neutral-800 rounded-3xl h-full flex flex-col relative overflow-hidden">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-64 h-64 ${app.bg} blur-[100px] rounded-full opacity-30 -translate-y-1/2 translate-x-1/2`} />

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-800">
              <div className={`w-16 h-16 rounded-2xl ${app.bg} flex items-center justify-center`}>
                <app.icon className={`w-8 h-8 ${app.color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{app.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-emerald-500 font-bold tracking-widest uppercase">Motor IA Online</span>
                </div>
              </div>
            </div>

            <p className="text-neutral-400 text-base mb-6 leading-relaxed font-medium">
              {config.aiGreeting}
            </p>

            <div className="flex-1 flex flex-col space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {config.quickActions.map((action: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => handleGenerate(`Quiero: ${action}`)}
                    className="text-xs font-bold px-4 py-2 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all shadow-sm"
                  >
                    + {action}
                  </button>
                ))}
              </div>

              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={config.placeholder}
                className="w-full flex-1 min-h-[220px] bg-black border border-neutral-800 rounded-2xl p-6 text-lg text-white placeholder:text-neutral-700 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none shadow-inner leading-relaxed"
              />
            </div>

            <div className="mt-6">
              <GlowButton 
                onClick={() => handleGenerate()} 
                disabled={isGenerating || !input}
                className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 text-lg font-extrabold transition-all ${isGenerating ? 'opacity-80' : ''}`}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-3 text-white">
                    <RefreshCcw className="w-6 h-6 animate-spin" /> Procesando Arquitectura...
                  </span>
                ) : (
                  <span className="flex items-center gap-3 text-white">
                    <Sparkles className="w-6 h-6" /> GENERAR RESULTADO IA
                  </span>
                )}
              </GlowButton>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: RESULTADO / INFORME */}
        <div className="xl:col-span-7">
          <div className={`bg-[#050505] border border-neutral-800 rounded-3xl h-full min-h-[600px] flex flex-col ${result ? 'border-[#D4AF37]/40 shadow-[0_0_40px_rgba(212,175,55,0.08)]' : ''} transition-all duration-500 overflow-hidden`}>
            
            {/* Header del Informe */}
            <div className="bg-[#0a0a0a] p-6 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className={`w-7 h-7 ${result ? app.color : 'text-neutral-600'}`} />
                <h3 className={`text-xl font-bold ${result ? 'text-white' : 'text-neutral-600'}`}>
                  Informe Analítico y Estrategia
                </h3>
              </div>
              {result && (
                <div className="flex gap-2">
                  <button className="p-3 bg-neutral-900 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors" title="Copiar al portapapeles">
                    <Copy className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-neutral-900 rounded-xl hover:bg-[#D4AF37]/20 text-neutral-400 hover:text-[#D4AF37] transition-colors border border-transparent hover:border-[#D4AF37]/50" title="Descargar Reporte PDF">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Cuerpo del Informe */}
            <div className="p-10 flex-1 overflow-y-auto">
              {!result ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-6 py-24">
                  <div className="relative">
                    <Brain className="w-24 h-24 opacity-10" />
                    <Sparkles className="w-8 h-8 absolute -top-2 -right-2 opacity-20 text-[#D4AF37]" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-medium">El motor de IA está en espera</p>
                    <p className="text-base opacity-60">Selecciona una acción rápida o ingresa tu consulta en el panel izquierdo.</p>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <div className={`prose prose-invert max-w-none prose-p:text-neutral-300 prose-headings:text-[#D4AF37] prose-a:text-[#D4AF37] prose-strong:text-white marker:text-[#D4AF37]`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {result}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function AppDynamicPage({ params }: { params: Promise<{ appId: string }> }) {
  const resolvedParams = React.use(params);
  const appId = resolvedParams.appId;

  // Mapa de aplicaciones y su metadata para identificar el estilo
  const appData: Record<string, any> = {
    ideas: {
      id: "ideas",
      title: "Content Ideas",
      icon: Megaphone,
      color: "text-[#ec4899]",
      bg: "bg-[#ec4899]/10",
      content: <IdeaGenerator userPlan="premium" mode="ideas" ideasCount={5} />
    },
    tracker: { id: "tracker", title: "Rewards Tracker", icon: TrendingUp, color: "text-[#14b8a6]", bg: "bg-[#14b8a6]/10" },
    kpop: { id: "kpop", title: "K-Pop Ads & Trends", icon: Music, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
    influencer: { id: "influencer", title: "Influencers Tracker", icon: Star, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10" },
    derma: { id: "derma", title: "Derma Guide AI", icon: Stethoscope, color: "text-[#14b8a6]", bg: "bg-[#14b8a6]/10" },
    diseases: { id: "diseases", title: "Afecciones Dermatológicas", icon: Activity, color: "text-[#ef4444]", bg: "bg-[#ef4444]/10" },
    ingredients: { id: "ingredients", title: "Ingredients Wiki", icon: FileText, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
    wallet: { id: "wallet", title: "Billetera Virtual", icon: Wallet, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10" },
    email: { id: "email", title: "Correos Inteligentes", icon: Mail, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10" },
    profile: { id: "profile", title: "Perfil y Configuración", icon: Settings, color: "text-[#4b5563]", bg: "bg-[#4b5563]/10" },
    cert: { id: "cert", title: "Diplomas y Certificados", icon: Award, color: "text-[#ec4899]", bg: "bg-[#ec4899]/10" },
    glosario: { id: "glosario", title: "Glosario Jeju", icon: BookOpen, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10" },
    eventos: { id: "eventos", title: "Gestor de Eventos", icon: Target, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10" },
    scripts: { id: "scripts", title: "Scripts de Cierre", icon: FileText, color: "text-[#ec4899]", bg: "bg-[#ec4899]/10" },
    objeciones: { id: "objeciones", title: "Manejo de Objeciones", icon: Brain, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10" },
    fidelizacion: { id: "fidelizacion", title: "Fidelización Clientes", icon: Star, color: "text-[#14b8a6]", bg: "bg-[#14b8a6]/10" },
    liderazgo: { id: "liderazgo", title: "Academia de Liderazgo", icon: Award, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10" }
  };

  const app = appData[appId] || { id: appId, title: `Módulo: ${appId.toUpperCase()}`, icon: Sparkles, color: "text-white", bg: "bg-white/10" };
  const Icon = app.icon || Sparkles;
  app.icon = Icon; // Ensure icon is available in app object

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-[1500px] mx-auto">
        <Link href="/riman/dashboard" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 bg-[#111] px-5 py-2.5 rounded-xl transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
        </Link>

        {/* Content */}
        {app.content ? (
          <div className="mt-4">
            <div className="flex items-center gap-4 mb-12">
              <div className={`w-16 h-16 rounded-2xl ${app.bg} flex items-center justify-center`}>
                <Icon className={`w-8 h-8 ${app.color}`} />
              </div>
              <div>
                <h1 className="text-4xl font-black">{app.title}</h1>
                <p className="text-neutral-500 mt-1">Motor funcional y operativo.</p>
              </div>
            </div>
            {app.content}
          </div>
        ) : (
          <AISpecializedEngine app={app} />
        )}
      </div>
    </div>
  );
}
