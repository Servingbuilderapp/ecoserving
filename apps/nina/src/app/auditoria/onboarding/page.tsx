"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OnboardingAuditoria() {
  const router = useRouter();
  
  const [checks, setChecks] = useState({
    responsabilidad: false,
    vigencia: false,
    intentos: false,
    veracidad: false
  });

  const allChecked = Object.values(checks).every(Boolean);

  const handleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStart = () => {
    if (allChecked) {
      router.push('/auditoria');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-800 flex flex-col md:flex-row">
        
        {/* Left Side: Nina & Instrucciones */}
        <div className="md:w-5/12 bg-gradient-to-b from-neutral-800 to-neutral-900 p-8 border-r border-neutral-800 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <img src="/nina.jpeg" alt="Nina AI" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Nina</h2>
              <p className="text-sm text-emerald-400">Auditora Jefe UCAM CERT</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4 text-white">Reglas de Integridad (MRV)</h3>
          
          <div className="space-y-5">
            <div className="bg-neutral-950/50 p-4 rounded-lg border border-neutral-800/50">
              <h4 className="text-sm font-bold text-emerald-400 mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Regla de Oro: Fotos Originales
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Solo se aceptan archivos originales de la cámara. El uso de WhatsApp o capturas de pantalla invalidará la prueba al borrar la metadata.
              </p>
            </div>

            <div className="bg-neutral-950/50 p-4 rounded-lg border border-neutral-800/50">
              <h4 className="text-sm font-bold text-emerald-400 mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Regla de Oro: GPS Activo
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Rechazaré cualquier imagen sin coordenadas georreferenciadas integradas. Activa tu ubicación.
              </p>
            </div>

            <div className="bg-neutral-950/50 p-4 rounded-lg border border-neutral-800/50">
              <h4 className="text-sm font-bold text-emerald-400 mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Criterio Conservador
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                El sistema registrará siempre el valor mínimo verificable en caso de rangos de datos para proteger la integridad del sello.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Términos y Condiciones */}
        <div className="md:w-7/12 p-8 flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Protocolo de Inducción</h1>
            <p className="text-sm text-neutral-400">
              Aceptación de Riesgos Técnicos y Términos de Integridad Ambiental.
            </p>
          </div>

          <div className="space-y-4 flex-1">
            
            <label className="flex items-start gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 cursor-pointer transition-colors">
              <div className="pt-0.5">
                <input 
                  type="checkbox" 
                  checked={checks.responsabilidad}
                  onChange={() => handleCheck('responsabilidad')}
                  className="w-5 h-5 rounded border-neutral-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900 bg-neutral-950" 
                />
              </div>
              <span className="text-sm text-neutral-300 leading-snug">
                Entiendo que los datos cargados son mi responsabilidad y que la ausencia de evidencias técnicas (GPS, Facturas) impedirá la certificación.
              </span>
            </label>

            <label className="flex items-start gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 cursor-pointer transition-colors">
              <div className="pt-0.5">
                <input 
                  type="checkbox" 
                  checked={checks.vigencia}
                  onChange={() => handleCheck('vigencia')}
                  className="w-5 h-5 rounded border-neutral-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900 bg-neutral-950" 
                />
              </div>
              <span className="text-sm text-neutral-300 leading-snug">
                Acepto que mi auditoría tiene una vigencia de 60 días naturales para ser completada; de lo contrario, los datos podrían considerarse anacrónicos y requerir un nuevo proceso.
              </span>
            </label>

            <label className="flex items-start gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 cursor-pointer transition-colors">
              <div className="pt-0.5">
                <input 
                  type="checkbox" 
                  checked={checks.intentos}
                  onChange={() => handleCheck('intentos')}
                  className="w-5 h-5 rounded border-neutral-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900 bg-neutral-950" 
                />
              </div>
              <span className="text-sm text-neutral-300 leading-snug">
                Comprendo que Nina me permite intentos ilimitados de corrección, pero el envío a la Entidad Verificadora (EVA) final tendrá un límite de 2 intentos de subsanación antes de generar cargos adicionales.
              </span>
            </label>

            <label className="flex items-start gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 cursor-pointer transition-colors">
              <div className="pt-0.5">
                <input 
                  type="checkbox" 
                  checked={checks.veracidad}
                  onChange={() => handleCheck('veracidad')}
                  className="w-5 h-5 rounded border-neutral-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900 bg-neutral-950" 
                />
              </div>
              <span className="text-sm text-neutral-300 leading-snug">
                Declaro que la información sobre sustancias químicas (Pilar 2) es veraz y corresponde a la realidad biológica de mi operación.
              </span>
            </label>

          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-cyan-950/30 border border-cyan-900/50 p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-cyan-400 font-medium">Bloqueo de Seguridad: Flujo de Pago</span>
              </div>
              <span className="text-[10px] text-cyan-500/70 uppercase tracking-wider">
                Diagnóstico Gratuito • Medición Requiere Activación
              </span>
            </div>

            <button
              onClick={handleStart}
              disabled={!allChecked}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                allChecked
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02]'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
              }`}
            >
              TODO LISTO / INICIAR
            </button>
            
            {!allChecked && (
              <p className="text-center text-xs text-rose-500/70">
                Debes aceptar todas las condiciones técnicas para poder avanzar.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
