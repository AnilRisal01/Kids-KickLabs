
import React, { useState, useEffect } from 'react';
import { AppRoute } from '../types';

interface HeroProps {
  onCustomize: () => void;
  onShop: () => void;
}

const LIFESTYLE_IMAGES = [
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1514989940723-e8e51635b782?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1519233923530-97931346048d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'
];

const Hero: React.FC<HeroProps> = ({ onCustomize, onShop }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % LIFESTYLE_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          {/* Slanted divider for desktop */}
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 uppercase tracking-widest mb-8 shadow-sm border border-rose-100">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mr-2"></span>
                Now Delivering Across Nepal 🇳🇵
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-7xl font-kids leading-tight">
                <span className="block xl:inline">Walk with Pride,</span>{' '}
                <span className="block text-rose-600 xl:inline">Step with Culture</span>
              </h1>
              <p className="mt-6 text-base text-gray-500 sm:mt-8 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-8 md:text-xl lg:mx-0 font-medium leading-relaxed">
                Kids KickLabs combines high-performance footwear with the rich heritage of Nepal. From Dhaka patterns to Himalayan motifs, let your little ones wear their identity.
              </p>
              
              <div className="mt-10 sm:mt-12 sm:flex sm:justify-center lg:justify-start gap-5">
                <div className="rounded-2xl shadow-xl shadow-rose-200">
                  <button
                    onClick={onCustomize}
                    className="w-full flex items-center justify-center px-10 py-5 border border-transparent text-lg font-black rounded-2xl text-white bg-rose-600 hover:bg-rose-700 md:py-5 md:text-xl transition-all transform hover:-translate-y-1 active:scale-95"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles mr-3"></i> Design Your Own
                  </button>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={onShop}
                    className="w-full flex items-center justify-center px-10 py-5 border-2 border-gray-100 text-lg font-black rounded-2xl text-gray-900 bg-white hover:bg-gray-50 md:py-5 md:text-xl transition-all active:scale-95"
                  >
                    View Collection
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8 opacity-60">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-earth-asia text-gray-400"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ethically Crafted</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-shield-heart text-gray-400"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Built for Play</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-mountain text-gray-400"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Himalayan Pride</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Dynamic Visual Gallery (Image Only Focus) */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 overflow-hidden h-96 sm:h-[500px] lg:h-full relative shadow-2xl shadow-rose-950/20">
        {LIFESTYLE_IMAGES.map((url, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out transform ${
              idx === currentIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
            }`}
          >
            {/* The Image Layer */}
            <img
              className="w-full h-full object-cover animate-ken-burns"
              src={url}
              alt={`Lifestyle Gallery Frame ${idx + 1}`}
            />
            
            {/* Gradient Overlays for Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent hidden lg:block"></div>

            {/* AI Scan Pulse - Only visible on the active image */}
            {idx === currentIdx && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="scan-wipe absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"></div>
              </div>
            )}
          </div>
        ))}

        {/* Slant Overlay for Mobile Integration */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 to-transparent lg:hidden"></div>

        {/* Minimalist Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-black/10 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/20">
          {LIFESTYLE_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`transition-all duration-500 rounded-full ${
                idx === currentIdx 
                ? 'w-12 h-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)]' 
                : 'w-1 h-1 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Small "Live" Indicator in the corner */}
        <div className="absolute top-8 right-8 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-lg px-3 py-1 rounded-full border border-white/10">
           <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
           <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Visual Lab Feed</span>
        </div>
      </div>

      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.12); }
        }
        .animate-ken-burns {
          animation: ken-burns 15s ease-in-out infinite alternate;
        }
        @keyframes scan-wipe {
          0% { transform: translateX(-100%) skewX(-20deg); }
          20%, 100% { transform: translateX(200%) skewX(-20deg); }
        }
        .scan-wipe {
          animation: scan-wipe 8s linear infinite;
          width: 50%;
        }
      `}</style>
    </div>
  );
};

export default Hero;
