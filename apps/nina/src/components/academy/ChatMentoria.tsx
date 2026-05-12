"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "nina" | "user" | "system";
  content: string;
  timestamp: Date;
};

export default function ChatMentoria() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "nina",
      content: "Hola. Soy Nina, tu mentora de integridad. He cargado el estándar UCAM CERT SIIA v1.0 en mi núcleo de procesamiento. ¿En qué sección del estándar o pilar de integridad te gustaría profundizar hoy?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Cargar voces dinámicamente para que no devuelva array vacío en Chrome
  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Escuchar evento de los botones de los 7 pilares
  useEffect(() => {
    const handleFillChat = (e: any) => {
      const text = `Explícame el Pilar ${e.detail.id}: ${e.detail.title}`;
      setInput(text);
      document.getElementById('academy-chat')?.scrollIntoView({ behavior: 'smooth' });
    };
    window.addEventListener('fill-chat', handleFillChat);
    return () => window.removeEventListener('fill-chat', handleFillChat);
  }, []);

  const initSpeechRecognition = () => {
    if (typeof window !== "undefined" && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'es-AR'; // Forzar español de Argentina o genérico
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); // Set in input box just in case
        handleSendVoice(transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error("Mic error:", event.error);
        if (event.error === 'not-allowed') {
          setMicError("Permiso de micrófono denegado.");
        } else if (event.error === 'network') {
          setMicError("Error de red: Chrome no pudo conectar con su servidor de transcripción (revisa tu VPN o conexión).");
        } else {
          setMicError("Error de audio: " + event.error);
        }
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      return recognition;
    }
    setMicError("Tu navegador no soporta reconocimiento de voz nativo.");
    return null;
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      utterance.pitch = 1.4; // Más alto = voz más joven/aguda
      utterance.rate = 1.05; 
      
      const voices = voicesRef.current;
      
      // Filtrar explícitamente voces masculinas conocidas
      const femaleSpanish = voices.filter(v => 
        v.lang.startsWith('es') && 
        !v.name.toLowerCase().includes('pablo') && 
        !v.name.toLowerCase().includes('david') && 
        !v.name.toLowerCase().includes('male')
      );
      
      // Buscar voz argentina o neutra femenina
      const preferredVoice = femaleSpanish.find(v => v.lang === 'es-AR')
                          || femaleSpanish.find(v => v.name.toLowerCase().includes('sabina'))
                          || femaleSpanish.find(v => v.name.toLowerCase().includes('helena'))
                          || femaleSpanish.find(v => v.name.toLowerCase().includes('laura'))
                          || femaleSpanish.find(v => v.name.toLowerCase().includes('mia'))
                          || femaleSpanish.find(v => v.lang === 'es-MX' || v.lang === 'es-US')
                          || femaleSpanish[0] 
                          || voices[0];
                          
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const processResponse = async (userText: string) => {
    const userMessage: Message = {
      role: "user",
      content: userText,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/academy/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      const responseContent = data.response || "Error: " + data.error;

      const ninaMessage: Message = {
        role: "nina",
        content: responseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, ninaMessage]);
      setIsLoading(false);
      speak(responseContent);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        role: "nina",
        content: "Hubo un error de conexión con mi núcleo. Por favor, inténtalo de nuevo.",
        timestamp: new Date()
      }]);
      setIsLoading(false);
    }
  };

  const handleSendVoice = (transcript: string) => {
    if (!transcript.trim() || isLoading) return;
    processResponse(transcript);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    processResponse(input);
  };

  const toggleVoice = () => {
    setMicError(null);
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setInput("");
      // Siempre recreamos la instancia para evitar estados "colgados"
      recognitionRef.current = initSpeechRecognition();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error("Error al iniciar grabación:", e);
          setIsListening(false);
        }
      }
    }
  };

  const clearHistory = () => {
    setMessages([{
      role: "nina",
      content: "Historial limpiado. ¿En qué más puedo ayudarte con el estándar UCAM CERT?",
      timestamp: new Date()
    }]);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <section id="academy-chat" className="max-w-5xl mx-auto my-12 p-1 rounded-3xl bg-gradient-to-b from-brand-blue/20 to-brand-orange/20 shadow-2xl">
      <div className="bg-surface rounded-[calc(1.5rem-1px)] overflow-hidden flex flex-col h-[700px]">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-blue shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              <Image src="/nina.jpeg" alt="Nina" fill className="object-cover" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-white">Nina • Mentoría IA</h3>
              <p className="text-xs text-brand-blue font-medium flex items-center gap-1">
                <span className="w-1 h-1 bg-brand-blue rounded-full animate-pulse"></span>
                Ingesta UCAM CERT v1.0 Activa
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={clearHistory} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors" title="Limpiar historial">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[80%] space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand-orange/10 border border-brand-orange/20 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-gray-100 rounded-tl-none'
                }`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-invert prose-sm max-w-none"
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Voice Visualization (Active when listening) */}
        {isListening && (
          <div className="px-6 py-2 bg-brand-blue/5 border-t border-brand-blue/10 flex items-center justify-center gap-2 overflow-hidden h-12">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-brand-blue rounded-full" 
                style={{ 
                  height: `${20 + Math.random() * 80}%`,
                  opacity: 0.5 + Math.random() * 0.5
                }}
              ></div>
            ))}
            <span className="text-xs text-brand-blue font-mono ml-2 animate-pulse">Escuchando...</span>
          </div>
        )}

        {/* Errors */}
        {micError && (
          <div className="px-6 py-2 bg-red-500/10 border-t border-red-500/20 text-red-400 text-xs text-center">
            {micError}
          </div>
        )}

        {/* Chat Input */}
        <div className="p-6 border-t border-white/5 bg-white/5">
          <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta sobre el estándar UCAM CERT..."
                className="w-full bg-surface-hover border border-white/10 rounded-2xl py-4 pl-6 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-blue transition-all"
              />
              <button 
                type="button"
                onClick={toggleVoice}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                  isListening ? 'bg-brand-blue text-white shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'text-gray-400 hover:text-brand-blue'
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-4 bg-brand-blue text-white rounded-2xl hover:bg-brand-blue-dark disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-brand-blue/20"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
