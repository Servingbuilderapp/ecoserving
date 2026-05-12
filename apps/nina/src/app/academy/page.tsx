"use client";

import AcademyHero from "@/components/academy/AcademyHero";
import ChatMentoria from "@/components/academy/ChatMentoria";
import Link from "next/link";

const pillars = [
  { id: 1, title: "Impacto Multihuella", description: "Evaluación holística más allá del carbono.", color: "blue" },
  { id: 2, title: "Salud Ambiental", description: "Diagnóstico médico de ecosistemas.", color: "orange" },
  { id: 3, title: "Gestión y ADN", description: "Cultura institucional de sostenibilidad.", color: "blue" },
  { id: 4, title: "Contabilidad", description: "Rigor financiero en activos ambientales.", color: "orange" },
  { id: 5, title: "Sistema MRV", description: "Trazabilidad científica inalterable.", color: "blue" },
  { id: 6, title: "Gobernanza", description: "Transparencia y blindaje legal.", color: "orange" },
  { id: 7, title: "Implementación", description: "Ejecución técnica y resultados.", color: "blue" },
];

export default function AcademyPage() {
  const handlePillarClick = (pillar: any) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('fill-chat', { detail: pillar }));
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-2xl tracking-tighter">
          Nina<span className="text-brand-orange">.</span>Academy
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/auditoria/onboarding" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Ir a Auditoría
          </Link>
          <div className="h-4 w-px bg-white/10"></div>
          <span className="text-xs font-mono text-brand-blue uppercase tracking-widest">Estándar v1.0</span>
        </div>
      </nav>

      <div className="pt-16">
        <AcademyHero />
        
        {/* Knowledge Hub Preview */}
        <section className="max-w-6xl mx-auto py-24 px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Hub de Conocimiento</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explora los 7 pilares fundamentales del estándar UCAM CERT SIIA. Haz clic en cualquiera de ellos para que Nina te explique los detalles en el chat.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => (
              <button 
                key={pillar.id}
                onClick={() => handlePillarClick(pillar)}
                className="group p-6 rounded-2xl bg-surface border border-white/5 hover:border-brand-blue/30 transition-all hover:-translate-y-1 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
              >
                <div className={`w-10 h-10 rounded-xl bg-brand-${pillar.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className={`text-brand-${pillar.color} font-bold`}>{pillar.id}</span>
                </div>
                <h4 className="font-bold text-white mb-2">{pillar.title}</h4>
                <p className="text-sm text-gray-500">{pillar.description}</p>
              </button>
            ))}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-blue/20 border border-white/10 flex flex-col justify-center items-center text-center">
              <h4 className="font-bold text-white mb-2">Manual Completo</h4>
              <p className="text-xs text-gray-400 mb-4">Descarga el estándar detallado v1.0 (PDF)</p>
              <button className="text-xs font-bold text-brand-orange uppercase tracking-widest hover:underline">Próximamente</button>
            </div>
          </div>
        </section>

        {/* Chat Section */}
        <div className="py-12 bg-white/[0.02]">
          <div className="max-w-3xl mx-auto text-center mb-8 px-6">
            <h3 className="text-2xl font-bold text-white mb-4">Pregúntale a Nina</h3>
            <p className="text-gray-400 text-sm">
              Nuestra IA ha sido entrenada con la documentación técnica oficial para resolver tus dudas sobre metodologías, cálculos y normativas.
            </p>
          </div>
          <ChatMentoria />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} UCAM CERT SIIA. Módulo de Mentoría Académica v1.0</p>
      </footer>
    </main>
  );
}
