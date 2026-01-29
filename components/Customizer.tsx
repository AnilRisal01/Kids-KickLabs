
import React, { useState, useRef, useMemo } from 'react';
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
  { id: 'knit', name: 'Performance Knit', icon: 'fa-socks', desc: 'Sock-like Fit' },
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
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [size, setSize] = useState('1K');
  
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.001, 0.5), 2.5));
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const selectedMat = MATERIALS.find(m => m.id === material)?.name || 'Technical Mesh';
      const selectedLaceStyle = LACE_STYLES.find(l => l.id === laceStyle)?.name || 'Flat';
      const selectedLaceColor = LACE_COLORS.find(c => c.id === laceColor)?.name || 'White';
      
      const enrichedPrompt = `${prompt}. The shoe features ${selectedLaceStyle} laces in a vibrant ${selectedLaceColor} color.`;
      
      const url = await gemini.generateShoeDesign(enrichedPrompt, aspectRatio, size, selectedMat);
      if (url) {
        setResultImage(url);
        setRotation({ x: 15, y: -30 });
      }
    } catch (error: any) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addThemeToPrompt = (themeName: string) => {
    setPrompt(prev => {
      if (prev.includes(themeName)) return prev;
      return prev ? `${prev}, ${themeName}` : themeName;
    });
  };

  const resetView = () => {
    setRotation({ x: 15, y: -30 });
    setZoom(1);
  };

  // Calculate dynamic lighting opacity based on rotation
  const rimLightOpacity = Math.abs(rotation.y % 180) / 180;
  const specularPos = (rotation.y % 360);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 animate-in fade-in duration-700">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 rounded-full mb-4 border border-rose-100 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Next-Gen Material Configurator</span>
        </div>
        <h2 className="text-5xl font-kids font-bold text-gray-900 mb-4 tracking-tight">The <span className="text-rose-600">Workshop</span></h2>
        <p className="text-gray-500 max-w-2xl text-lg font-medium">
          Mix cultural heritage with precision materials. Describe your vision, select premium textures, and watch your design come to life in the 3D CAD stage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Designer Controls */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Theme Selection */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-rose-500"></i> Cultural Motif Library
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {NEPALI_THEMES.map(theme => (
                <button
                  key={theme.name}
                  onClick={() => addThemeToPrompt(theme.name)}
                  className="group relative p-4 rounded-3xl bg-gray-50 flex flex-col items-center justify-center transition-all hover:ring-2 hover:ring-rose-500 hover:shadow-xl active:scale-95"
                >
                  <div className={`w-12 h-12 rounded-2xl ${theme.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                    <i className={`fa-solid ${theme.icon} text-white text-xl`}></i>
                  </div>
                  <span className="text-[10px] font-black text-gray-700 text-center uppercase tracking-tighter leading-none">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Material Selection */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <i className="fa-solid fa-mitten text-rose-500"></i> Material Properties
            </h3>
            <div className="space-y-3">
              {MATERIALS.map(mat => (
                <button
                  key={mat.id}
                  onClick={() => setMaterial(mat.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-3xl border transition-all ${
                    material === mat.id 
                    ? 'border-rose-600 bg-rose-50/50 ring-1 ring-rose-600' 
                    : 'border-gray-100 bg-white hover:border-rose-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    material === mat.id ? 'bg-rose-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <i className={`fa-solid ${mat.icon} text-xl`}></i>
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-black text-sm ${material === mat.id ? 'text-rose-700' : 'text-gray-900'}`}>{mat.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{mat.desc}</p>
                  </div>
                  {material === mat.id && (
                    <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Lace Selection */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <i className="fa-solid fa-lines-leaning text-rose-500"></i> Lace Configuration
            </h3>
            
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Style</p>
            <div className="flex gap-3 mb-6">
              {LACE_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setLaceStyle(style.id)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-3xl border transition-all ${
                    laceStyle === style.id 
                    ? 'border-rose-600 bg-rose-50/50 ring-1 ring-rose-600' 
                    : 'border-gray-100 bg-white hover:border-rose-200'
                  }`}
                >
                  <i className={`fa-solid ${style.icon} ${laceStyle === style.id ? 'text-rose-600' : 'text-gray-300'}`}></i>
                  <span className={`text-[9px] font-black uppercase ${laceStyle === style.id ? 'text-rose-600' : 'text-gray-400'}`}>
                    {style.name.split(' ')[1]}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Color Palette</p>
            <div className="flex flex-wrap gap-3">
              {LACE_COLORS.map(color => (
                <button
                  key={color.id}
                  onClick={() => setLaceColor(color.id)}
                  title={color.name}
                  className={`w-10 h-10 rounded-full ${color.hex} transition-all transform hover:scale-110 active:scale-90 ${
                    laceColor === color.id ? 'ring-4 ring-rose-600 ring-offset-2 scale-110' : 'hover:ring-2 hover:ring-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Prompt Engine */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-terminal text-rose-500"></i> AI Design Prompt
            </h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your masterpiece (e.g., 'A sky blue sneaker with golden lali guras flowers on the side')..."
              className="w-full px-6 py-5 rounded-3xl bg-gray-50 border-none focus:ring-2 focus:ring-rose-500 transition-all h-40 text-sm font-medium placeholder:text-gray-300 shadow-inner resize-none"
            />
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className={`w-full mt-8 py-6 rounded-3xl font-black text-white transition-all flex items-center justify-center gap-4 shadow-2xl ${
                isGenerating 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 bg-rose-400 rounded-full animate-bounce"></span>
                    <span className="w-2.5 h-2.5 bg-rose-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2.5 h-2.5 bg-rose-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                  <span className="text-sm">Synthesizing Materials...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>
                  <span>Compile Design</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: 3D CAD MODEL VIEWER */}
        <div className="lg:col-span-7 sticky top-28">
          <div className="relative group">
            
            {/* Viewer HUD Info */}
            <div className="absolute top-8 left-8 z-20 pointer-events-none space-y-2">
              <div className="bg-slate-900/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-2xl">
                <p className="text-[8px] font-black text-sky-400 uppercase tracking-widest mb-1">Active Config</p>
                <p className="text-[11px] font-black text-white uppercase tracking-tight">
                  {MATERIALS.find(m => m.id === material)?.name} • {LACE_COLORS.find(c => c.id === laceColor)?.name}
                </p>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] font-bold text-white uppercase">FPS: 60.0 | HDR Active</p>
              </div>
            </div>

            {/* Viewer Camera Controls */}
            <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
              <button 
                onClick={resetView}
                className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-rose-600 transition-all shadow-xl border border-white/20"
                title="Reset Camera"
              >
                <i className="fa-solid fa-video"></i>
              </button>
              <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl shadow-xl border border-white/20 flex flex-col gap-4 items-center">
                <i className="fa-solid fa-plus text-[10px] text-white/40"></i>
                <input 
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="vertical-range w-1.5 h-36 appearance-none bg-white/20 rounded-full accent-rose-500 cursor-pointer"
                />
                <i className="fa-solid fa-minus text-[10px] text-white/40"></i>
              </div>
            </div>

            {/* Main Stage */}
            <div 
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              className="relative aspect-square bg-[#050505] rounded-[48px] shadow-2xl overflow-hidden border-8 border-white cursor-grab active:cursor-grabbing preserve-3d perspective-2000"
            >
              {/* Perspective Grid Floor */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_85%)]"></div>
                <div 
                   className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[250%] h-[150%] border-t border-rose-500/10"
                   style={{ 
                     background: 'linear-gradient(90deg, rgba(225, 29, 72, 0.05) 1px, transparent 1px), linear-gradient(0deg, rgba(225, 29, 72, 0.05) 1px, transparent 1px)',
                     backgroundSize: '40px 40px',
                     transform: 'rotateX(75deg) translateY(300px)',
                     transformOrigin: 'bottom'
                   }}
                ></div>
                
                {/* Volumetric Spotlights */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(225,29,72,0.1)_0%,transparent_50%)]"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(14,165,233,0.1)_0%,transparent_50%)]"></div>
              </div>

              {/* Shoe Object View */}
              <div 
                className="w-full h-full transition-transform duration-150 ease-out flex items-center justify-center"
                style={{
                  transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {resultImage ? (
                  <div 
                    className="relative w-[80%] h-[80%] transition-all"
                    style={{ transform: 'translateZ(100px)' }}
                  >
                    {/* Shadow Plate */}
                    <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[60%] h-12 bg-black/60 blur-3xl rounded-[100%] transform -rotateX(90deg) translateZ(-80px)"></div>
                    
                    {/* The Rendered Shoe */}
                    <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 ring-1 ring-white/5">
                       <img 
                        src={resultImage} 
                        alt="AI Shoe Model" 
                        className="w-full h-full object-cover select-none pointer-events-none" 
                      />
                      
                      {/* Realistic Light Overlays - Dynamic Specular Highlight */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/20 pointer-events-none transition-opacity duration-300"
                        style={{ opacity: rimLightOpacity + 0.2 }}
                      ></div>
                      
                      {/* Specular Shine that moves with rotation */}
                      <div 
                        className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"
                        style={{ 
                          transform: `translateX(${(specularPos / 360) * 100}%) translateY(${(rotation.x / 45) * 50}%)`,
                          mixBlendMode: 'overlay'
                        }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none text-center">
                     <div className="relative w-56 h-56 mb-8">
                       <div className="absolute inset-0 bg-rose-500/10 rounded-full animate-pulse blur-3xl"></div>
                       <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/10 animate-spin-slow"></div>
                       <div className="absolute inset-6 bg-slate-900/80 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                         <i className="fa-solid fa-microchip text-7xl text-rose-600/30"></i>
                       </div>
                     </div>
                     <h3 className="text-3xl font-kids font-bold text-white/30 tracking-widest uppercase">PBR Render Engine</h3>
                     <p className="text-white/20 mt-2 font-black text-[10px] tracking-[0.4em]">CONFIGURE MATERIALS TO INITIALIZE PHOTON MAPPING</p>
                  </div>
                )}
              </div>

              {/* Scanning / Loading HUD */}
              {isGenerating && (
                <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden">
                  <div className="scanner-line absolute top-0 left-0 w-full h-1.5 bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,1)] z-50"></div>
                  <div className="relative text-center">
                    <div className="w-24 h-24 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-spin mx-auto mb-10 shadow-[0_0_50px_rgba(244,63,94,0.3)]"></div>
                    <p className="text-rose-500 font-black uppercase tracking-[0.8em] text-sm mb-2">Compiling Textures</p>
                    <div className="flex justify-center gap-1.5">
                      {['MAPPING', 'SHADING', 'RENDER'].map((task, i) => (
                        <span key={task} className={`text-[8px] font-black px-2 py-1 rounded bg-white/5 text-white/40 ${i === 1 ? 'animate-pulse' : ''}`}>
                          {task}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Final Actions Block */}
            {resultImage && !isGenerating && (
              <div className="mt-10 bg-white p-8 rounded-[40px] border border-gray-100 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8 animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-10">
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Configuration Price</p>
                    <p className="text-4xl font-black text-rose-600">NPR 6,500</p>
                  </div>
                  <div className="h-14 w-px bg-gray-100 hidden sm:block"></div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                       <i className="fa-solid fa-shield-check text-emerald-500 text-xs"></i>
                       <p className="text-[10px] font-black text-gray-900 uppercase">Premium QA Check</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <i className="fa-solid fa-box-open text-sky-500 text-xs"></i>
                       <p className="text-[10px] font-black text-gray-900 uppercase">Artisanal Packaging</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => onAddToCart({ prompt, imageUrl: resultImage })}
                  className="w-full sm:w-auto bg-gray-900 text-white px-12 py-5 rounded-3xl font-black text-sm hover:bg-rose-600 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-bag-shopping text-lg"></i> Checkout Design
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .perspective-2000 {
          perspective: 2000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        input[type=range].vertical-range {
          writing-mode: vertical-lr;
          direction: rtl;
          width: 8px;
          padding: 0 5px;
        }
        .animate-spin-slow {
          animation: spin 15s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .scanner-line {
          animation: scan 2.5s ease-in-out infinite;
        }
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          50% { top: 100%; }
          90% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Customizer;
