"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Users2, Calendar, MessageSquare, Heart, Share2, Star, CalendarDays, Video, ShieldCheck, Loader2, ImagePlus } from "lucide-react";

// Mock Data Fallback
const MOCK_POSTS = [
  {
    id: "mock1",
    author_name: "María Fernández",
    author_role: "Director Skingif1",
    timeAgo: "Hace 2 horas",
    content: "¡Chicos! El método Boo-Se-Boo es magia pura. Miren el resultado de mi clienta después de 14 días con el First Package y el Active Clean-Up Powder. ¡Cerré la venta de reposición hoy mismo!",
    image_url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
    likes: 24,
    comments: 5
  },
  {
    id: "mock2",
    author_name: "Carlos Restrepo",
    author_role: "Pionero Avanzado",
    timeAgo: "Hace 5 horas",
    content: "Acabo de terminar el Nivel 2 de la Academia. Entender la ciencia detrás de la Centella Asiática Gigante me dio toda la seguridad para rebatir objeciones de precio. ¡Vamos por ese rango!",
    image_url: null,
    likes: 42,
    comments: 12
  }
];

const upcomingEvents = [
  { id: 1, date: "15 NOV", title: "Masterclass: Cierre de Ventas con IA", speaker: "Gonzalo & Equipo", type: "Zoom en Vivo", time: "8:00 PM (COT)" },
  { id: 2, date: "18 NOV", title: "Ciencia de Jeju: Profundización", speaker: "Dra. Especialista RIMAN", type: "Entrenamiento", time: "7:30 PM (COT)" }
];

export default function CommunityPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [supabase]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setPosts(MOCK_POSTS); // Fallback to mock if table is empty or unconfigured
      } else {
        // Formatear la fecha para mostrar "timeAgo" aproximado (simplificado)
        const formattedData = data.map(post => ({
          ...post,
          timeAgo: new Date(post.created_at).toLocaleDateString(),
          comments: Math.floor(Math.random() * 10) // Mock comments for now
        }));
        setPosts(formattedData);
      }
    } catch (err) {
      setPosts(MOCK_POSTS);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Modo Demo: Insertar localmente en el state si no hay sesión real
        const demoPost = {
          id: Date.now().toString(),
          author_name: "Administrador Skingif1",
          author_role: "Demo Mode",
          timeAgo: "Ahora mismo",
          content: newPostContent,
          image_url: null,
          likes: 0,
          comments: 0
        };
        setPosts([demoPost, ...posts]);
        setNewPostContent("");
        setIsSubmitting(false);
        return;
      }

      // Obtener nombre del planner real
      const { data: plannerInfo } = await supabase
        .from("sucursales_planners")
        .select("nombre_completo")
        .eq("user_id", user.id)
        .single();

      // Insertar en Supabase
      const { error } = await supabase.from('community_posts').insert({
        author_id: user.id,
        author_name: plannerInfo?.nombre_completo || "Socio Riman",
        content: newPostContent
      });

      if (!error) {
        setNewPostContent("");
        fetchPosts(); // Recargar el feed
      }
    } catch (err) {
      console.error(err);
      alert("Error al publicar en modo demo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white pb-24 selection:bg-[#D4AF37] selection:text-black">
      
      {/* HEADER */}
      <div className="bg-[#111] border-b border-neutral-800 px-4 sm:px-6 lg:px-8 py-6 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/riman/dashboard" className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users2 className="w-6 h-6 text-[#8b5cf6]" />
                Comunidad Skingif1
              </h1>
              <p className="text-neutral-400 text-sm mt-0.5">Testimonios Reales y Eventos Oficiales.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* MAIN COLUMN (FEED) */}
        <div className="flex-1 space-y-6">
          
          {/* Create Post Input */}
          <div className="bg-[#111] rounded-3xl p-6 border border-neutral-800 shadow-xl flex gap-4">
            <div className="w-12 h-12 bg-neutral-800 rounded-full border border-neutral-700 overflow-hidden shrink-0">
               <img src="https://api.dicebear.com/7.x/notionists/svg?seed=current" alt="Avatar" className="w-full h-full object-cover bg-neutral-200" />
            </div>
            <div className="flex-1">
              <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Comparte un testimonio, logro o pregunta con la red..." 
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition-colors resize-none h-24"
              />
              <div className="flex justify-between items-center mt-3">
                <button className="text-neutral-400 hover:text-[#8b5cf6] text-sm font-bold flex items-center gap-2 transition-colors">
                  <ImagePlus className="w-4 h-4" /> Subir Foto de Resultados
                </button>
                <button 
                  onClick={handleCreatePost}
                  disabled={isSubmitting || !newPostContent.trim()}
                  className="bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white font-bold px-6 py-2 rounded-xl text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publicar"}
                </button>
              </div>
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-[#8b5cf6] animate-spin" /></div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-[#111] rounded-3xl p-6 border border-neutral-800 shadow-xl">
                  {/* Post Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3 items-center">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.author_name}`} alt={post.author_name} className="w-12 h-12 rounded-full border border-neutral-700 bg-neutral-200" />
                      <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                          {post.author_name} 
                          {post.author_role?.includes("Director") && <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />}
                        </h3>
                        <p className="text-xs text-[#8b5cf6]">{post.author_role || 'Socio Skingif1'} • <span className="text-neutral-500">{post.timeAgo}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-neutral-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
                  
                  {post.image_url && (
                    <div className="mb-4 rounded-2xl overflow-hidden border border-neutral-800 bg-black">
                      <img src={post.image_url} alt="Testimonio" className="w-full max-h-96 object-cover opacity-90 hover:opacity-100 transition-opacity" />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center gap-6 pt-4 border-t border-neutral-800">
                    <button className="flex items-center gap-2 text-neutral-400 hover:text-red-500 transition-colors text-sm font-bold">
                      <Heart className="w-5 h-5" /> {post.likes || 0}
                    </button>
                    <button className="flex items-center gap-2 text-neutral-400 hover:text-blue-500 transition-colors text-sm font-bold">
                      <MessageSquare className="w-5 h-5" /> {post.comments || 0}
                    </button>
                    <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-bold ml-auto">
                      <Share2 className="w-5 h-5" /> Compartir en WhatsApp
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SIDEBAR (CALENDAR) */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] rounded-3xl p-6 border border-neutral-800 shadow-xl sticky top-28">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-neutral-800 pb-4">
              <CalendarDays className="w-5 h-5 text-[#10b981]" /> 
              Eventos Oficiales
            </h2>
            
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex gap-4 group cursor-pointer">
                  <div className="flex flex-col items-center justify-center bg-neutral-900 border border-neutral-800 rounded-xl p-3 min-w-[60px] group-hover:border-[#10b981] transition-colors">
                    <span className="text-xs text-neutral-400 font-bold uppercase">{event.date.split(' ')[1]}</span>
                    <span className="text-xl font-black text-white">{event.date.split(' ')[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-[#10b981] transition-colors line-clamp-2 leading-tight mb-1">{event.title}</h3>
                    <p className="text-xs text-neutral-500 mb-1">{event.speaker}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#10b981]">
                      <Video className="w-3 h-3" /> {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-neutral-900 border border-neutral-700 text-white font-bold py-3 rounded-xl hover:bg-neutral-800 transition-colors text-sm">
              Sincronizar con Google Calendar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
