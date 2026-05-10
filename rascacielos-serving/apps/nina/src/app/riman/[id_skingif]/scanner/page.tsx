"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Camera, Upload, ArrowRight, Brain, Sparkles, ShieldCheck, CheckCircle2, ChevronRight, XCircle, Loader2 } from "lucide-react";

// Types
type ScannerStep = "intro" | "lead" | "capture" | "analyzing" | "results";

interface DiagnosticScores {
  hidratacion: { score: number; justificacion: string };
  textura_poros: { score: number; justificacion: string };
  lineas_expresion: { score: number; justificacion: string };
  sensibilidad: { score: number; justificacion: string };
}

export default function RimanScanner() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const id_skingif = params.id_skingif as string;

  // Planner Info
  const [plannerIdRiman, setPlannerIdRiman] = useState("");
  const [plannerName, setPlannerName] = useState("");
  
  // States
  const [step, setStep] = useState<ScannerStep>("intro");
  const [lead, setLead] = useState({ nombre: "", email: "", telefono: "" });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [diagnostic, setDiagnostic] = useState<DiagnosticScores | null>(null);
  const [error, setError] = useState("");

  // Camera Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Fetch Planner Info on Load
  useEffect(() => {
    const fetchPlanner = async () => {
      const { data } = await supabase
        .from("sucursales_planners")
        .select("riman_id, nombre_completo")
        .eq("id_skingif", id_skingif)
        .single();
      
      if (data) {
        setPlannerIdRiman(data.riman_id || id_skingif);
        setPlannerName(data.nombre_completo || id_skingif);
      }
    };
    if (id_skingif) fetchPlanner();
  }, [id_skingif, supabase]);

  // Handle Lead Form Submit
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Registrar Lead de forma silenciosa para asegurar al Planner
      await supabase.from("leads_y_clientes").insert({
        nombre: lead.nombre,
        email: lead.email,
        telefono: lead.telefono,
        owner_id: id_skingif
      });
      setStep("capture");
    } catch (err) {
      console.error("Lead Error", err);
      // Even if it fails (e.g. offline), we let them scan to not block the UX.
      setStep("capture"); 
    }
  };

  // Start Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setError("No se pudo acceder a la cámara. Por favor sube una foto.");
    }
  };

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // Start Camera when entering capture step
  useEffect(() => {
    if (step === "capture" && !capturedImage) {
      startCamera();
    }
  }, [step, capturedImage]);

  // Take Snapshot
  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(base64);
        stopCamera();
        analyzeImage(base64);
      }
    }
  };

  // File Upload Fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCapturedImage(base64);
        analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send to Gemini
  const analyzeImage = async (base64: string) => {
    setStep("analyzing");
    try {
      const res = await fetch("/api/riman/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setDiagnostic(data);
      
      // Update the lead record with the result in background
      // DEMO: Disabled to prevent crash if DB is not populated
      /*await supabase
        .from("leads_y_clientes")
        .update({ resultado_scanner_facial: data })
        .eq("email", lead.email);*/

      setTimeout(() => setStep("results"), 1000);
      
    } catch (err: any) {
      setError(err.message || "Error al analizar");
      setStep("capture");
      setCapturedImage(null);
    }
  };

  // Helper: Product Matcher
  const getRecommendedProducts = () => {
    if (!diagnostic) return [];
    const products = [];
    
    if (diagnostic.hidratacion.score < 6) {
      products.push({
        name: "Dermatology First Package (Booster + Serum)",
        reason: "Hidratación Profunda",
        desc: "El método Boo-Se-Boo penetra las capas profundas de la dermis para restaurar la humedad bloqueada.",
        img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop"
      });
    }
    if (diagnostic.sensibilidad.score < 6) {
      products.push({
        name: "Calming Balance Gel",
        reason: "Alivio y Barrera",
        desc: "Oro de 24k y 8 capas de ácido hialurónico para calmar rojeces al instante.",
        img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=300&auto=format&fit=crop"
      });
    }
    if (diagnostic.lineas_expresion.score < 6 || products.length === 0) {
      products.push({
        name: "Dermatology Cream + Multi Stick Balm",
        reason: "Anti-Envejecimiento",
        desc: "Centella Asiática Gigante patentada para rellenar arrugas y recuperar la elasticidad.",
        img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=300&auto=format&fit=crop"
      });
    }
    return products;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* Top Bar */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-bold text-xl tracking-tight">skingif<span className="text-[#D4AF37]">1</span></div>
        <div className="text-xs text-neutral-400">Atendido por: <span className="text-white font-semibold">{plannerName || id_skingif}</span></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* STEP 1: INTRO */}
        {step === "intro" && (
          <div className="flex flex-col items-center justify-center text-center py-12 md:py-24 space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="bg-[#D4AF37]/10 p-5 rounded-full ring-1 ring-[#D4AF37]/30 mb-2">
              <Brain className="w-12 h-12 text-[#D4AF37]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter">
              Conoce el futuro <br/> de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">Piel</span>.
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl max-w-xl">
              Nuestro Escáner con Inteligencia Artificial analiza 4 capas críticas de tu dermis y te receta una rutina exacta de K-Beauty.
            </p>
            <button 
              onClick={() => setStep("lead")}
              className="mt-8 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_40px_rgba(212,175,55,0.3)]"
            >
              Iniciar Escaneo Gratis <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: LEAD CAPTURE */}
        {step === "lead" && (
          <div className="max-w-md mx-auto py-12 animate-in slide-in-from-right duration-300">
            <h2 className="text-3xl font-bold mb-3">Tus Datos</h2>
            <p className="text-neutral-400 mb-8">Para enviarte la receta médica detallada de tu piel.</p>
            
            <form onSubmit={handleLeadSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Nombre Completo</label>
                <input required type="text" value={lead.nombre} onChange={e => setLead({...lead, nombre: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3.5 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Correo Electrónico</label>
                <input required type="email" value={lead.email} onChange={e => setLead({...lead, email: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3.5 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">WhatsApp (Opcional)</label>
                <input type="tel" value={lead.telefono} onChange={e => setLead({...lead, telefono: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3.5 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-bold py-4 rounded-xl shadow-lg hover:shadow-[#D4AF37]/20 transition-all mt-4">
                Continuar al Escáner
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: CAPTURE */}
        {step === "capture" && (
          <div className="max-w-md mx-auto py-8 animate-in zoom-in-95 duration-300 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Escáner Facial</h2>
            <p className="text-neutral-400 text-center mb-6 text-sm">Asegúrate de estar en un lugar con buena luz y quítate los lentes.</p>
            
            {error && <div className="bg-red-900/50 text-red-200 p-3 rounded-lg text-sm mb-4 border border-red-800">{error}</div>}

            <div className="relative w-full aspect-[3/4] bg-neutral-900 rounded-3xl overflow-hidden border-2 border-neutral-800 shadow-2xl">
              {/* Overlay guides */}
              <div className="absolute inset-0 border-4 border-dashed border-white/20 rounded-3xl z-10 pointer-events-none m-8"></div>
              
              {!capturedImage ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : (
                <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
              )}
            </div>

            <div className="w-full flex gap-4 mt-8">
              {!capturedImage && (
                <button onClick={takeSnapshot} className="flex-1 bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5" /> Analizar Rostro
                </button>
              )}
              
              <div className="relative flex-1">
                <input type="file" accept="image/*" capture="user" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                <button className="w-full bg-neutral-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-neutral-700 hover:bg-neutral-700 transition-colors">
                  <Upload className="w-5 h-5" /> Subir Foto
                </button>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* STEP 4: ANALYZING (MAGIA) */}
        {step === "analyzing" && (
          <div className="max-w-md mx-auto py-12 flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.4)] mb-8">
              <img src={capturedImage!} className="w-full h-full object-cover grayscale opacity-80" alt="Scanning" />
              {/* CSS Scanner Line Animation */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
              {/* CSS Grid Overlay */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-2">Diagnosticando tu Piel</h2>
            <div className="flex gap-2 items-center text-[#D4AF37]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <p className="text-sm tracking-widest uppercase font-semibold">Gemini Vision AI Activo</p>
            </div>
            
            <div className="mt-8 space-y-3 w-full px-8">
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                 <div className="h-full bg-[#D4AF37] w-1/4 animate-[pulse_1s_ease-in-out_infinite]" />
              </div>
              <p className="text-xs text-neutral-500 text-center uppercase tracking-widest">Leyendo textura de poros...</p>
            </div>
          </div>
        )}

        {/* STEP 5: RESULTS (DASHBOARD MEDICO) */}
        {step === "results" && diagnostic && (
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold">Diagnóstico Completado</h2>
              <p className="text-[#D4AF37] font-medium mt-1">Análisis por Inteligencia Artificial</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Left Column: Image Map & Scores */}
              <div className="space-y-8">
                {/* Visual Heatmap approach: Grayscale image with colored zones/borders based on scores */}
                <div className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900 group">
                  <img src={capturedImage!} className="w-full object-cover aspect-square grayscale opacity-70 group-hover:grayscale-0 transition-all duration-1000" alt="Tu Rostro" />
                  
                  {/* Absolute overlays based on bad scores (just visual flare) */}
                  {diagnostic.hidratacion.score < 5 && <div className="absolute inset-x-4 top-1/3 h-1/4 bg-blue-500/20 mix-blend-overlay blur-xl" />}
                  {diagnostic.sensibilidad.score < 5 && <div className="absolute inset-x-8 top-1/4 h-1/2 bg-red-500/20 mix-blend-overlay blur-xl" />}
                  
                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10 flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-400"/> Escaneo Verificado</span>
                    <span className="text-neutral-400">Pcte: {lead.nombre || 'Invitado'}</span>
                  </div>
                </div>

                {/* Score Bars */}
                <div className="bg-[#111] rounded-3xl p-6 border border-neutral-800 space-y-5">
                  <h3 className="font-bold border-b border-neutral-800 pb-3 mb-4">Evaluación Biométrica</h3>
                  
                  {[
                    { label: "Hidratación", data: diagnostic.hidratacion },
                    { label: "Textura y Poros", data: diagnostic.textura_poros },
                    { label: "Líneas de Expresión", data: diagnostic.lineas_expresion },
                    { label: "Sensibilidad", data: diagnostic.sensibilidad },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-neutral-300">{item.label}</span>
                        <span className={`font-bold ${item.data.score > 7 ? 'text-green-400' : item.data.score > 4 ? 'text-[#D4AF37]' : 'text-red-400'}`}>
                          {item.data.score}/10
                        </span>
                      </div>
                      <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden mb-2">
                        <div 
                          className={`h-full rounded-full ${item.data.score > 7 ? 'bg-green-400' : item.data.score > 4 ? 'bg-[#D4AF37]' : 'bg-red-400'}`} 
                          style={{ width: `${item.data.score * 10}%` }}
                        />
                      </div>
                      <p className="text-xs text-neutral-500 italic leading-relaxed">{item.data.justificacion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Prescription & Testimonials */}
              <div className="space-y-6">
                
                <div className="bg-gradient-to-b from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-3xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                    <h3 className="text-xl font-bold">Receta K-Beauty</h3>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {getRecommendedProducts().map((prod, i) => (
                      <div key={i} className="flex gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 items-center">
                        <img src={prod.img} className="w-16 h-16 rounded-xl object-cover bg-neutral-800" alt={prod.name} />
                        <div>
                          <span className="text-[10px] font-bold tracking-wider text-[#D4AF37] uppercase">{prod.reason}</span>
                          <h4 className="font-bold text-sm leading-tight mt-0.5">{prod.name}</h4>
                          <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{prod.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a 
                    href={`https://mall.riman.com/tu-carro?ref=${plannerIdRiman}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-bold text-lg py-4 px-6 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-transform"
                  >
                    Comprar mi Ritual <ChevronRight className="w-5 h-5" />
                  </a>
                  <p className="text-center text-xs text-neutral-500 mt-4">
                    Compra segura a través de la tienda oficial de <b>{plannerName || id_skingif}</b>
                  </p>
                </div>

                {/* Dynamic Testimonials */}
                <div className="bg-[#111] rounded-3xl p-6 border border-neutral-800">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-green-500"/> Resultados Clínicos
                  </h4>
                  <div className="flex gap-4">
                    <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=300&auto=format&fit=crop" className="w-24 h-24 rounded-xl object-cover" alt="Testimonio" />
                    <div>
                      <p className="text-sm text-neutral-300 italic mb-2">"Llevaba años luchando con la textura irregular y poros obstruidos. El método Boo-Se-Boo transformó mi piel en 3 semanas."</p>
                      <span className="text-xs font-bold text-[#D4AF37]">- Testimonio Real RIMAN</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
      
      {/* Required for Tailwind scan animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}} />
    </div>
  );
}
