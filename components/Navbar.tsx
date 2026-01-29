
import React from 'react';
import { AppRoute } from '../types';

interface NavbarProps {
  currentRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentRoute, setRoute, cartCount }) => {
  const navItems = [
    { label: 'Home', route: AppRoute.HOME, icon: 'fa-house' },
    { label: 'Shop', route: AppRoute.SHOP, icon: 'fa-bag-shopping' },
    { label: 'Design', route: AppRoute.CUSTOMIZE, icon: 'fa-wand-magic-sparkles' },
    { label: 'Restore', route: AppRoute.RESTORATION, icon: 'fa-broom-ball' },
  ];

  const secondaryItems = [
    { label: 'About', route: AppRoute.ABOUT },
    { label: 'Contact', route: AppRoute.CONTACT },
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div 
            className="flex items-center cursor-pointer group shrink-0"
            onClick={() => setRoute(AppRoute.HOME)}
          >
            <div className="bg-rose-600 p-2 rounded-xl mr-3 group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-rose-200">
              <i className="fa-solid fa-shoe-prints text-white text-2xl"></i>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-kids font-bold text-gray-900 tracking-tight leading-none">Kids <span className="text-rose-600">KickLabs</span></h1>
              <p className="text-[9px] uppercase tracking-widest text-gray-400 font-black mt-1">Heritage Footwear</p>
            </div>
          </div>

          {/* Primary Navigation with Icons */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6">
            <div className="flex items-center bg-gray-50/50 p-1 rounded-2xl border border-gray-100">
              {navItems.map((item) => (
                <button
                  key={item.route}
                  onClick={() => setRoute(item.route)}
                  className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ${
                    currentRoute === item.route 
                      ? 'bg-white text-rose-600 shadow-sm ring-1 ring-gray-100' 
                      : 'text-gray-400 hover:text-rose-500 hover:bg-white/50'
                  }`}
                >
                  <i className={`fa-solid ${item.icon} text-sm sm:text-base`}></i>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-tight sm:tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="hidden xl:flex items-center space-x-4 border-l border-gray-100 pl-6 ml-2">
              {secondaryItems.map((item) => (
                <button
                  key={item.route}
                  onClick={() => setRoute(item.route)}
                  className={`text-xs font-black uppercase tracking-widest transition-colors ${
                    currentRoute === item.route ? 'text-rose-600' : 'text-gray-400 hover:text-rose-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block"></div>

            {/* Cart Button prominently displayed with Count */}
            <button 
              onClick={() => setRoute(AppRoute.CART)}
              className={`relative p-3.5 rounded-2xl transition-all duration-300 ${
                currentRoute === AppRoute.CART 
                ? 'bg-rose-600 text-white shadow-xl shadow-rose-200 scale-105' 
                : 'bg-gray-900 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-100 shadow-md'
              }`}
            >
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              {cartCount > 0 && (
                <span className={`absolute -top-2 -right-2 text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-2 font-black animate-in zoom-in duration-300 ${
                  currentRoute === AppRoute.CART ? 'bg-white text-rose-600 border-rose-600' : 'bg-rose-500 text-white border-white'
                }`}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
