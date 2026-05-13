"use client";

import React from "react";
import Link from "next/link";
import { Camera, ArrowRight, UserCircle2, Sparkles, Droplets, ArrowUpCircle, Sun, Activity, Maximize, AlertCircle, Bot } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScoreDial } from "@/components/ui/ScoreDial";

export default function SkinIQDashboard() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const scores = [
    { label: "Índice de Salud de la Piel™", value: 92, icon: Activity },
    { label: "Puntuación de Brillo (Glow)™", value: 88, icon: Sparkles },
    { label: "Brecha de Edad Facial™", value: 85, icon: UserCircle2 },
    { label: "Nivel de Hidratación", value: 78, icon: Droplets },
    { label: "Índice de Elasticidad", value: 90, icon: ArrowUpCircle },
    { label: "Varianza de Pigmentación", value: 82, icon: Sun },
    { label: "Profundidad de Arrugas", value: 75, icon: AlertCircle },
    { label: "Poros y Textura", value: 89, icon: Maximize },
  ];

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center animate-pulse-ring">
        <Sparkles className="w-12 h-12 text-[#D4AF37] mb-4 animate-spin-slow" />
        <h2 className="text-2xl font-display font-bold text-[#1A1A1A]">Analizando SkinIQ...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-12 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            Análisis Premium
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1A1A1A] tracking-tight">
            Tu Dashboard SkinIQ™
          </h1>
          <p className="text-neutral-600 mt-2 text-lg">
            Descubre los 8 biomarcadores esenciales de tu piel.
          </p>
        </div>
        
        <Link href="/capture">
          <button className="bg-[#1A1A1A] text-white font-bold py-3 px-6 rounded-full hover:bg-black transition-colors flex items-center gap-2 shadow-xl hover:scale-105 transform">
            <Camera className="w-5 h-5" />
            Nueva Captura Triple
          </button>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Facial Heatmap / Overview */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#F2E8DF]/80 to-[#EAE0D7]/80">
            <div className="relative w-full max-w-xs aspect-[3/4] rounded-[3rem] border border-white/40 overflow-hidden shadow-2xl mb-8 group">
              <div className="absolute inset-0 bg-black/5 z-10" />
              {/* Simulated Heatmap Overlay */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center mix-blend-multiply opacity-80" />
              <div className="absolute top-[30%] left-[25%] w-16 h-16 bg-[#10B981] rounded-full blur-[30px] opacity-60 mix-blend-screen" />
              <div className="absolute top-[45%] right-[20%] w-20 h-20 bg-[#D4AF37] rounded-full blur-[40px] opacity-60 mix-blend-screen" />
              <div className="absolute bottom-[20%] left-[40%] w-24 h-24 bg-[#E8C1C5] rounded-full blur-[40px] opacity-60 mix-blend-screen" />
              
              <div className="absolute inset-0 ring-1 ring-inset ring-white/30 rounded-[3rem] pointer-events-none" />
            </div>

            <div className="text-center">
              <h3 className="font-display font-bold text-2xl text-[#1A1A1A] mb-2">Mapa Térmico SkinIQ</h3>
              <p className="text-sm text-neutral-600">
                Escaneo tridimensional que detecta zonas de estrés oxidativo y pérdida de humedad.
              </p>
            </div>
          </GlassCard>

          {/* AI Diagnostic Explanation */}
          <GlassCard className="p-6 bg-white border border-[#D4AF37]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Bot className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#D4AF37]/20 p-2 rounded-lg text-[#D4AF37]">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A]">Diagnóstico de la Inteligencia Artificial</h3>
            </div>
            <div className="space-y-3 text-sm text-neutral-700 relative z-10 leading-relaxed">
              <p>
                Tras analizar más de 12,000 puntos de datos en tu rostro, hemos detectado un <strong>Índice de Elasticidad alto (90)</strong>, lo cual refleja una buena producción de colágeno.
              </p>
              <p>
                Sin embargo, la <strong>Profundidad de Arrugas (75)</strong> y el <strong>Nivel de Hidratación (78)</strong> en la zona periocular (alrededor de los ojos) y la frente indican signos tempranos de deshidratación profunda. 
              </p>
              <p className="font-semibold text-[#1A1A1A]">
                Para alcanzar tu máximo "Glow Score", necesitas un boost de hidratación intensiva a nivel celular.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* 8 Scores Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {scores.map((score, idx) => (
            <GlassCard key={idx} className="flex flex-col items-center justify-center text-center p-6 hover:bg-[#F2E8DF]/60 transition-colors group cursor-pointer">
              <div className="mb-4 text-[#D4AF37] bg-white/50 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                <score.icon className="w-6 h-6" />
              </div>
              <ScoreDial score={score.value} label={score.label} size="sm" />
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Action Area */}
      <div className="rounded-3xl p-8 mt-8 flex flex-col md:flex-row items-center justify-between bg-[#1A1A1A] text-white border-none relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent pointer-events-none" />
        <div className="mb-6 md:mb-0 relative z-10">
          <h3 className="font-display font-bold text-2xl mb-2 flex items-center gap-2 text-white">
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            Tu Rutina Riman Personalizada
          </h3>
          <p className="text-white/80 max-w-xl">
            Basado en tu Varianza de Pigmentación (82) y necesidad de hidratación, el protocolo BotaLab + EX-Incell restaurará tu barrera cutánea en 14 días.
          </p>
        </div>
        <Link href="/plans" className="relative z-10">
          <button className="bg-[#D4AF37] text-[#1A1A1A] font-bold py-4 px-8 rounded-full hover:bg-white transition-colors flex items-center gap-2 shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]">
            Ver Protocolo Completo
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>

    </div>
  );
}
