'use client';

import { useState } from 'react';
import { ucamMethodologyData, MethodologySection } from '@/data/ucamMethodology';

type MetodologiaHubProps = {
  onClose: () => void;
};

export default function MetodologiaHub({ onClose }: MetodologiaHubProps) {
  const [selectedItem, setSelectedItem] = useState<MethodologySection>(ucamMethodologyData[0]);

  const categories = ['Introducción', 'Pilares', 'UCAMs', 'MRV', 'Sello', 'Alcances'] as const;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0A0A] text-white flex flex-col animate-in slide-in-from-bottom-8 duration-500 overflow-hidden">
      {/* Header */}
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-surface-hover/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-orange/20 rounded-xl flex items-center justify-center border border-brand-orange/50 text-2xl">
            📖
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-brand-orange to-amber-500 bg-clip-text text-transparent">
              Hub Metodológico UCAM CERT
            </h1>
            <p className="text-sm text-gray-400 font-medium">Base de Conocimiento del Sistema Internacional de Integridad Ambiental</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
        >
          <span>Volver a Auditoría</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-orange/10 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Sidebar Navigation */}
        <aside className="w-80 border-r border-white/10 overflow-y-auto bg-black/40 backdrop-blur-md z-10 relative custom-scrollbar">
          <div className="p-6 space-y-8">
            {categories.map(category => {
              const itemsInCategory = ucamMethodologyData.filter(item => item.category === category);
              if (itemsInCategory.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="text-xs uppercase tracking-widest text-brand-blue font-bold mb-3 pl-2">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {itemsInCategory.map(item => {
                      const isSelected = selectedItem.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                            isSelected 
                              ? 'bg-brand-orange/15 border border-brand-orange/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                              : 'hover:bg-white/5 border border-transparent text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          <span className="text-xl mt-0.5">{item.icon}</span>
                          <div>
                            <p className={`font-semibold text-sm ${isSelected ? 'text-white' : ''}`}>
                              {item.title}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-12 relative z-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300" key={selectedItem.id}>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl">{selectedItem.icon}</span>
              <div>
                <p className="text-brand-orange font-bold tracking-widest uppercase text-sm mb-1">{selectedItem.category}</p>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">{selectedItem.title}</h2>
              </div>
            </div>
            
            <p className="text-xl text-gray-400 font-medium mb-12 border-b border-white/10 pb-8">
              {selectedItem.shortDesc}
            </p>

            <div className="space-y-8">
              {selectedItem.subsections.map((sub, idx) => {
                if (sub.type === 'highlight') {
                  return (
                    <div key={sub.id} className="bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-brand-orange/30 p-8 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange group-hover:w-2 transition-all duration-300" />
                      <h3 className="text-xl font-bold text-white mb-3">{sub.title}</h3>
                      <p className="text-gray-200 text-lg leading-relaxed">{sub.content}</p>
                    </div>
                  );
                }

                if (sub.type === 'alert') {
                  return (
                    <div key={sub.id} className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl flex gap-4 items-start">
                      <span className="text-2xl mt-1">⚠️</span>
                      <div>
                        <h3 className="text-lg font-bold text-amber-500 mb-2">{sub.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{sub.content}</p>
                      </div>
                    </div>
                  );
                }

                if (sub.type === 'list') {
                  const lines = sub.content.split('\n');
                  return (
                    <div key={sub.id} className="bg-surface/50 border border-white/10 p-8 rounded-2xl">
                      <h3 className="text-xl font-bold text-white mb-6">{sub.title}</h3>
                      <ul className="space-y-4">
                        {lines.map((line, i) => (
                          <li key={i} className="flex gap-3 text-gray-300">
                            <span className="text-brand-orange font-bold">•</span>
                            <span className="leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                // Default text
                return (
                  <div key={sub.id} className="bg-surface/30 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-white mb-4">{sub.title}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{sub.content}</p>
                  </div>
                );
              })}
            </div>

          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
