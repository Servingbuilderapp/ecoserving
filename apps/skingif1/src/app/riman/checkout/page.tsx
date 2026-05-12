"use client";

import { Suspense, useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, Lock, ArrowRight, Loader2, Star, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PayPalButtons } from "@paypal/react-paypal-js";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("ES");
  
  // Read plan from URL (e.g., ?plan=pro)
  const planType = searchParams.get("plan") || "basic";
  const isPro = planType === "pro";

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row font-sans text-neutral-900">
      
      {/* LEFT PANEL: RESUMEN (NEGRO/DORADO) */}
      <div className={`w-full md:w-1/2 text-white p-8 md:p-16 flex flex-col justify-center relative overflow-hidden ${isPro ? 'bg-gradient-to-br from-[#0a0a0a] to-[#1a1025]' : 'bg-black'}`}>
        <div className={`absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] pointer-events-none ${isPro ? 'bg-[#8b5cf6]/20' : 'bg-[#D4AF37]/10'}`} />
        
        <div className="relative z-10 max-w-md mx-auto w-full">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Skingif<span className={isPro ? "text-[#8b5cf6]" : "text-[#D4AF37]"}>1</span></h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest mb-8">
            {isPro ? <Zap className="w-3 h-3 text-[#8b5cf6]" /> : <Star className="w-3 h-3 text-[#D4AF37]" />}
            Nivel {isPro ? 'SuperPro (70 Apps)' : 'Básico (30 Apps)'}
          </div>
          
          <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 mb-8 shadow-xl">
            <h2 className={`${isPro ? 'text-[#8b5cf6]' : 'text-[#D4AF37]'} font-bold text-xl mb-4`}>Tu Suscripción Incluye:</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isPro ? 'text-[#8b5cf6]' : 'text-green-500'}`} />
                <span className="text-neutral-300 text-sm">Escáner Facial IA con enlace de réplica.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isPro ? 'text-[#8b5cf6]' : 'text-green-500'}`} />
                <span className="text-neutral-300 text-sm">CRM Proactivo con Algoritmo de Seguimiento.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${isPro ? 'text-[#8b5cf6]' : 'text-green-500'}`} />
                <span className="text-neutral-300 text-sm">Hub de Comunidad y Billetera Financiera.</span>
              </li>
              {isPro && (
                <>
                  <div className="h-px bg-neutral-800 w-full my-4"></div>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#D4AF37]" />
                    <span className="text-white font-bold text-sm">Master Apps: Estrategias K-Pop & Redes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#D4AF37]" />
                    <span className="text-white font-bold text-sm">Módulo Médico y Dermatológico Avanzado.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#D4AF37]" />
                    <span className="text-white font-bold text-sm">Acceso a las 70 Apps completas.</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex justify-between items-end border-t border-neutral-800 pt-6">
            <span className="text-neutral-400">Total a pagar hoy</span>
            <div className="text-right">
              <span className="text-4xl font-black text-white">${isPro ? '49' : '12'}</span>
              <span className="text-sm text-neutral-500 ml-1">USD / mes</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: PAYPAL FORM */}
      <div className="w-full md:w-1/2 bg-white p-8 md:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Datos de Pago</h2>
            <div className="flex gap-2">
              <button onClick={() => setLang("ES")} className={`text-xs font-bold px-2 py-1 rounded ${lang==='ES'?'bg-neutral-900 text-white':'bg-neutral-100'}`}>ES</button>
              <button onClick={() => setLang("EN")} className={`text-xs font-bold px-2 py-1 rounded ${lang==='EN'?'bg-neutral-900 text-white':'bg-neutral-100'}`}>EN</button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <p>Procesamiento seguro para Colombia y el mundo respaldado por <strong>PayPal</strong>.</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-[#0070ba]" />
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <PayPalButtons
                  style={{ 
                    layout: "vertical",
                    color: "blue",
                    shape: "rect",
                    label: "pay"
                  }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "USD",
                            value: isPro ? "49.00" : "12.00",
                          },
                          description: `Skingif1 ${isPro ? 'SuperPro' : 'Basic'} Plan`,
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    if (!actions.order) return;
                    setLoading(true);
                    try {
                      const details = await actions.order.capture();
                      
                      const response = await fetch('/api/webhooks/payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          event: 'payment.completed',
                          customer: {
                            email: details.payer?.email_address || 'customer@example.com',
                            first_name: details.payer?.name?.given_name || 'Customer',
                            last_name: details.payer?.name?.surname || ''
                          },
                          plan: isPro ? 'crecimiento-max' : 'crecimiento-30',
                          source: 'paypal',
                          transaction_id: details.id,
                          amount: isPro ? 49 : 12,
                          currency: 'USD'
                        })
                      });

                      const resData = await response.json();

                      if (response.ok) {
                        if (isPro) {
                          localStorage.setItem('isProUser', 'true');
                        }
                        const customerEmail = details.payer?.email_address || 'customer@example.com';
                        router.push(`/plans/success?email=${encodeURIComponent(customerEmail)}&password=${encodeURIComponent(resData.generated_password || '')}&new=${resData.is_new_user}`);
                      } else {
                        throw new Error(resData.error || 'Failed to update plan');
                      }
                    } catch (error) {
                      console.error("Error capturando el pago:", error);
                      setLoading(false);
                    }
                  }}
                />

                <button 
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const response = await fetch('/api/webhooks/payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          event: 'payment.completed',
                          customer: {
                            email: 'servingbuilderapp@gmail.com',
                            first_name: 'Admin',
                            last_name: 'Skingif1'
                          },
                          plan: isPro ? 'crecimiento-max' : 'crecimiento-30',
                          source: 'paypal_simulation',
                          transaction_id: 'SIM_' + Math.random().toString(36).substr(2, 9),
                          amount: isPro ? 49 : 12,
                          currency: 'USD'
                        })
                      });

                      const resData = await response.json();
                      if (response.ok) {
                        if (isPro) localStorage.setItem('isProUser', 'true');
                        router.push(`/plans/success?email=servingbuilderapp@gmail.com&password=${encodeURIComponent(resData.generated_password || '')}&new=${resData.is_new_user}`);
                      } else {
                        throw new Error(resData.error || 'Error en simulación');
                      }
                    } catch(err) {
                      console.error(err);
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="w-full bg-neutral-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all flex justify-center items-center gap-2 text-sm"
                >
                  🧪 Simular Pago Exitoso (Solo DEV)
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-neutral-400">
              <Lock className="w-3 h-3" />
              <p className="text-center">Puedes cancelar tu suscripción desde tu cuenta en cualquier momento.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RimanCheckout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#0070ba]" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
