"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, XCircle, Loader2, Sparkles, ShieldCheck, Globe, Brain, Users } from "lucide-react";
import Link from "next/link";

export default function RimanOnboarding() {
  const router = useRouter();
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    id_skingif: "",
    id_riman: "",
    email: "",
    password: "",
  });
  
  const [idStatus, setIdStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Debounce and validate id_skingif on-change
  useEffect(() => {
    const checkId = async () => {
      if (!formData.id_skingif || formData.id_skingif.length < 3) {
        setIdStatus("idle");
        return;
      }
      
      setIdStatus("checking");
      
      const cleanId = formData.id_skingif.toLowerCase().replace(/[^a-z0-9_]/g, "");
      
      const { data, error } = await supabase
        .from("sucursales_planners")
        .select("id_skingif")
        .eq("id_skingif", cleanId)
        .single();
        
      if (data) {
        setIdStatus("taken");
      } else {
        setIdStatus("available");
      }
    };

    const timer = setTimeout(() => {
      checkId();
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.id_skingif, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (idStatus === "taken") {
      setError("El ID Skingif elegido ya está en uso. Por favor, elige otro.");
      return;
    }

    setIsSubmitting(true);
    const cleanId = formData.id_skingif.toLowerCase().replace(/[^a-z0-9_]/g, "");

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No se pudo crear el usuario");

      const { error: dbError } = await supabase
        .from("sucursales_planners")
        .insert({
          id_skingif: cleanId,
          user_id: authData.user.id,
          riman_id: formData.id_riman,
          nombre_completo: formData.email.split('@')[0], 
        });

      if (dbError) throw dbError;

      router.push("/riman/checkout");

    } catch (err: any) {
      console.error("Error signing up:", err);
      setError(err.message || "Ocurrió un error al procesar tu registro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row font-sans">
      
      {/* LEFT PANEL: Sales Script (The Value Proposition) */}
      <div className="w-full lg:w-7/12 bg-black text-white flex flex-col relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#D4AF37]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4AF37]/5 blur-[100px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto px-8 py-12 lg:px-16 lg:py-16 flex flex-col justify-center z-10 relative no-scrollbar">
          
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Acceso Exclusivo Pioneros
          </div>
          
          <h1 className="text-4xl lg:text-[44px] font-bold leading-[1.15] mb-10 tracking-tight">
            Únete a la Multinacional skingif1:<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
              Tu Negocio de K-Beauty con Tecnología de Punta.
            </span>
          </h1>

          <div className="space-y-10">
            {/* El Poder de Jeju */}
            <div>
              <h2 className="text-xl font-semibold border-b border-neutral-800 pb-3 mb-5 text-neutral-200">El Poder de Jeju</h2>
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <div className="mt-1 shrink-0 bg-[#D4AF37]/10 p-2 rounded-lg border border-[#D4AF37]/20">
                    <Globe className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <strong className="block text-[#F3E5AB] text-lg mb-1">Patente Global</strong>
                    <span className="text-neutral-400 text-sm leading-relaxed">Acceso a la única línea del mundo con Centella Asiática Gigante de la Isla de Jeju, con una concentración de activos 3 veces superior a la convencional.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 shrink-0 bg-[#D4AF37]/10 p-2 rounded-lg border border-[#D4AF37]/20">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <strong className="block text-[#F3E5AB] text-lg mb-1">Tecnología de Liposomas</strong>
                    <span className="text-neutral-400 text-sm leading-relaxed">Productos que no se quedan en la superficie; viajan a las capas profundas de la dermis para una transformación real (basado en el método Boo-Se-Boo).</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* El Plan de Carrera */}
            <div>
              <h2 className="text-xl font-semibold border-b border-neutral-800 pb-3 mb-5 text-neutral-200">El Plan de Carrera</h2>
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <div className="mt-1 shrink-0 bg-[#D4AF37]/10 p-2 rounded-lg border border-[#D4AF37]/20">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <strong className="block text-[#F3E5AB] text-lg mb-1">Posición Vitalicia</strong>
                    <span className="text-neutral-400 text-sm leading-relaxed">En skingif1, una vez que calificas a tus primeros rangos (Planner, Manager), tu posición y beneficios son de por vida. Sin recompras obligatorias castigadoras.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 shrink-0 bg-[#D4AF37]/10 p-2 rounded-lg border border-[#D4AF37]/20">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <strong className="block text-[#F3E5AB] text-lg mb-1">Expansión Iberoamérica</strong>
                    <span className="text-neutral-400 text-sm leading-relaxed">Estás entrando como Pionero de Pioneros en el mercado de Colombia. Los que toman posición hoy, lideran la red del mañana.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Stack Tecnológico */}
            <div className="bg-[#111] rounded-2xl p-6 border border-neutral-800 shadow-2xl">
              <h3 className="text-[#D4AF37] font-semibold mb-4 text-lg">Lo que recibes por tus $12 USD netos:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-neutral-500 shrink-0" />
                  <span className="text-sm text-neutral-300">Tu propia <b>Sucursal Digital</b></span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-neutral-500 shrink-0" />
                  <span className="text-sm text-neutral-300"><b>Escáner Facial con IA</b></span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-neutral-500 shrink-0" />
                  <span className="text-sm text-neutral-300"><b>CRM de Seguimiento</b> privado</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-neutral-500 shrink-0" />
                  <span className="text-sm text-neutral-300"><b>Academia Digital</b> Oficial</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Onboarding Form */}
      <div className="w-full lg:w-5/12 bg-white flex flex-col justify-center px-8 py-16 lg:px-14 z-20">
        
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-black mb-3">Activa tu Plataforma</h2>
            <p className="text-neutral-600 text-sm leading-relaxed">Asegura tu lugar en la expansión de K-Beauty más grande de Colombia. Tu negocio, tu red, tu éxito.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md flex items-start gap-3">
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ID SKINGIF */}
            <div>
              <label className="block text-sm font-bold text-neutral-900 mb-1.5">
                Tu Identificador Único <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-neutral-400 font-medium">@</span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.id_skingif}
                  onChange={(e) => setFormData({...formData, id_skingif: e.target.value})}
                  className={`block w-full pl-9 pr-12 py-3.5 bg-neutral-50 border ${
                    idStatus === 'available' ? 'border-green-500 ring-1 ring-green-500' : 
                    idStatus === 'taken' ? 'border-red-500 ring-1 ring-red-500' : 
                    'border-neutral-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]'
                  } rounded-xl text-black font-medium outline-none transition-all`}
                  placeholder="ej. maria_pionera"
                />
                
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  {idStatus === 'checking' && <Loader2 className="h-5 w-5 text-neutral-400 animate-spin" />}
                  {idStatus === 'available' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {idStatus === 'taken' && <XCircle className="h-5 w-5 text-red-500" />}
                </div>
              </div>
              
              <div className="mt-2 min-h-[20px]">
                {idStatus === 'available' && <p className="text-xs text-green-600 font-bold">¡Este ID está disponible!</p>}
                {idStatus === 'taken' && <p className="text-xs text-red-600 font-bold">El ID ya está en uso. Prueba con otro.</p>}
                {formData.id_skingif.length > 0 && idStatus !== 'taken' && (
                  <p className="text-xs text-neutral-500 mt-1">URL: <span className="text-[#D4AF37] font-medium">skingif1.com/{formData.id_skingif.toLowerCase().replace(/[^a-z0-9_]/g, "")}</span></p>
                )}
              </div>
            </div>

            {/* ID RIMAN OFICIAL */}
            <div>
              <label className="block text-sm font-bold text-neutral-900 mb-1.5">
                ID RIMAN Oficial <span className="text-neutral-400 font-normal ml-1">(Opcional)</span>
              </label>
              <input
                type="text"
                value={formData.id_riman}
                onChange={(e) => setFormData({...formData, id_riman: e.target.value})}
                className="block w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-black outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                placeholder="INC-XXXXX"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-bold text-neutral-900 mb-1.5">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="block w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-black outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                placeholder="tu@correo.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-bold text-neutral-900 mb-1.5">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="block w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-black outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || idStatus === 'taken' || idStatus === 'checking'}
              className="w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-lg shadow-[#D4AF37]/20 text-sm font-bold text-black bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creando cuenta...
                </>
              ) : (
                "Continuar al Pago de $12 USD"
              )}
            </button>
            
            <p className="text-[11px] text-center text-neutral-400 mt-6 leading-relaxed px-4">
              Al continuar, aceptas iniciar tu proceso de alta. El acceso a tu sucursal digital y al CRM se habilitará tras confirmar el pago de la suscripción.
            </p>

          </form>
        </div>
      </div>

    </div>
  );
}
