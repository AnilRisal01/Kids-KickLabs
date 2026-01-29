
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { NEPALI_THEMES } from '../constants';

interface CustomizerProps {
  onAddToCart: (design: { prompt: string; imageUrl: string }) => void;
}

const MATERIALS = [
  { id: 'leather', name: 'Premium Leather', icon: 'fa-cow', desc: 'Durable & Classic' },
  { id: 'mesh', name: 'Technical Mesh', icon: 'fa-network-wired', desc: 'Breathable & Light' },
  { id: 'suede', name: 'Soft Suede', icon: 'fa-scroll', desc: 'Tactile & Stylish' },
  { id: 'canvas', name: 'Organic Canvas', icon: 'fa-mattress-pillow', desc: 'Natural & Rugged' },
];

const LACE_STYLES = [
  { id: 'flat', name: 'Classic Flat', icon: 'fa-window-minimize' },
  { id: 'round', name: 'Sport Round', icon: 'fa-circle' },
  { id: 'braided', name: 'Braided Rope', icon: 'fa-braille' },
];

const LACE_COLORS = [
  { id: 'white', name: 'Cloud White', hex: 'bg-white border-gray-200' },
  { id: 'crimson', name: 'Rhododendron Crimson', hex: 'bg-rose-600' },
  { id: 'sky', name: 'Himalayan Sky', hex: 'bg-sky-400' },
  { id: 'gold', name: 'Temple Gold', hex: 'bg-amber-400' },
  { id: 'forest', name: 'Deep Forest', hex: 'bg-emerald-800' },
  { id: 'obsidian', name: 'Obsidian Black', hex: 'bg-gray-900' },
];

const Customizer: React.FC<CustomizerProps> = ({ onAddToCart }) => {
  const [prompt, setPrompt] = useState('');
  const [material, setMaterial] = useState('mesh');
  const [laceStyle, setLaceStyle] = useState('flat');
  const [laceColor, setLaceColor] = useState('white');
  const [isGenerating, setIsGenerating] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  // Interactive 3D Viewer States
  const [rotation, setRotation] = useState({ x: 15, y: -30 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const gemini = GeminiService.getInstance();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    setRotation(prev => ({
      x: Math.min(Math.max(prev.x - deltaY * 0.4, -45), 45),
      y: prev.y + deltaX * 0.4
    }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.001, 0.5), 2.5));
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setAuthRequired(false);
    setGenerationStep('Initializing Engine...');
    
    try {
      const selectedMat = MATERIALS.find(m => m.id === material)?.name || 'Technical Mesh';
      const selectedLaceStyle = LACE_STYLES.find(l => l.id === laceStyle)?.name || 'Flat';
      const selectedLaceColor = LACE_COLORS.find(c => c.id === laceColor)?.name || 'White';
      
      const enrichedPrompt = `${prompt}. The shoe features ${selectedLaceStyle} laces in a vibrant ${selectedLaceColor} color, ${selectedMat} upper.`;
      
      const steps = ['Optical Pass...', 'Raytracing Surfaces...', 'Finalizing 3D Render...'];
      let stepIdx = 0;
      const stepTimer = setInterval(() => {
        if (stepIdx < steps.length) {
          setGenerationStep(steps[stepIdx]);
          stepIdx++;
        }
      }, 3000);

      const url = await gemini.generateShoeDesign(enrichedPrompt, "1:1", selectedMat);
      clearInterval(stepTimer);
      
      if (url) {
        setResultImage(url);
        setRotation({ x: 15, y: -30 });
      }
    } catch (error: any) {
      if (error.message === 'AUTH_REQUIRED') {
        setAuthRequired(true);
      } else {
        alert("Design synthesis failed. Please try again.");
      }
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleAuth = async () => {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      setAuthRequired(false);
    }
  };

  const addThemeToPrompt = (themeName: string) => {
    setPrompt(prev => prev.includes(themeName) ? prev : (prev ? `${prev}, ${themeName}` : themeName));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 animate-in fade-in duration-700">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 rounded-full mb-4 border border-rose-100">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">3D Digital Workshop</span>
        </div>
        <h2 className="text-5xl font-kids font-bold text-gray-900 mb-4 tracking-tight">The <span className="text-rose-600">Workshop</span></h2>
        <p className="text-gray-500 max-w-2xl text-lg font-medium leading-relaxed">
          Craft heritage-inspired kicks with our high-fidelity 3D render engine. Drag to inspect your creation from any angle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Configurator */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-rose-500"></i> Cultural Library
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {NEPALI_THEMES.map(theme => (
                <button
                  key={theme.name}
                  onClick={() => addThemeToPrompt(theme.name)}
                  className="group relative p-4 rounded-3xl bg-gray-50 flex flex-col items-center justify-center transition-all hover:ring-2 hover:ring-rose-500 shadow-sm active:scale-95"
                >
                  <div className={`w-12 h-12 rounded-2xl ${theme.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <i className={`fa-solid ${theme.icon} text-white text-xl`}></i>
                  </div>
                  <span className="text-[10px] font-black text-gray-700 text-center uppercase tracking-tighter">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <i className="fa-solid fa-lines-leaning text-rose-500"></i> Detail Finishes
            </h3>
            <div className="flex gap-2 mb-4">
              {LACE_STYLES.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setLaceStyle(s.id)}
                  className={`flex-1 p-3 rounded-2xl border text-[10px] font-black uppercase transition-all ${
                    laceStyle === s.id ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-gray-50 text-gray-400'
                  }`}
                >
                  {s.name.split(' ')[1]}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {LACE_COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setLaceColor(c.id)}
                  className={`w-10 h-10 rounded-full ${c.hex} transition-all ${laceColor === c.id ? 'ring-4 ring-rose-600 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                />
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Design Prompt</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Dhaka pattern trim', 'Gold leaf mountain silhouette'..."
              className="w-full px-6 py-5 rounded-3xl bg-gray-50 border-none focus:ring-2 focus:ring-rose-500 h-32 text-sm font-medium resize-none shadow-inner"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className={`w-full mt-6 py-6 rounded-3xl font-black text-white transition-all shadow-xl ${
                isGenerating ? 'bg-gray-200 text-gray-400' : 'bg-rose-600 hover:bg-rose-700 active:scale-95'
              }`}
            >
              {isGenerating ? 'GENERATING RENDER...' : 'INITIALIZE RENDER'}
            </button>
          </div>
        </div>

        {/* Right Column: True 3D Stage */}
        <div className="lg:col-span-7 sticky top-28" style={{ perspective: '1200px' }}>
          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className="relative aspect-square bg-[#0a0a0a] rounded-[48px] shadow-2xl overflow-hidden border-8 border-white cursor-grab active:cursor-grabbing transform-gpu"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Ambient Lighting & Lens Flare */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Perspective Grid Floor */}
            <div className="absolute inset-0 z-0 pointer-events-none" style={{ transform: 'translateZ(-100px)' }}>
              <div 
                 className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[100%] border-t border-white/5"
                 style={{ 
                   background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(0deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                   backgroundSize: '40px 40px',
                   transform: 'rotateX(80deg) translateY(300px)',
                   transformOrigin: 'bottom'
                 }}
              ></div>
            </div>

            {/* Render Output with Real 3D Transform */}
            <div 
              className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out will-change-transform"
              style={{
                transform: `translateZ(50px) scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {resultImage ? (
                <div className="relative w-[80%] h-[80%]">
                   {/* Dynamic Shadow */}
                  <div 
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-black/60 blur-2xl rounded-full"
                    style={{ transform: 'rotateX(90deg) translateZ(-50px)' }}
                  ></div>
                  
                  <div className="relative w-full h-full shadow-[0_50px_100px_rgba(0,0,0,0.9)] rounded-[40px] overflow-hidden border border-white/10 group">
                    <img src={resultImage} className="w-full h-full object-cover" alt="Rendered Model" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50"></div>
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-10 group">
                  <i className="fa-solid fa-shoe-prints text-9xl text-white mb-6 group-hover:scale-110 transition-transform"></i>
                  <p className="text-white font-black text-xs tracking-[1em] uppercase">Stage Initialized</p>
                </div>
              )}
            </div>

            {/* Recovery HUD for Authorization */}
            {authRequired && (
              <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-rose-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-rose-900/50">
                   <i className="fa-solid fa-key text-white text-3xl"></i>
                </div>
                <h4 className="text-2xl font-black text-white mb-4">Authorization Required</h4>
                <p className="text-gray-400 text-sm mb-8 max-w-xs font-medium">To use the AI synthesis engine, please select a project API key.</p>
                <button 
                  onClick={handleAuth}
                  className="bg-white text-gray-900 px-10 py-4 rounded-2xl font-black text-sm hover:bg-rose-600 hover:text-white transition-all active:scale-95 shadow-xl"
                >
                  Select API Key
                </button>
                <p className="mt-6 text-[10px] text-gray-600 uppercase font-bold tracking-widest">A paid GCP project is required.</p>
              </div>
            )}

            {/* HUD Loading Overlay */}
            {isGenerating && (
              <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-rose-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-rose-500 font-black tracking-widest uppercase text-xs animate-pulse">{generationStep}</p>
              </div>
            )}
          </div>

          {resultImage && !isGenerating && (
            <div className="mt-8 flex justify-between items-center bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl animate-in slide-in-from-bottom-4 duration-500">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Workshop Final Price</p>
                <h4 className="text-2xl font-black text-rose-600">NPR 6,500</h4>
              </div>
              <button 
                onClick={() => onAddToCart({ prompt, imageUrl: resultImage })}
                className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-rose-600 transition-all flex items-center gap-3 active:scale-95 shadow-lg shadow-gray-200"
              >
                <i className="fa-solid fa-bag-shopping"></i> Finish & Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customizer;
