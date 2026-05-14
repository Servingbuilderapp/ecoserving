"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Camera, Upload, ArrowRight, Brain, Sparkles, ShieldCheck, CheckCircle2, ChevronRight, XCircle, Loader2, Droplets, Activity, Zap } from "lucide-react";

type ScannerStep = "lead" | "capture_front" | "capture_left" | "capture_right" | "analyzing" | "results";

interface DiagnosticResult {
  score: number;
  justificacion: string;
}

interface DiagnosticScores {
  edad_facial: DiagnosticResult;
  brillo: DiagnosticResult;
  hidratacion: DiagnosticResult;
  carga_estres: DiagnosticResult;
}

export default function FreeScanLeadMagnet() {
  const supabase = createClient();
  const [step, setStep] = useState<ScannerStep>("lead");
  
  // Lead Data
  const [lead, setLead] = useState({ nombre: "", email: "", telefono: "" });
  const [isSavingLead, setIsSavingLead] = useState(false);
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);

  // Images
  const [images, setImages] = useState<string[]>([]); // 0: front, 1: left, 2: right
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [refParam, setRefParam] = useState<string>("organic");

  const [diagnostic, setDiagnostic] = useState<DiagnosticScores | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Setup ref on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      setRefParam(search.get("ref")?.toLowerCase() || "organic");
    }
  }, []);

  // START CAMERA
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1920 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsCameraReady(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("No pudimos acceder a tu cámara. Sube una foto manualmente.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  // HANDLE LEAD
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLead(true);
    try {
      await supabase.from("leads_y_clientes").insert({
        nombre: lead.nombre,
        email: lead.email,
        telefono: lead.telefono,
        status: "nuevo",
        source: "scan-gratis",
        owner_id: "skingif1",
        referred_by: refParam
      });
      
      setStep("capture_front");
      startCamera();
    } catch (err) {
      console.error(err);
      // Proceed anyway so the user doesn't get blocked
      setStep("capture_front");
      startCamera();
    } finally {
      setIsSavingLead(false);
    }
  };

  // CAPTURE IMAGE
  const captureImage = useCallback((currentStepIndex: number) => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const base64 = canvas.toDataURL("image/jpeg", 0.9);
        
        const newImages = [...images];
        newImages[currentStepIndex] = base64;
        setImages(newImages);

        if (currentStepIndex === 0) setStep("capture_left");
        else if (currentStepIndex === 1) setStep("capture_right");
        else {
          stopCamera();
          setStep("analyzing");
          analyzeTripleImages(newImages);
        }
      }
    }
  }, [images]);

  // UPLOAD IMAGE (Fallback)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, currentStepIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const newImages = [...images];
        newImages[currentStepIndex] = base64;
        setImages(newImages);

        if (currentStepIndex === 0) setStep("capture_left");
        else if (currentStepIndex === 1) setStep("capture_right");
        else {
          stopCamera();
          setStep("analyzing");
          analyzeTripleImages(newImages);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ANALYZE
  const analyzeTripleImages = async (base64Images: string[]) => {
    setError(null);
    try {
      const res = await fetch("/api/riman/analyze-triple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagesBase64: base64Images })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error analizando");
      
      setDiagnostic(data);
      setStep("results");
    } catch (err: any) {
      setError(err.message);
      setStep("capture_front");
    }
  };

  const currentCaptureInstruction = 
    step === "capture_front" ? "Mira directamente a la cámara. Asegura buena iluminación." :
    step === "capture_left" ? "Gira tu rostro 45 grados a la izquierda." :
    "Gira tu rostro 45 grados a la derecha.";

  const currentCaptureIndex = step === "capture_front" ? 0 : step === "capture_left" ? 1 : 2;

  let whatsappLink = "https://wa.me/573227008727?text=Hola!_Vi_tu_esc%C3%A1ner_SkinIQ_y_quiero_mi_regalo."; // default
  
  const msg = "Hola!_Vi_tu_esc%C3%A1ner_SkinIQ_y_quiero_mi_regalo.";
  if (refParam === "gonzalo") whatsappLink = `https://wa.me/573227008727?text=${msg}`;
  else if (refParam === "laura") whatsappLink = `https://wa.me/573102952495?text=${msg}`;
  else if (refParam === "camila") whatsappLink = `https://wa.me/573014313175?text=${msg}`;
  else if (refParam === "karen") whatsappLink = `https://wa.me/573192086270?text=${msg}`;
  else if (refParam === "oscar") whatsappLink = `https://wa.me/573115338408?text=${msg}`;

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* HEADER */}
      <header className="p-6 flex justify-center border-b border-white/5">
        <h1 className="text-3xl font-black text-white tracking-tighter">
          Skin<span className="text-[#D4AF37]">IQ</span>™
        </h1>
      </header>

      <main className="max-w-6xl mx-auto p-4 py-12">

        {/* STEP 1: LEAD MAGNET */}
        {step === "lead" && (
          <div className="max-w-xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 rounded-full text-sm font-bold border border-[#D4AF37]/20">
              <Sparkles className="w-4 h-4" /> Escáner Facial con IA
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Descubre tu Skin Age Gap™ <br/>en 30 segundos
            </h2>
            
            <p className="text-neutral-400 text-lg leading-relaxed">
              Nuestro motor clínico analiza 4 variables críticas de tu piel usando Inteligencia Artificial. Obtén tu resumen ejecutivo flash y descubre tu rutina ideal.
            </p>

            <form onSubmit={handleLeadSubmit} className="bg-[#111] border border-neutral-800 p-8 rounded-3xl space-y-6 text-left shadow-2xl">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-neutral-300 mb-1 block">Tu Nombre</label>
                  <input required type="text" value={lead.nombre} onChange={e => setLead({...lead, nombre: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all" placeholder="Ej. Camila" />
                </div>
                <div>
                  <label className="text-sm font-bold text-neutral-300 mb-1 block">Correo Electrónico</label>
                  <input required type="email" value={lead.email} onChange={e => setLead({...lead, email: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all" placeholder="camila@email.com" />
                </div>
              </div>
              
              <div className="flex items-start gap-3 mt-4">
                <input required type="checkbox" id="habeasData" checked={aceptaPoliticas} onChange={e => setAceptaPoliticas(e.target.checked)} className="mt-1 w-4 h-4 accent-[#D4AF37]" />
                <label htmlFor="habeasData" className="text-xs text-neutral-400 leading-tight cursor-pointer">
                  Acepto la Política de Privacidad y el tratamiento de mis datos para fines de asesoría estética
                </label>
              </div>
              
              <button disabled={isSavingLead || !aceptaPoliticas} type="submit" className="w-full bg-[#D4AF37] hover:bg-white text-black font-bold text-lg py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] disabled:opacity-50">
                {isSavingLead ? <Loader2 className="w-6 h-6 animate-spin" /> : "Iniciar Escáner Gratis"} <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: TRIPLE CAPTURE */}
        {(step === "capture_front" || step === "capture_left" || step === "capture_right") && (
          <div className="max-w-md mx-auto text-center animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-white mb-2">Paso {currentCaptureIndex + 1} de 3</h2>
            <p className="text-[#D4AF37] font-medium mb-8">{currentCaptureInstruction}</p>

            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#111] border-2 border-dashed border-neutral-700 mb-8">
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-[#111]">
                  <XCircle className="w-12 h-12 text-red-500 mb-4" />
                  <p className="text-red-400 mb-6">{error}</p>
                  <label className="bg-[#D4AF37] text-black px-6 py-3 rounded-full font-bold cursor-pointer">
                    Subir Foto
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, currentCaptureIndex)} />
                  </label>
                </div>
              )}

              <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover transform ${isCameraReady ? 'scale-x-[-1]' : 'hidden'}`} />
              
              {!isCameraReady && !error && (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-neutral-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p>Iniciando cámara...</p>
                </div>
              )}

              {/* Facial Guide Overlay */}
              {isCameraReady && (
                <div className="absolute inset-0 pointer-events-none flex justify-center items-center p-8 opacity-40">
                  <div className="w-full h-3/4 border-2 border-[#D4AF37] rounded-[100px] border-dashed" />
                </div>
              )}
            </div>

            <button onClick={() => captureImage(currentCaptureIndex)} disabled={!isCameraReady} className="w-full bg-[#D4AF37] hover:bg-white text-black font-bold text-lg py-4 rounded-xl flex justify-center items-center gap-2 transition-all">
              <Camera className="w-6 h-6" /> {step === "capture_front" ? "Capturar Frente" : step === "capture_left" ? "Capturar Perfil Izquierdo" : "Capturar Perfil Derecho"}
            </button>
            <p className="text-neutral-500 text-sm mt-4">Tus fotos son procesadas de forma privada y no se almacenan.</p>
          </div>
        )}

        {/* STEP 3: ANALYZING */}
        {step === "analyzing" && (
          <div className="max-w-md mx-auto text-center py-20 animate-in fade-in">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-[#D4AF37]/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-[#D4AF37] rounded-full border-t-transparent animate-spin" />
              <Brain className="w-12 h-12 text-[#D4AF37] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Analizando 3 Ángulos</h2>
            <p className="text-neutral-400">Procesando 12,000 puntos de datos biométricos...</p>
          </div>
        )}

        {/* STEP 4: RESULTS FLASH */}
        {step === "results" && diagnostic && (
          <div className="animate-in slide-in-from-bottom-8 duration-700 max-w-2xl mx-auto w-full text-black">
            
            <div className="text-center mb-10 text-white">
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 rounded-full text-sm font-bold border border-[#D4AF37]/20 mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <ShieldCheck className="w-4 h-4" /> Diagnóstico Flash Completado
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2">SkinIQ™ Resumen Ejecutivo</h2>
              <p className="text-neutral-400 text-lg font-medium">Análisis de {lead.nombre}</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Skin Age Gap™", data: diagnostic.edad_facial, icon: Zap },
                { label: "Glow Score™", data: diagnostic.brillo, icon: Sparkles },
                { label: "Hydration Level™", data: diagnostic.hidratacion, icon: Droplets },
                { label: "Skin Stress Load™", data: diagnostic.carga_estres, icon: Activity },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center md:items-start gap-4 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 200}ms`, animationFillMode: "both" }}>
                  <div className="bg-gradient-to-br from-[#D4AF37] to-[#F3E5AB] p-4 rounded-2xl shadow-lg shrink-0 text-black">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{item.label}</h3>
                    <p className="text-neutral-300 text-sm italic">"{item.data.justificacion}"</p>
                  </div>
                  <div className="flex items-center justify-center bg-black/40 px-6 py-4 rounded-2xl border border-white/5 shadow-inner shrink-0 w-full md:w-auto mt-4 md:mt-0">
                    <span className="text-3xl font-black text-[#D4AF37]">{item.data.score}</span>
                    <span className="text-neutral-500 text-sm ml-1">/100</span>
                  </div>
                </div>
              ))}
            </div>

            {/* HOOK & ACTION */}
            <div className="mt-12 text-center animate-in fade-in duration-1000" style={{ animationDelay: "1000ms", animationFillMode: "both" }}>
              <p className="text-white text-lg font-medium mb-8 leading-relaxed px-4">
                Este es tu análisis rápido. Para obtener tu diagnóstico profundo de 30 variables y tu rutina personalizada, únete a nuestra comunidad privada.
              </p>
              
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-black py-5 px-10 rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(37,211,102,0.4)] text-lg"
              >
                <Sparkles className="w-6 h-6" /> Reclamar Mis Masajes Gratis
              </a>
            </div>
          </div>
        )}

      </main>

      {/* GLOBAL FOOTER DISCLAIMER */}
      <footer className="p-6 text-center border-t border-white/5 mt-auto">
        <p className="text-xs text-neutral-500 max-w-3xl mx-auto leading-relaxed">
          SkinIQ™ es una herramienta de orientación estética basada en inteligencia artificial. Los resultados son referenciales y no constituyen un diagnóstico, tratamiento o consejo médico. Consulte siempre a su dermatólogo.
        </p>
      </footer>
    </div>
  );
}
