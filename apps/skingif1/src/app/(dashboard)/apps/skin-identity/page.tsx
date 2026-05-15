"use client";

import { useState } from "react";
import { ARCHETYPES } from "@/lib/archetypes";
import { Search, ShieldCheck, Sparkles, Activity, Zap, Droplets, Leaf, ArrowRight } from "lucide-react";

export default function SkinIdentityFinder() {
  const [selectedArch, setSelectedArch] = useState<string>("glow_seeker");

  const arch = ARCHETYPES[selectedArch];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="flex justify-between items-center bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <Search className="w-8 h-8 text-[#D4AF37]" />
            Skin Identity Finder™
          </h1>
          <p className="text-neutral-400">Portal Pro de Análisis de Arquetipos y Recomendación RIMAN</p>
        </div>
        <div className="hidden md:flex gap-2">
          <select 
            value={selectedArch}
            onChange={(e) => setSelectedArch(e.target.value)}
            className="bg-[#111] border border-neutral-800 text-white rounded-xl px-4 py-3 outline-none focus:border-[#D4AF37]"
          >
            {Object.values(ARCHETYPES).map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </header>

      {arch && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LADO IZQUIERDO: VISUAL Y SCORES */}
          <div className="space-y-6">
            <div 
              className="rounded-3xl p-8 text-white relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10"
              style={{
                background: `linear-gradient(135deg, ${arch.visual_aesthetics.colors[0]}, ${arch.visual_aesthetics.colors[1] || '#000'})`
              }}
            >
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
              
              <div className="relative z-10">
                <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                  Arquetipo Dominante
                </span>
                <h2 className="text-4xl font-black mt-6 mb-1 drop-shadow-md">{arch.name}</h2>
                <p className="text-xl font-medium text-white/90 italic mb-8">"{arch.label}"</p>

                <div className="space-y-4">
                  {[
                    { label: "Barrier Health", score: arch.suggested_scores.barrera, icon: ShieldCheck },
                    { label: "Luminosity", score: arch.suggested_scores.glow, icon: Sparkles },
                    { label: "Stress Load", score: arch.suggested_scores.estres, icon: Activity },
                    { label: "Recovery", score: arch.suggested_scores.resiliencia, icon: Zap },
                  ].map((s, idx) => (
                    <div key={idx} className="bg-black/30 backdrop-blur-md p-4 rounded-2xl flex justify-between items-center border border-white/5">
                      <div className="flex items-center gap-3">
                        <s.icon className="w-5 h-5 opacity-80" />
                        <span className="font-semibold">{s.label}</span>
                      </div>
                      <span className="font-black text-xl">{s.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-neutral-800 rounded-3xl p-6">
              <h3 className="text-[#D4AF37] font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <Leaf className="w-4 h-4" /> Problema Emocional
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed border-l-2 border-[#D4AF37] pl-4">
                {arch.emotional_problem_solved}
              </p>
            </div>
          </div>

          {/* LADO DERECHO: DEEP DIVE Y RIMAN */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <div className="bg-[#111] border border-neutral-800 rounded-3xl p-8">
              <h3 className="text-2xl font-black text-white mb-6">Narrativa Clínica</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-[#D4AF37] font-bold mb-2">Perfil Psicológico</h4>
                  <p className="text-neutral-300 leading-relaxed">{arch.description}</p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-2xl">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#D4AF37]" /> Explicación Dermatológica
                  </h4>
                  <p className="text-neutral-400 leading-relaxed">{arch.dermatological_explanation}</p>
                </div>

                <div>
                  <h4 className="text-[#D4AF37] font-bold mb-2">Manifestaciones Físicas</h4>
                  <p className="text-neutral-300 leading-relaxed">{arch.common_traits}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#D4AF37]/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
              <div className="flex items-center gap-3 mb-6">
                <Droplets className="w-8 h-8 text-[#D4AF37]" />
                <h3 className="text-2xl font-black text-white">Recomendación RIMAN</h3>
              </div>
              
              <p className="text-neutral-400 mb-6">
                Basado en tu arquetipo <strong>{arch.name}</strong>, el sistema de SkinIQ™ sugiere la siguiente aproximación táctica utilizando la tecnología de RIMAN K-Beauty.
              </p>

              <div className="bg-black/50 border border-white/5 rounded-2xl p-6">
                <h4 className="text-white font-bold mb-3">Enfoque de Contenido & Estilo de Vida:</h4>
                <p className="text-[#D4AF37] italic font-medium leading-relaxed">
                  "{arch.suggested_content}"
                </p>
              </div>

              <button className="mt-8 w-full bg-[#D4AF37] text-black font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-white transition-all shadow-lg hover:shadow-[#D4AF37]/50">
                Prescribir Protocolo RIMAN <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
