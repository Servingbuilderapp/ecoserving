"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Camera, CheckCircle2, ChevronRight, Mic, Play } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

type CaptureStep = "intro" | "left" | "right" | "front" | "done";

export default function CapturePage() {
  const [step, setStep] = useState<CaptureStep>("intro");
  const [countdown, setCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("No se pudo acceder a la cámara.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Voice Synthesis helper
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.rate = 0.9;
      utterance.pitch = 1.1; // Slightly higher pitch for a friendly AI voice
      if (onEnd) {
        utterance.onend = onEnd;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  }, []);

  const handleCaptureFlow = useCallback(() => {
    startCamera();
    
    const steps = [
      { id: "left", instruction: "Por favor, ponte de perfil izquierdo. Toma en 3, 2, 1" },
      { id: "right", instruction: "Perfecto. Ahora, ponte de perfil derecho. Toma en 3, 2, 1" },
      { id: "front", instruction: "Excelente. Por último, ponte de frente a la cámara. Toma en 3, 2, 1" }
    ];

    let currentStepIndex = 0;

    const executeNextStep = () => {
      if (currentStepIndex >= steps.length) {
        speak("¡Listo! Las tres capturas se han realizado con éxito. Procesando tu SkinIQ.", () => {
          setStep("done");
          stopCamera();
        });
        return;
      }

      const current = steps[currentStepIndex];
      setStep(current.id as CaptureStep);
      
      speak(current.instruction, () => {
        // Start visual countdown
        setCountdown(3);
        let count = 3;
        const interval = setInterval(() => {
          count -= 1;
          if (count > 0) {
            setCountdown(count);
          } else {
            clearInterval(interval);
            setCountdown(null);
            // Flash screen effect could go here
            speak("Listo.", () => {
              // Wait a moment before next step
              setTimeout(() => {
                currentStepIndex++;
                executeNextStep();
              }, 1000);
            });
          }
        }, 1000);
      });
    };

    // Start flow
    executeNextStep();
  }, [speak]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-slide-up">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-[#1A1A1A]">SkinIQ™ Capture</h1>
        <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
          Sistema de análisis guiado por IA. Sigue las instrucciones de voz para completar tu perfil facial en 3D.
        </p>
      </div>

      <GlassCard className="overflow-hidden p-0 relative min-h-[500px] flex flex-col items-center justify-center bg-[#F2E8DF]/50">
        
        {step === "intro" && (
          <div className="text-center p-10 space-y-6">
            <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h2 className="text-3xl font-bold">Análisis Asistido por Voz</h2>
            <p className="text-neutral-600 max-w-md mx-auto">
              Nuestra IA te guiará paso a paso mediante instrucciones de audio para asegurar el ángulo perfecto en cada toma.
            </p>
            <button 
              onClick={handleCaptureFlow}
              className="mt-8 bg-gradient-to-r from-[#D4AF37] to-[#e6c558] text-[#1A1A1A] font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-xl shadow-[#D4AF37]/20"
            >
              <Play className="w-5 h-5" />
              Iniciar Captura Guiada
            </button>
          </div>
        )}

        {(step === "left" || step === "right" || step === "front") && (
          <div className="w-full h-full relative flex flex-col">
            <div className="absolute top-6 left-0 right-0 z-10 text-center">
              <div className="inline-flex bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/50 text-xl font-bold text-[#1A1A1A]">
                {step === "left" && "Perfil Izquierdo"}
                {step === "right" && "Perfil Derecho"}
                {step === "front" && "Vista Frontal"}
              </div>
            </div>

            {/* Video Feed */}
            <div className="w-full max-w-[360px] mx-auto h-[540px] bg-black relative overflow-hidden rounded-[3rem] shadow-[0_0_40px_rgba(212,175,55,0.15)] ring-4 ring-[#D4AF37]/20 my-4">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              
              {/* Oval overlay guideline for face */}
              <div className="absolute inset-0 pointer-events-none p-6">
                <div className="w-full h-full border-[3px] border-dashed border-[#D4AF37]/60 rounded-[100%] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] transition-all duration-1000 animate-pulse-ring" />
              </div>

              {/* Grid lines for alignment */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/3 w-full h-[1px] bg-white" />
                <div className="absolute top-2/3 w-full h-[1px] bg-white" />
                <div className="absolute left-1/2 h-full w-[1px] bg-white" />
              </div>
              
              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-20">
                  <span className="text-8xl font-black text-white animate-ping-slow drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]">
                    {countdown}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center p-10 space-y-6">
            <div className="w-24 h-24 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-[#10B981]" />
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A1A]">¡Análisis Completado!</h2>
            <p className="text-neutral-600">
              Las tres imágenes han sido procesadas correctamente por nuestro motor de inteligencia artificial.
            </p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="mt-8 bg-[#1A1A1A] text-white font-bold py-4 px-10 rounded-full hover:bg-black transition-colors flex items-center gap-3 mx-auto"
            >
              Ver mis Resultados SkinIQ
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </GlassCard>
    </div>
  );
}
