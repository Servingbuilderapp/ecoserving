"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Target, Search, Filter, MessageCircle, AlertCircle, Calendar, ChevronRight, UserCircle2, Brain, CheckCircle2 } from "lucide-react";

interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  created_at: string;
  resultado_scanner_facial: any;
  status: "nuevo" | "contactado" | "cerrado" | "recompra";
}

// MOCK FALLBACK DATA
const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    nombre: "Ana Gómez",
    email: "ana@example.com",
    telefono: "573001234567",
    created_at: "2024-10-12T10:00:00Z",
    status: "recompra",
    resultado_scanner_facial: {
      hidratacion: { score: 3 },
      textura_poros: { score: 6 }
    }
  },
  {
    id: "2",
    nombre: "Carlos Restrepo",
    email: "carlos@example.com",
    telefono: "573109876543",
    created_at: new Date().toISOString(),
    status: "nuevo",
    resultado_scanner_facial: {
      lineas_expresion: { score: 4 }
    }
  }
];

export default function RimanCRM() {
  const supabase = createClient();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        // Intentar obtener leads reales de la base de datos
        let realLeads = null;
        if (user) {
          const { data, error } = await supabase
            .from("leads_y_clientes")
            .select("*")
            .eq("owner_id", user.id)
            .order('created_at', { ascending: false });
          
          if (!error && data && data.length > 0) {
            realLeads = data as Lead[];
          }
        }
        
        // Si no hay BD configurada o no hay usuario autenticado (Demo Mode), usar Mocks
        setLeads(realLeads || MOCK_LEADS);
      } catch (err) {
        console.error("Error CRM:", err);
        setLeads(MOCK_LEADS);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [supabase]);

  const filteredLeads = leads.filter(l => l.nombre.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()));

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'nuevo': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'contactado': return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case 'cerrado': return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'recompra': return "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse";
      default: return "bg-neutral-800 text-neutral-400";
    }
  };

  const generateWhatsAppLink = (lead: Lead) => {
    const isRecompra = lead.status === 'recompra';
    const message = isRecompra 
      ? `¡Hola ${lead.nombre}! ¿Cómo va tu piel con el First Package de Riman? He notado que es momento de reponer tu inventario para no cortar los resultados.`
      : `¡Hola ${lead.nombre}! Vi que completaste tu diagnóstico facial con IA. Quería contarte más sobre los resultados y cómo podemos mejorar esa hidratación.`;
    return `https://wa.me/${lead.telefono}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white pb-24 selection:bg-[#D4AF37] selection:text-black">
      
      {/* HEADER */}
      <div className="bg-[#111] border-b border-neutral-800 px-4 sm:px-6 lg:px-8 py-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/riman/dashboard" className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6 text-[#3b82f6]" />
                CRM & Inteligencia de Leads
              </h1>
              <p className="text-neutral-400 text-sm mt-0.5">Gestiona tus prospectos del Escáner IA en tiempo real.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar cliente..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:border-[#3b82f6] focus:outline-none w-full md:w-64"
              />
            </div>
            <button className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl hover:text-[#3b82f6] transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111] p-5 rounded-2xl border border-neutral-800">
            <h3 className="text-neutral-500 text-xs font-bold uppercase mb-1">Total Prospectos</h3>
            <p className="text-3xl font-black">{leads.length}</p>
          </div>
          <div className="bg-[#111] p-5 rounded-2xl border border-neutral-800">
            <h3 className="text-neutral-500 text-xs font-bold uppercase mb-1">Cierres (Ventas)</h3>
            <p className="text-3xl font-black text-green-500">{leads.filter(l => l.status === 'cerrado').length}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-transparent p-5 rounded-2xl border border-red-500/20">
            <h3 className="text-red-400 text-xs font-bold uppercase mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Alertas de Recompra</h3>
            <p className="text-3xl font-black text-red-500">{leads.filter(l => l.status === 'recompra').length}</p>
          </div>
          <div className="bg-[#111] p-5 rounded-2xl border border-neutral-800">
            <h3 className="text-neutral-500 text-xs font-bold uppercase mb-1">Tasa de Cierre</h3>
            <p className="text-3xl font-black text-[#D4AF37]">
              {leads.length > 0 ? Math.round((leads.filter(l => l.status === 'cerrado').length / leads.length) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* CRM TABLE */}
        <div className="bg-[#111] rounded-3xl border border-neutral-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900/50 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-bold">Cliente</th>
                  <th className="px-6 py-4 font-bold">Fecha de Escáner</th>
                  <th className="px-6 py-4 font-bold">Estado</th>
                  <th className="px-6 py-4 font-bold">Resultado IA</th>
                  <th className="px-6 py-4 font-bold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-neutral-500">Cargando datos del CRM...</td></tr>
                ) : filteredLeads.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-neutral-500">No hay prospectos todavía. ¡Comparte tu enlace del Escáner IA!</td></tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-neutral-900/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
                            <UserCircle2 className="w-6 h-6 text-neutral-400" />
                          </div>
                          <div>
                            <p className="font-bold text-white">{lead.nombre}</p>
                            <p className="text-xs text-neutral-500">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> 
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {lead.resultado_scanner_facial ? (
                          <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
                            <Brain className="w-4 h-4" /> Diagnóstico Completado
                          </div>
                        ) : (
                          <span className="text-neutral-600 text-xs">Sin escanear</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a 
                            href={generateWhatsAppLink(lead)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-black p-2 rounded-lg transition-colors"
                            title="Enviar WhatsApp"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </a>
                          <button className="text-neutral-500 hover:text-white p-2 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
