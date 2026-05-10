"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function DashboardAuditoria() {
  // Simulamos datos conectados desde Supabase para la demostración
  const [projectState] = useState({
    nivelActual: 2, // 1: Inicio, 2: Verificado, 3: Equilibrado, 4: Pleno
    cuvProvisional: 'UCAM-HPR-SALARG-2026-SANCA001',
    ucamsGeneradas: [
      { tipo: 'Plástico (HPR)', cantidad: 50, unidad: '1.000 kg recuperados' },
      { tipo: 'Carbono (HC)', cantidad: 120, unidad: 'tCO2e reducidas' },
    ],
    errores: [
      { id: 1, mensaje: 'Evidencia rechazada: La fotografía de acopio de PET lote B no contiene metadatos de georreferenciación (GPS).', resuelto: false }
    ]
  });

  const niveles = [
    { num: 1, titulo: 'Inicio', desc: 'Diagnóstico ADN completo' },
    { num: 2, titulo: 'Verificado', desc: 'Evidencias MRV cargadas' },
    { num: 3, titulo: 'Equilibrado', desc: 'Impacto residual compensado' },
    { num: 4, titulo: 'Pleno', desc: 'Impacto neto positivo' },
  ];

  const hasErrores = projectState.errores.some(e => !e.resuelto);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
              Dashboard de Progresión A+ CERT
            </h1>
            <p className="text-neutral-400 mt-2">Monitoreo de auditoría y generación de activos</p>
          </div>
          <div className="bg-neutral-800 px-4 py-3 rounded-lg border border-neutral-700">
            <span className="text-xs text-neutral-400 block mb-1 uppercase tracking-wider">CUV Provisional</span>
            <span className="font-mono text-emerald-400 font-semibold">{projectState.cuvProvisional}</span>
            <p className="text-[10px] text-neutral-500 mt-1 max-w-[200px] leading-tight">
              *Este código es provisional hasta que el Comité Técnico valide el PDD final y se registre en blockchain.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Niveles del Sello */}
            <section className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-500 rounded-sm"></span>
                Estado de Certificación
              </h2>
              
              <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 w-full h-1 bg-neutral-800 rounded-full z-0"></div>
                {/* Active Progress Bar */}
                <div 
                  className="absolute top-5 left-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full z-0 transition-all duration-1000"
                  style={{ width: `${((projectState.nivelActual - 1) / 3) * 100}%` }}
                ></div>

                <div className="relative z-10 flex justify-between">
                  {niveles.map((nivel) => (
                    <div key={nivel.num} className="flex flex-col items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors ${
                        projectState.nivelActual >= nivel.num 
                          ? 'bg-neutral-900 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                          : 'bg-neutral-900 border-neutral-700 text-neutral-600'
                      }`}>
                        {nivel.num}
                      </div>
                      <div className="text-center">
                        <span className={`block font-semibold ${projectState.nivelActual >= nivel.num ? 'text-white' : 'text-neutral-500'}`}>
                          {nivel.titulo}
                        </span>
                        <span className="text-xs text-neutral-500 hidden md:block max-w-[120px] mt-1">
                          {nivel.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Visualización de UCAMs */}
            <section className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-cyan-500 rounded-sm"></span>
                Activos Ambientales (UCAMs) Proyectados
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectState.ucamsGeneradas.map((ucam, idx) => (
                  <div key={idx} className="bg-neutral-900 p-5 rounded-lg border border-neutral-800 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors"></div>
                    <h3 className="text-neutral-400 text-sm font-medium mb-1">{ucam.tipo}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white">{ucam.cantidad}</span>
                      <span className="text-emerald-400 text-sm font-semibold">UCAMs</span>
                    </div>
                    <div className="mt-3 text-xs text-neutral-500 bg-neutral-800/50 inline-block px-2 py-1 rounded">
                      Unidad Oficial: {ucam.unidad}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Nina Agent Card */}
            <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-xl p-1 border border-neutral-700">
              <div className="bg-neutral-900 rounded-lg p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    <img src="/nina.jpeg" alt="Nina AI" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Nina</h3>
                    <p className="text-xs text-emerald-400">Auditora Jefe UCAM CERT</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed italic">
                  "El Standard certifica transformaciones, no intenciones. Reviso tus evidencias para asegurar que cumplan con el MRV."
                </p>
              </div>
            </div>

            {/* Notificaciones de Auditoría */}
            <section className="bg-neutral-800/50 rounded-xl border border-neutral-700/50 overflow-hidden">
              <div className="p-4 border-b border-neutral-700/50 bg-neutral-800/80">
                <h2 className="font-semibold flex items-center gap-2">
                  <span className="text-rose-500">●</span> Observaciones Técnicas
                </h2>
              </div>
              <div className="p-4">
                {projectState.errores.length > 0 ? (
                  <div className="space-y-3">
                    {projectState.errores.map(error => (
                      <div key={error.id} className="bg-rose-950/30 border border-rose-900/50 rounded-lg p-3">
                        <div className="flex items-start gap-2 text-rose-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <p className="text-sm leading-tight">{error.mensaje}</p>
                        </div>
                        <button className="mt-3 text-xs bg-rose-900/50 hover:bg-rose-800/50 text-white px-3 py-1.5 rounded transition-colors w-full">
                          Subsanar Evidencia
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-neutral-400">Sin observaciones pendientes.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Acción Principal */}
            <div className="pt-4">
              <button 
                disabled={hasErrores}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all shadow-lg ${
                  hasErrores 
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700' 
                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                }`}
              >
                {hasErrores ? 'Requiere Subsanación' : 'Enviar a Verificación Externa'}
              </button>
              {hasErrores && (
                <p className="text-xs text-rose-400 text-center mt-3">
                  Bloqueo de integridad: Resuelve las observaciones técnicas de Nina para poder avanzar.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
