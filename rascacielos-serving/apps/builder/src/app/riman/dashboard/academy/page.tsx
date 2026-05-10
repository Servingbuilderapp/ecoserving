"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, PlayCircle, CheckCircle2, Lock, Star, Sparkles, BookOpen, Clock, Loader2 } from "lucide-react";

// Mock Fallback Data
const MOCK_COURSES = [
  {
    id: "mock1",
    title: "El Arte del Cierre con el Escáner Facial",
    description: "Aprende a convertir un diagnóstico en una venta de First Package sin sonar a vendedor.",
    level: 1,
    video_url: "https://www.youtube.com/embed/EjXU2q_NnPQ?si=yA8rS17f2gq1Kx_",
    duration_mins: 15,
    is_active: true
  },
  {
    id: "mock2",
    title: "Ciencia de Jeju: Centella Asiática Gigante",
    description: "Dominio técnico de los ingredientes patentados de Riman para rebatir objeciones dermatológicas.",
    level: 2,
    video_url: "https://www.youtube.com/embed/EjXU2q_NnPQ?si=yA8rS17f2gq1Kx_",
    duration_mins: 25,
    is_active: true
  },
  {
    id: "mock3",
    title: "Escalamiento de Rangos (De Planner a Director)",
    description: "Estrategias de reclutamiento masivo y liderazgo MLM usando la plataforma Skingif1.",
    level: 3,
    video_url: "https://www.youtube.com/embed/EjXU2q_NnPQ?si=yA8rS17f2gq1Kx_",
    duration_mins: 40,
    is_active: true
  }
];

export default function RimanAcademy() {
  const supabase = createClient();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Progress State
  const [userLevel, setUserLevel] = useState(1);
  const [activeCourse, setActiveCourse] = useState<any | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("academy_courses")
          .select("*")
          .eq("is_active", true)
          .order("level", { ascending: true });

        if (error || !data || data.length === 0) {
          setCourses(MOCK_COURSES);
          setActiveCourse(MOCK_COURSES[0]);
        } else {
          setCourses(data);
          setActiveCourse(data[0]);
        }
      } catch (err) {
        setCourses(MOCK_COURSES);
        setActiveCourse(MOCK_COURSES[0]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [supabase]);

  // Gamification Handler
  const handleMarkAsCompleted = () => {
    if (userLevel < activeCourse.level + 1) {
      setUserLevel(activeCourse.level + 1);
    }
    alert(`¡Felicidades! Has completado: ${activeCourse.title}. Has ganado +150 XP.`);
    // Here we would update 'user_rewards' in Supabase in a real scenario
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
                <BookOpen className="w-6 h-6 text-[#D4AF37]" />
                Skingif1 Academy
              </h1>
              <p className="text-neutral-400 text-sm mt-0.5">Entrenamiento K-Beauty y Liderazgo MLM.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2 border-r border-neutral-800 pr-4">
              <Star className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-bold text-sm">Nivel Actual: {userLevel}</span>
            </div>
            <div className="text-xs text-neutral-400 font-bold">
              1,250 XP
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: MAIN PLAYER */}
        {loading ? (
          <div className="flex-1 flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
          </div>
        ) : (
          <div className="flex-1 space-y-6">
            {activeCourse && (
              <div className="bg-[#111] rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[100px] pointer-events-none" />
                
                {/* Video Player Container */}
                <div className="aspect-video bg-black relative">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={activeCourse.video_url} 
                    title={activeCourse.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-bold uppercase tracking-wider">
                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full border border-[#D4AF37]/20">Módulo {activeCourse.level}</span>
                    <span className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {activeCourse.duration_mins} MIN</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">{activeCourse.title}</h2>
                  <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
                    {activeCourse.description}
                  </p>

                  <button 
                    onClick={handleMarkAsCompleted}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-extrabold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:scale-105 transition-transform flex items-center justify-center gap-2 w-full md:w-auto"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Marcar como Completado (+150 XP)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RIGHT: COURSE PLAYLIST */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-neutral-800 pb-4">
            <Sparkles className="w-5 h-5 text-[#D4AF37]"/> 
            Ruta de Aprendizaje
          </h3>

          <div className="space-y-4">
            {courses.map((course) => {
              const isLocked = course.level > userLevel;
              const isCompleted = course.level < userLevel;
              const isActive = activeCourse?.id === course.id;

              return (
                <button 
                  key={course.id}
                  onClick={() => !isLocked && setActiveCourse(course)}
                  disabled={isLocked}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex gap-4 ${
                    isActive 
                      ? 'bg-neutral-900 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                      : isLocked 
                        ? 'bg-[#0a0a0a] border-neutral-900 opacity-50 cursor-not-allowed' 
                        : 'bg-[#111] border-neutral-800 hover:border-neutral-600 cursor-pointer'
                  }`}
                >
                  <div className="mt-1 shrink-0">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                    ) : isLocked ? (
                      <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-700">
                        <Lock className="w-4 h-4 text-neutral-500" />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isActive ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' : 'bg-neutral-800 border-neutral-700 text-neutral-400'}`}>
                        <PlayCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-[#D4AF37]' : 'text-neutral-500'}`}>Nivel {course.level}</span>
                    </div>
                    <h4 className={`font-bold text-sm leading-tight mb-1 ${isLocked ? 'text-neutral-500' : 'text-white'}`}>
                      {course.title}
                    </h4>
                    <p className="text-xs text-neutral-500 flex items-center gap-1.5"><Clock className="w-3 h-3"/> {course.duration_mins} MIN</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
