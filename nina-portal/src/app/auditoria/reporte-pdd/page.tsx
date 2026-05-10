"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ReportePDD() {
  // Simulamos los datos del proyecto validados tras el Paso 2
  const [reportData] = useState({
    cuv: 'UCAM-HPR-SALARG-2026-SANCA001',
    fecha: new Date().toLocaleDateString(),
    entidad: 'EcoTech Solutions SRL',
    proyecto: 'Recuperación Avanzada de PET - Fase 1',
    ucams: [
      { huella: 'Plástica (HPR)', alcances: { a1: 0, a2: 0, a3: 50 }, unidad: '1.000 kg' },
      { huella: 'Carbono (HC)', alcances: { a1: 20, a2: 50, a3: 50 }, unidad: 'tCO2e' }
    ],
    evidencias: [
      { id: 'EVID-001', tipo: 'Guía de Transporte', gps: '-24.7821, -65.4125', cuvAsignado: 'UCAM-HPR-SALARG-2026-SANCA001' },
      { id: 'EVID-002', tipo: 'Factura Disposición Final', gps: '-24.8010, -65.4300', cuvAsignado: 'UCAM-HPR-SALARG-2026-SANCA001' }
    ],
    saludAmbiental: {
      quimicosDetectados: 'Trazas de Ftalatos en línea de acopio B.',
      mitigacion: 'Sustitución de contenedores de acopio primario. Protocolo de ventilación activo.'
    }
  });

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 p-8 font-sans print:bg-white print:p-0">
      
      {/* Botonera (No visible en impresión) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link href="/auditoria/dashboard" className="text-neutral-500 hover:text-neutral-800 font-medium flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver al Dashboard
        </Link>
        <button 
          onClick={() => window.print()}
          className="bg-neutral-900 text-white px-5 py-2 rounded-lg font-medium hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          Exportar PDD (PDF)
        </button>
      </div>

      {/* Documento PDD Oficial */}
      <div className="max-w-4xl mx-auto bg-white p-12 border border-neutral-300 shadow-xl print:shadow-none print:border-none">
        
        {/* Cabecera Oficial */}
        <header className="border-b-2 border-neutral-800 pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900 mb-1">PROJECT DESIGN DOCUMENT (PDD)</h1>
            <p className="text-neutral-500 font-medium">Borrador Oficial del Sistema UCAM CERT SIIA</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">CUV Provisional</p>
            <p className="font-mono text-lg font-bold text-emerald-700 bg-emerald-50 px-3 py-1 border border-emerald-200">{reportData.cuv}</p>
          </div>
        </header>

        <div className="space-y-10">

          {/* 1. Resumen Ejecutivo Médico-Auditor */}
          <section>
            <h2 className="text-xl font-bold border-b border-neutral-200 pb-2 mb-4 flex items-center gap-2">
              <span className="bg-neutral-900 text-white w-6 h-6 flex items-center justify-center text-sm font-bold rounded">1</span>
              Resumen Ejecutivo Médico-Auditor
            </h2>
            <div className="bg-neutral-50 p-6 border-l-4 border-emerald-600 italic text-neutral-700">
              <p className="mb-4">
                "Como Auditora Jefe (IA) del sistema UCAM CERT, he evaluado las métricas operativas del proyecto <strong>'{reportData.proyecto}'</strong> presentado por <strong>{reportData.entidad}</strong>."
              </p>
              <p className="mb-4">
                "Confirmo que el proyecto ha superado el Diagnóstico ADN y la fase de Medición MRV preliminar. Las evidencias fotográficas cumplen con la georreferenciación exigida y los cálculos volumétricos han sido sometidos al Criterio Conservador del Standard v1.0. No se han detectado anomalías de doble conteo en el lote asignado."
              </p>
              <p className="text-sm font-bold text-emerald-800 mt-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Firma Digital: Nina (Auditora Inteligente UCAM CERT) - {reportData.fecha}
              </p>
            </div>
          </section>

          {/* 2. Cuadro de Activos (UCAMs) */}
          <section>
            <h2 className="text-xl font-bold border-b border-neutral-200 pb-2 mb-4 flex items-center gap-2">
              <span className="bg-neutral-900 text-white w-6 h-6 flex items-center justify-center text-sm font-bold rounded">2</span>
              Cuadro de Activos Ambientales Verificables
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-y border-neutral-300">
                    <th className="p-3 font-semibold text-sm">Dimensión (Huella)</th>
                    <th className="p-3 font-semibold text-sm text-center">Alcance 1</th>
                    <th className="p-3 font-semibold text-sm text-center">Alcance 2</th>
                    <th className="p-3 font-semibold text-sm text-center">Alcance 3</th>
                    <th className="p-3 font-semibold text-sm text-right">UCAMs Generadas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {reportData.ucams.map((ucam, idx) => {
                    const total = ucam.alcances.a1 + ucam.alcances.a2 + ucam.alcances.a3;
                    return (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="p-3 font-medium">{ucam.huella}</td>
                        <td className="p-3 text-center text-neutral-600">{ucam.alcances.a1}</td>
                        <td className="p-3 text-center text-neutral-600">{ucam.alcances.a2}</td>
                        <td className="p-3 text-center text-neutral-600">{ucam.alcances.a3}</td>
                        <td className="p-3 text-right font-bold text-emerald-700">
                          {total} <span className="text-xs text-neutral-500 font-normal ml-1">x {ucam.unidad}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Diagnóstico de Salud Ambiental (Pilar 2) */}
          <section>
            <h2 className="text-xl font-bold border-b border-neutral-200 pb-2 mb-4 flex items-center gap-2">
              <span className="bg-neutral-900 text-white w-6 h-6 flex items-center justify-center text-sm font-bold rounded">3</span>
              Diagnóstico de Salud Ambiental (Pilar 2)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-rose-200 bg-rose-50 p-4 rounded text-sm">
                <h3 className="font-bold text-rose-800 mb-2 uppercase tracking-wider text-xs">Químicos Críticos Detectados</h3>
                <p className="text-rose-900">{reportData.saludAmbiental.quimicosDetectados}</p>
              </div>
              <div className="border border-emerald-200 bg-emerald-50 p-4 rounded text-sm">
                <h3 className="font-bold text-emerald-800 mb-2 uppercase tracking-wider text-xs">Medidas de Mitigación (MRV)</h3>
                <p className="text-emerald-900">{reportData.saludAmbiental.mitigacion}</p>
              </div>
            </div>
          </section>

          {/* 4. Anexo de Trazabilidad */}
          <section>
            <h2 className="text-xl font-bold border-b border-neutral-200 pb-2 mb-4 flex items-center gap-2">
              <span className="bg-neutral-900 text-white w-6 h-6 flex items-center justify-center text-sm font-bold rounded">4</span>
              Anexo de Trazabilidad (Cadena de Custodia)
            </h2>
            <div className="bg-neutral-50 border border-neutral-200 rounded overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-200 text-neutral-700">
                  <tr>
                    <th className="p-3 font-semibold">ID Evidencia</th>
                    <th className="p-3 font-semibold">Tipo Documental</th>
                    <th className="p-3 font-semibold">Metadata EXIF (GPS)</th>
                    <th className="p-3 font-semibold">Vinculación CUV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {reportData.evidencias.map((ev, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-mono text-neutral-600">{ev.id}</td>
                      <td className="p-3 font-medium">{ev.tipo}</td>
                      <td className="p-3 text-cyan-700 font-mono text-xs">{ev.gps}</td>
                      <td className="p-3 text-emerald-700 font-mono text-xs">{ev.cuvAsignado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-neutral-500 mt-3 text-center">
              Este documento es un borrador. Los activos no son definitivos hasta la aprobación del Comité Técnico y registro en la red UCAM.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
