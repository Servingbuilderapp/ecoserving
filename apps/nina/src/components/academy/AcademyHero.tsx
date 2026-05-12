"use client";

import Link from "next/link";
import Image from "next/image";

export default function AcademyHero() {
  return (
    <div className="relative overflow-hidden bg-surface/30 backdrop-blur-sm border-b border-white/5 py-24 px-6">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[30rem] h-[30rem] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[30rem] h-[30rem] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
        <div className="flex-1 text-center md:text-left space-y-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-widest animate-fade-in">
            Nina Academy • Fase 2 Activa
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Mentoría de <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-blue">Integridad Ambiental</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            Aprende a dominar el estándar UCAM CERT SIIA v1.0. Nuestra IA Nina te guía en la comprensión técnica de los 7 pilares y el sistema MRV para transformaciones verificadas.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
            <button 
              onClick={() => {
                const chatSection = document.getElementById('academy-chat');
                chatSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-brand-orange/20"
            >
              Iniciar Mentoría de Texto
            </button>
            <button className="px-8 py-4 bg-surface border border-white/10 text-white font-bold rounded-2xl hover:bg-surface-hover transition-all flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-blue" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
              Activar Mentoría de Voz
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
            <div className="absolute inset-0 bg-brand-blue/20 rounded-full animate-pulse blur-2xl" />
            <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl group">
              <Image 
                src="/nina.jpeg" 
                alt="Nina Academy" 
                fill
                className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <p className="text-xs font-bold text-white uppercase mb-1">Status: En línea</p>
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
