"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Calculator, DollarSign, TrendingUp, Users, Target, CircleDollarSign, ShoppingBag, Loader2, Wallet } from "lucide-react";

export default function GlobalCalculator() {
  const supabase = createClient();
  const [currency, setCurrency] = useState<"USD" | "COP">("COP");
  const [activeTab, setActiveTab] = useState<"simulator" | "real">("simulator");
  
  // Simulator Inputs
  const [sales, setSales] = useState(10);
  const [planners, setPlanners] = useState(5);
  
  // Real Data States
  const [realPlanners, setRealPlanners] = useState(0);
  const [realSales, setRealSales] = useState(0);
  const [loadingReal, setLoadingReal] = useState(true);

  // Constants
  const exchangeRate = 4000;
  const RETAIL_MARGIN = 25;
  const SUBSCRIPTION_COMMISSION = 9;

  // Fetch Real Data
  useEffect(() => {
    if (activeTab === "real") {
      const fetchRealData = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Count actual subscriptions/planners in the network
            const { count: plannerCount } = await supabase
              .from("sucursales_planners")
              .select("*", { count: 'exact', head: true })
              .eq("parent_id", user.id);
            
            // Count actual closed sales in CRM
            const { count: salesCount } = await supabase
              .from("leads_y_clientes")
              .select("*", { count: 'exact', head: true })
              .eq("owner_id", user.id)
              .eq("status", "cerrado");

            setRealPlanners(plannerCount || 0);
            setRealSales(salesCount || 0);
          }
        } catch (error) {
          console.error("Error fetching real data", error);
        } finally {
          setLoadingReal(false);
        }
      };
      fetchRealData();
    }
  }, [activeTab, supabase]);
  
  // Calculation Logic (Shared)
  const calculateTotals = (s: number, p: number) => {
    const totalRetailUSD = s * RETAIL_MARGIN;
    const totalSubUSD = p * SUBSCRIPTION_COMMISSION;
    const leadershipBonusUSD = p >= 10 ? 150 : 0; 
    const totalUSD = totalRetailUSD + totalSubUSD + leadershipBonusUSD;
    return { totalRetailUSD, totalSubUSD, leadershipBonusUSD, totalUSD };
  };

  const currentData = activeTab === "simulator" 
    ? calculateTotals(sales, planners)
    : calculateTotals(realSales, realPlanners);

  const totalDisplay = currency === "USD" ? currentData.totalUSD : currentData.totalUSD * exchangeRate;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat(currency === "COP" ? 'es-CO' : 'en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white pb-24 selection:bg-[#D4AF37] selection:text-black">
      
      {/* HEADER */}
      <div className="bg-[#111] border-b border-neutral-800 px-4 sm:px-6 lg:px-8 py-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/riman/dashboard" className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Calculator className="w-6 h-6 text-[#10b981]" />
                Centro Financiero
              </h1>
              <p className="text-neutral-400 text-sm mt-0.5">Proyecta o revisa tus ganancias K-Beauty.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1.5 rounded-xl">
            <button onClick={() => setCurrency("COP")} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${currency === "COP" ? "bg-[#10b981] text-black" : "text-neutral-400 hover:text-white"}`}>COP</button>
            <button onClick={() => setCurrency("USD")} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${currency === "USD" ? "bg-[#10b981] text-black" : "text-neutral-400 hover:text-white"}`}>USD</button>
          </div>
        </div>

        {/* TABS */}
        <div className="max-w-4xl mx-auto mt-6 flex gap-4">
          <button 
            onClick={() => setActiveTab("simulator")}
            className={`flex-1 py-3 font-bold text-sm rounded-xl border transition-all ${activeTab === 'simulator' ? 'bg-[#111] border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-neutral-500 hover:text-white hover:bg-[#111]'}`}
          >
            Simulador de Metas
          </button>
          <button 
            onClick={() => setActiveTab("real")}
            className={`flex-1 py-3 font-bold text-sm rounded-xl border transition-all flex items-center justify-center gap-2 ${activeTab === 'real' ? 'bg-[#111] border-[#3b82f6] text-[#3b82f6]' : 'border-transparent text-neutral-500 hover:text-white hover:bg-[#111]'}`}
          >
            <Wallet className="w-4 h-4" /> Billetera Real (CRM)
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: CONTROLS OR REAL DATA */}
        <div className="flex-1 space-y-8 bg-[#111] p-6 md:p-8 rounded-3xl border border-neutral-800 shadow-xl">
          {activeTab === "simulator" ? (
            <>
              <h2 className="text-xl font-bold border-b border-neutral-800 pb-4 flex items-center gap-2"><Target className="w-5 h-5 text-[#D4AF37]"/> Tus Metas Mensuales</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-neutral-300 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Ventas Retail Estimadas</label>
                    <span className="font-bold text-[#D4AF37]">{sales} ventas</span>
                  </div>
                  <input type="range" min="0" max="100" value={sales} onChange={(e) => setSales(Number(e.target.value))} className="w-full accent-[#D4AF37] h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-neutral-300 flex items-center gap-2"><Users className="w-4 h-4 text-[#3b82f6]" /> Red de Planners Objetivo</label>
                    <span className="font-bold text-[#3b82f6]">{planners} socios</span>
                  </div>
                  <input type="range" min="0" max="50" value={planners} onChange={(e) => setPlanners(Number(e.target.value))} className="w-full accent-[#3b82f6] h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold border-b border-neutral-800 pb-4 flex items-center gap-2"><Wallet className="w-5 h-5 text-[#3b82f6]"/> Billetera y Ranking SkinIQ</h2>
              {loadingReal ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 text-[#3b82f6] animate-spin mb-4" />
                  <p className="text-neutral-500 text-sm">Sincronizando con base de datos...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* GAMIFICATION & XP BLOCK IN CALCULATOR */}
                  <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <TrendingUp className="w-24 h-24 text-[#D4AF37]" />
                    </div>
                    <div className="relative z-10 flex justify-between items-end">
                      <div>
                        <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-1">Rango Actual: Planner Avanzado</p>
                        <p className="text-3xl font-black text-white">1,250 <span className="text-lg text-neutral-400">XP Totales</span></p>
                      </div>
                    </div>
                    <div className="relative z-10 bg-black/40 p-3 rounded-xl border border-white/5">
                      <p className="text-xs text-neutral-300">Te faltan <strong className="text-[#D4AF37]">750 XP</strong> para ascender a <strong>Jeju Master</strong>. Continúa cerrando ventas y usando el Escáner Facial para obtener más comisiones y desbloquear Master Apps PRO.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between">
                      <p className="text-sm text-neutral-400 mb-2">Ventas Cerradas</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-black text-white">{realSales}</p>
                        <ShoppingBag className="w-6 h-6 text-[#D4AF37] opacity-40" />
                      </div>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between">
                      <p className="text-sm text-neutral-400 mb-2">Planners en Red</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-black text-white">{realPlanners}</p>
                        <Users className="w-6 h-6 text-[#3b82f6] opacity-40" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                    <p className="text-xs text-blue-400 leading-relaxed">Estos datos se actualizan automáticamente al registrar un Cierre en tu CRM o cuando un nuevo Planner se une con tu enlace.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT: RESULTS WIDGET */}
        <div className={`flex-1 bg-gradient-to-br p-6 md:p-8 rounded-3xl border shadow-2xl flex flex-col justify-center transition-colors duration-500 ${activeTab === 'simulator' ? 'from-[#10b981]/10 to-[#050505] border-[#10b981]/30 shadow-[#10b981]/10' : 'from-[#3b82f6]/10 to-[#050505] border-[#3b82f6]/30 shadow-[#3b82f6]/10'}`}>
          
          <h3 className="text-neutral-400 font-bold uppercase tracking-widest text-xs mb-2">
            {activeTab === 'simulator' ? 'Proyección Mensual' : 'Saldo Acumulado Real'}
          </h3>
          <div className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">
            {formatMoney(totalDisplay)}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
              <span className="flex items-center gap-2 text-sm text-neutral-300"><Target className="w-4 h-4 text-[#D4AF37]"/> Margen Retail</span>
              <span className="font-bold text-white">{formatMoney(currency === "USD" ? currentData.totalRetailUSD : currentData.totalRetailUSD * exchangeRate)}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
              <span className="flex items-center gap-2 text-sm text-neutral-300"><CircleDollarSign className="w-4 h-4 text-[#3b82f6]"/> Residual Suscripciones</span>
              <span className="font-bold text-white">{formatMoney(currency === "USD" ? currentData.totalSubUSD : currentData.totalSubUSD * exchangeRate)}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
              <span className="flex items-center gap-2 text-sm text-neutral-300"><TrendingUp className="w-4 h-4 text-[#8b5cf6]"/> Bonos Riman</span>
              <span className="font-bold text-white">
                {currentData.leadershipBonusUSD > 0 
                  ? formatMoney(currency === "USD" ? currentData.leadershipBonusUSD : currentData.leadershipBonusUSD * exchangeRate)
                  : <span className="text-neutral-600 text-xs">(Req. 10 socios)</span>
                }
              </span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
