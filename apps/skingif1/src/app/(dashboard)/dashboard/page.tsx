"use client";

import React from "react";
import Link from "next/link";
import { Camera, ArrowRight, UserCircle2, Sparkles, Droplets, ArrowUpCircle, Sun, Activity, Maximize, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScoreDial } from "@/components/ui/ScoreDial";
import { GlowButton } from "@/components/ui/GlowButton";

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
    { label: "Skin Health Index™", value: 92, icon: Activity },
    { label: "Glow Score™", value: 88, icon: Sparkles },
    { label: "Skin Age Gap™", value: 85, icon: UserCircle2 },
    { label: "Hydration Level", value: 78, icon: Droplets },
    { label: "Elasticity Index", value: 90, icon: ArrowUpCircle },
    { label: "Pigmentation Variance", value: 82, icon: Sun },
    { label: "Wrinkle Depth", value: 75, icon: AlertCircle },
    { label: "Pores & Texture", value: 89, icon: Maximize },
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
            Premium Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1A1A1A] tracking-tight">
            Tu SkinIQ™ Dashboard
          </h1>
          <p className="text-neutral-600 mt-2 text-lg">
            Descubre los 8 biomarcadores de tu piel.
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
        <div className="lg:col-span-1">
          <GlassCard className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#F2E8DF]/80 to-[#EAE0D7]/80">
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
              <h3 className="font-display font-bold text-2xl text-[#1A1A1A] mb-2">Resumen General</h3>
              <p className="text-sm text-neutral-600">
                Tu piel muestra un nivel excepcional de hidratación y un Skin Age Gap™ positivo.
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
      <GlassCard className="p-8 mt-8 flex flex-col md:flex-row items-center justify-between bg-[#1A1A1A] text-white border-none">
        <div className="mb-6 md:mb-0">
          <h3 className="font-display font-bold text-2xl mb-2">Recomendación Riman</h3>
          <p className="text-white/70 max-w-xl">
            Basado en tu Pigmentation Variance (82) y Glow Score (88), el protocolo BotaLab + EX-Incell te dará los mejores resultados en 2 semanas.
          </p>
        </div>
        <button className="bg-[#D4AF37] text-[#1A1A1A] font-bold py-4 px-8 rounded-full hover:bg-white transition-colors flex items-center gap-2 shrink-0">
          Ver Protocolo Completo
          <ArrowRight className="w-5 h-5" />
        </button>
      </GlassCard>

    </div>
  );
}
