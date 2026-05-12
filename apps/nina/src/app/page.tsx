import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40rem] h-[40rem] bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto space-y-10">
        <div className="space-y-6">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-surface border border-brand-blue/30 text-brand-blue text-xs md:text-sm font-medium tracking-wide shadow-[0_0_15px_rgba(14,165,233,0.2)]">
            <span className="w-2 h-2 rounded-full bg-brand-blue mr-2 animate-pulse" />
            Powered by UCAM CERT SIIA Standard v1.0
          </div>
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="relative w-40 h-40 md:w-48 md:h-48 mb-8 rounded-full overflow-hidden border-4 border-surface shadow-[0_0_40px_rgba(14,165,233,0.3)] ring-2 ring-brand-blue/50">
              <Image 
                src="/nina.jpeg" 
                alt="Nina - UCAM CERT" 
                fill
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white drop-shadow-2xl">
              Hola, soy <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-blue">Nina</span>.
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Tu Auditora Ambiental de Inteligencia Artificial. Estoy aquí para guiarte en el proceso de certificación multihuella.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16">
          {/* Card 1 */}
          <div className="bg-surface/80 border border-white/5 p-8 rounded-3xl backdrop-blur-md hover:border-brand-blue/40 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="h-14 w-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-left">Diagnóstico Multihuella</h3>
            <p className="text-gray-400 text-left leading-relaxed">Evalúo tu impacto ambiental en 7 dimensiones y 3 alcances operativos con precisión forense.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-surface/80 border border-white/5 p-8 rounded-3xl backdrop-blur-md hover:border-brand-orange/40 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="h-14 w-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-left">Construcción de PDD</h3>
            <p className="text-gray-400 text-left leading-relaxed">Estructuramos juntos tu Project Design Document, validando tu línea base y adicionalidad.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-surface/80 border border-white/5 p-8 rounded-3xl backdrop-blur-md hover:border-brand-blue/40 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="h-14 w-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-left">Emisión UCAM</h3>
            <p className="text-gray-400 text-left leading-relaxed">Gestionamos la trazabilidad y emisión segura de tu Código Único de Verificación (CUV).</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-12">
          <Link 
            href="/auditoria/onboarding" 
            className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-brand-orange to-brand-blue rounded-full hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(14,165,233,0.5)] border border-white/10"
          >
            Iniciar Sesión de Auditoría
            <svg className="w-6 h-6 ml-3 -mr-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          <Link 
            href="/academy" 
            className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-200 bg-surface/50 backdrop-blur-md border border-brand-blue/30 rounded-full hover:bg-brand-blue/10 hover:border-brand-blue/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
          >
            Nina Academy (Mentoría)
            <svg className="w-6 h-6 ml-3 -mr-1 transition-transform group-hover:translate-x-1 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-sm text-gray-500 font-medium">
        © {new Date().getFullYear()} UCAM CERT SIIA. Transformaciones verificadas.
      </footer>
    </div>
  );
}
