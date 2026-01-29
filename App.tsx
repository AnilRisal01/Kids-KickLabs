
import React, { useState, useEffect, useMemo } from 'react';
import { AppRoute, Product, CartItem } from './types';
import { MOCK_PRODUCTS } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Customizer from './components/Customizer';
import ChatBot from './components/ChatBot';
import Restoration from './components/Restoration';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onCustomize: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onCustomize }) => {
  const isCustom = product.category === 'customizable';

  return (
    <div className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col">
      <div 
        className={`aspect-square overflow-hidden bg-gray-50 relative ${isCustom ? 'cursor-pointer' : ''}`}
        onClick={() => isCustom && onCustomize()}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
        />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-rose-600 shadow-sm border border-gray-100">
            <i className="fa-regular fa-heart"></i>
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-sky-600 shadow-sm border border-gray-100">
            <i className="fa-solid fa-share-nodes"></i>
          </button>
        </div>

        {isCustom && (
          <div className="absolute inset-0 bg-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
            <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl font-bold text-sm text-rose-600 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all">
              <i className="fa-solid fa-sparkles mr-2"></i> Design Your Own
            </div>
          </div>
        )}
      </div>
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">{product.brand}</span>
        <h3 className="text-lg font-black text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-gray-400 text-xs mt-2 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mb-8">
          {product.tags.map(tag => (
            <span key={tag} className="text-[10px] font-bold bg-gray-50 text-gray-400 px-2.5 py-1 rounded-lg border border-gray-100/50">{tag}</span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          {!isCustom ? (
            <>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Price</span>
                <span className="text-xl font-black text-rose-600">NPR {product.price.toLocaleString()}</span>
              </div>
              <button 
                onClick={() => onAddToCart(product)}
                className="bg-gray-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-rose-600 transition-all active:scale-90 shadow-lg shadow-gray-100"
                title="Quick Add"
              >
                <i className="fa-solid fa-plus text-lg"></i>
              </button>
            </>
          ) : (
            <button 
              onClick={() => onCustomize()}
              className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-sm hover:bg-rose-700 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-rose-50"
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i> Design Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  
  // Filters State
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriceMax, setFilterPriceMax] = useState<number>(7000);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const addToCart = (product: Product, customDesign?: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && !customDesign);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, customDesign }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    MOCK_PRODUCTS.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, []);

  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    MOCK_PRODUCTS.forEach(p => brands.add(p.brand));
    return Array.from(brands);
  }, []);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      const matchesPrice = p.price <= filterPriceMax;
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => p.tags.includes(tag));
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesTags && matchesBrand && matchesSearch;
    });
  }, [filterCategory, filterPriceMax, selectedTags, selectedBrands, searchQuery]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setFilterCategory('all');
    setFilterPriceMax(7000);
    setSelectedTags([]);
    setSelectedBrands([]);
    setSearchQuery('');
  };

  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.HOME:
        return (
          <>
            <Hero 
              onCustomize={() => setCurrentRoute(AppRoute.CUSTOMIZE)} 
              onShop={() => setCurrentRoute(AppRoute.SHOP)} 
            />
            <section className="max-w-7xl mx-auto px-4 py-20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                <div>
                  <h2 className="text-3xl font-kids font-bold text-gray-900 tracking-tight">Featured Collections</h2>
                  <p className="text-gray-500 mt-2">Merging Himalayan heritage with modern playground performance.</p>
                </div>
                <button 
                  onClick={() => setCurrentRoute(AppRoute.SHOP)}
                  className="text-rose-600 font-black text-sm uppercase tracking-widest flex items-center group bg-rose-50 px-8 py-3 rounded-2xl hover:bg-rose-100 transition-all duration-300"
                >
                  Explore All <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {MOCK_PRODUCTS.slice(0, 4).map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={(p) => addToCart(p)}
                    onCustomize={() => setCurrentRoute(AppRoute.CUSTOMIZE)}
                  />
                ))}
              </div>
            </section>
          </>
        );

      case AppRoute.SHOP:
        return (
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row gap-12">
              <aside className="w-full lg:w-72 flex-shrink-0">
                <div className="sticky top-28 space-y-10 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                  <div>
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Search</h3>
                    <input 
                      type="text" 
                      placeholder="Find a style..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Category</h3>
                    <div className="space-y-2">
                      {['all', 'ready-made', 'customizable'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(cat)}
                          className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${
                            filterCategory === cat ? 'bg-rose-600 text-white' : 'text-gray-500 hover:bg-rose-50'
                          }`}
                        >
                          {cat.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Brands</h3>
                    <div className="flex flex-wrap gap-2">
                      {allBrands.map(brand => (
                        <button
                          key={brand}
                          onClick={() => toggleBrand(brand)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            selectedBrands.includes(brand)
                              ? 'bg-rose-600 border-rose-600 text-white shadow-md'
                              : 'bg-white border-gray-200 text-gray-500 hover:border-rose-400'
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={clearFilters}
                    className="w-full py-4 text-xs font-black text-gray-400 hover:text-rose-600 uppercase tracking-widest border-t border-gray-50 pt-8 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </aside>

              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={(p) => addToCart(p)}
                      onCustomize={() => setCurrentRoute(AppRoute.CUSTOMIZE)}
                    />
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                      <i className="fa-solid fa-shoe-prints text-6xl text-gray-100 mb-6"></i>
                      <p className="text-xl text-gray-400 font-bold">No kicks matching your filters.</p>
                      <button onClick={clearFilters} className="mt-4 text-rose-600 font-black text-sm uppercase tracking-widest">Clear filters</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case AppRoute.CUSTOMIZE:
        return <Customizer onAddToCart={(design) => addToCart(MOCK_PRODUCTS[4], design)} />;

      case AppRoute.RESTORATION:
        return <Restoration />;

      case AppRoute.ABOUT:
        return (
          <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in duration-700">
            <h2 className="text-5xl font-kids font-bold text-gray-900 mb-8 tracking-tight">Our <span className="text-rose-600">Story</span></h2>
            <div className="prose prose-lg text-gray-600 space-y-6">
              <p className="text-xl font-medium leading-relaxed">
                Kids KickLabs was born in the heart of Kathmandu with a simple mission: To celebrate the vibrant heritage of Nepal through the eyes of our children.
              </p>
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm my-12">
                <h3 className="text-rose-600 font-black uppercase tracking-widest text-sm mb-4">The Mission</h3>
                <p>We believe every step a child takes should be a step of pride. By blending traditional patterns like Dhaka and Lali Guras with high-performance footwear technology, we ensure the next generation walks with culture and comfort.</p>
              </div>
              <p>Our workshop collaborates with local artisans and utilizes advanced AI customization to give parents and kids the freedom to co-create their own legacy. This isn't just a shoe shop—it's a celebration of where we come from and where we are going.</p>
            </div>
          </div>
        );

      case AppRoute.CONTACT:
        return (
          <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in duration-700">
            <h2 className="text-5xl font-kids font-bold text-gray-900 mb-8 tracking-tight">Get in <span className="text-rose-600">Touch</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <p className="text-gray-500 text-lg">Have a question about our custom designs or restoration services? We're here to help!</p>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                      <i className="fa-solid fa-envelope text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Us</p>
                      <p className="font-bold text-gray-900">namaste@kidskicklabs.com.np</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600">
                      <i className="fa-solid fa-phone text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Call Us</p>
                      <p className="font-bold text-gray-900">+977-1-44XXXXX</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                      <i className="fa-solid fa-location-dot text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visit Us</p>
                      <p className="font-bold text-gray-900">Lazimpat, Kathmandu, Nepal</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-50">
                {contactSubmitted ? (
                  <div className="text-center py-12 px-6 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <h3 className="text-2xl font-kids font-bold text-gray-900 mb-2">Message Received!</h3>
                    <p className="text-gray-500">Namaste! We've received your query and will get back to you within 24 hours.</p>
                    <button onClick={() => setContactSubmitted(false)} className="mt-8 text-rose-600 font-black text-xs uppercase tracking-widest">Send another message</button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }}>
                    <input type="text" placeholder="Your Name" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-rose-500" required />
                    <input type="email" placeholder="Email Address" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-rose-500" required />
                    <textarea placeholder="How can we help?" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-rose-500 h-32" required></textarea>
                    <button className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black text-sm hover:bg-rose-700 transition-all active:scale-95 shadow-xl shadow-rose-100">Send Message</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        );

      case AppRoute.FAQ:
        return (
          <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in duration-700">
            <h2 className="text-5xl font-kids font-bold text-gray-900 mb-8 tracking-tight">Help <span className="text-rose-600">Center</span></h2>
            <div className="space-y-4">
              {[
                { q: "What materials do you use for kids' shoes?", a: "We prioritize safety and durability. Our ready-made collections use breathable technical mesh, premium ethically sourced leather, and eco-friendly natural rubber for soles. Our custom shoes can incorporate materials like organic hemp and traditional woven fabrics." },
                { q: "How long does custom shoe delivery take?", a: "Custom designs are manufactured on-demand. Usually, it takes 7-10 business days for the AI-assisted prototyping and artisan craftsmanship to finish, plus shipping time." },
                { q: "Is shipping free across Nepal?", a: "Yes, we offer free standard shipping on all orders above NPR 3,000 to major cities like Kathmandu, Pokhara, Butwal, and Narayanghat." },
                { q: "Can I cancel a custom order?", a: "Since custom orders are unique to your child, we can only accept cancellations within 12 hours of placing the order, before production starts." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                  <h4 className="font-black text-gray-900 mb-3">{item.q}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case AppRoute.SIZE_CHART:
        return (
          <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in duration-700">
            <h2 className="text-5xl font-kids font-bold text-gray-900 mb-8 tracking-tight">Size <span className="text-rose-600">Chart</span></h2>
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Child's Age</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Foot Length (cm)</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">EU Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { age: "2-3 Years", cm: "14.5 - 15.2", eu: "24-25" },
                    { age: "4-5 Years", cm: "16.1 - 16.8", eu: "26-27" },
                    { age: "6-7 Years", cm: "17.5 - 18.2", eu: "28-30" },
                    { age: "8-9 Years", cm: "19.0 - 19.7", eu: "31-33" },
                    { age: "10+ Years", cm: "20.5 - 21.5", eu: "34-36" }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-8 py-6 font-bold text-gray-900">{row.age}</td>
                      <td className="px-8 py-6 text-gray-500 font-medium">{row.cm} cm</td>
                      <td className="px-8 py-6 font-black text-rose-600">{row.eu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-8 text-center text-gray-400 text-xs italic">Note: Every child's foot is unique. We recommend measuring the foot while standing on a piece of paper for the best accuracy.</p>
          </div>
        );

      case AppRoute.RETURNS:
        return (
          <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in duration-700">
            <h2 className="text-5xl font-kids font-bold text-gray-900 mb-8 tracking-tight">Returns <span className="text-rose-600">& Exchange</span></h2>
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl shadow-sm">
                  <i className="fa-solid fa-calendar-days"></i>
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 mb-2">14-Day Guarantee</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">We offer a 14-day hassle-free return and exchange policy for all ready-made footwear. Shoes must be in original, unworn condition with tags attached.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl shadow-sm">
                  <i className="fa-solid fa-truck-ramp-box"></i>
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 mb-2">Free Pickup</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Changed your mind? We provide free return pickup within Kathmandu Valley. For outside valley, shipping costs apply for the return leg.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl shadow-sm">
                  <i className="fa-solid fa-sparkles"></i>
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 mb-2">Custom Designs</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Custom 'Design-Your-Own' shoes are generally non-returnable as they are made uniquely for you. However, we offer free fixes or replacements if there's a manufacturing defect.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case AppRoute.TRACK_ORDER:
        return (
          <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in duration-700">
            <h2 className="text-5xl font-kids font-bold text-gray-900 mb-8 tracking-tight">Track <span className="text-rose-600">Order</span></h2>
            <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-2xl text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="fa-solid fa-box-open text-4xl text-rose-600/30"></i>
              </div>
              <p className="text-gray-500 mb-8 font-medium">Enter your Order ID found in your confirmation email to see real-time updates.</p>
              <div className="flex gap-4">
                <input type="text" placeholder="e.g. KICK-88210" className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-rose-500 shadow-inner" />
                <button onClick={() => alert("Searching our database...")} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-rose-600 transition-all shadow-xl">Track Now</button>
              </div>
            </div>
          </div>
        );

      case AppRoute.SHIPPING:
        return (
          <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in duration-700">
            <h2 className="text-5xl font-kids font-bold text-gray-900 mb-8 tracking-tight">Shipping <span className="text-rose-600">Info</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { city: "Kathmandu Valley", time: "1-2 Business Days", cost: "Free over NPR 2k" },
                { city: "Pokhara / Butwal", time: "2-4 Business Days", cost: "NPR 150 (Standard)" },
                { city: "Biratnagar / Dharan", time: "3-5 Business Days", cost: "NPR 200 (Standard)" },
                { city: "Rural Areas", time: "5-7 Business Days", cost: "NPR 350 (Standard)" }
              ].map((loc, i) => (
                <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-black text-gray-900 mb-2">{loc.city}</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500"><i className="fa-solid fa-clock mr-2 text-rose-500"></i> {loc.time}</p>
                    <p className="text-sm text-gray-500"><i className="fa-solid fa-tag mr-2 text-sky-500"></i> {loc.cost}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 bg-rose-50 p-8 rounded-[40px] border border-rose-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-white text-rose-600 rounded-full flex items-center justify-center text-2xl shadow-sm">
                <i className="fa-solid fa-plane"></i>
              </div>
              <div>
                <h4 className="font-black text-gray-900 mb-1">Global Shipping</h4>
                <p className="text-sm text-gray-500">We're working on bringing Nepali culture to the world! International shipping to USA, UK, and Australia is coming soon.</p>
              </div>
            </div>
          </div>
        );

      case AppRoute.CART:
        return (
          <div className="max-w-4xl mx-auto px-4 py-20">
            <h2 className="text-4xl font-kids font-bold mb-12">Shopping Bag</h2>
            {cart.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <i className="fa-solid fa-cart-shopping text-6xl text-gray-100 mb-6"></i>
                <p className="text-xl text-gray-400 font-bold">Your backpack is empty!</p>
                <button onClick={() => setCurrentRoute(AppRoute.SHOP)} className="mt-8 bg-rose-600 text-white px-8 py-3 rounded-2xl font-black">Go Shopping</button>
              </div>
            ) : (
              <div className="space-y-8">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-center bg-white p-6 rounded-[32px] border border-gray-100">
                    <img src={item.customDesign?.imageUrl || item.image} className="w-24 h-24 object-cover rounded-2xl shadow-sm" />
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">{item.brand}</p>
                      <h3 className="font-black text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-rose-600">NPR {item.price.toLocaleString()}</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-gray-300 hover:text-rose-600 font-bold mt-2 underline transition-colors">Remove</button>
                    </div>
                  </div>
                ))}
                <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-50 mt-12">
                  <div className="flex justify-between items-center text-2xl font-black text-gray-900 mb-8 pb-8 border-b border-gray-50">
                    <span>Grand Total</span>
                    <span className="text-rose-600">NPR {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setCurrentRoute(AppRoute.SHOP)} className="flex-1 py-5 bg-gray-50 text-gray-500 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all">Keep Shopping</button>
                    <button className="flex-[2] py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-rose-600 transition-all active:scale-95 shadow-2xl shadow-rose-100">Checkout Now</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <Hero onCustomize={() => setCurrentRoute(AppRoute.CUSTOMIZE)} onShop={() => setCurrentRoute(AppRoute.SHOP)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-rose-100 selection:text-rose-600 bg-[#FAFAFA]">
      <Navbar currentRoute={currentRoute} setRoute={setCurrentRoute} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} />
      
      <main className="flex-1 overflow-x-hidden">
        {renderContent()}
      </main>

      <footer className="bg-gray-900 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-rose-600 p-2 rounded-xl mr-3 shadow-lg shadow-rose-900/40">
                <i className="fa-solid fa-shoe-prints text-white text-xl"></i>
              </div>
              <h1 className="text-xl font-kids font-bold text-white tracking-tight">Kids <span className="text-rose-600">KickLabs</span></h1>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium">
              Empowering the next generation to step into their heritage. Proudly crafting Nepali-inspired kids' footwear with modern comfort.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-rose-600 transition-all"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-rose-600 transition-all"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-rose-600 transition-all"><i className="fa-brands fa-tiktok"></i></a>
            </div>
          </div>
          <div>
            <h4 className="font-black mb-8 text-rose-500 uppercase text-xs tracking-widest">Explore</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-bold">
              <li><button onClick={() => {setCurrentRoute(AppRoute.SHOP); clearFilters();}} className="hover:text-white transition-colors">All Collections</button></li>
              <li><button onClick={() => setCurrentRoute(AppRoute.CUSTOMIZE)} className="hover:text-white transition-colors">AI Customizer</button></li>
              <li><button onClick={() => {setCurrentRoute(AppRoute.SHOP); setFilterCategory('ready-made');}} className="hover:text-white transition-colors">Ready-Made Kicks</button></li>
              <li><button onClick={() => setCurrentRoute(AppRoute.RESTORATION)} className="hover:text-rose-400 transition-colors text-rose-500">Shoe Restoration</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-rose-500 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-bold">
              <li><button onClick={() => setCurrentRoute(AppRoute.FAQ)} className="hover:text-white transition-colors text-left">FAQ</button></li>
              <li><button onClick={() => setCurrentRoute(AppRoute.CONTACT)} className="hover:text-white transition-colors text-left">Contact Us</button></li>
              <li><button onClick={() => setCurrentRoute(AppRoute.SIZE_CHART)} className="hover:text-white transition-colors text-left">Size Chart</button></li>
              <li><button onClick={() => setCurrentRoute(AppRoute.RETURNS)} className="hover:text-white transition-colors text-left">Returns</button></li>
              <li><button onClick={() => setCurrentRoute(AppRoute.TRACK_ORDER)} className="hover:text-white transition-colors text-left">Track Order</button></li>
              <li><button onClick={() => setCurrentRoute(AppRoute.SHIPPING)} className="hover:text-white transition-colors text-left">Shipping Info</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-rose-500 uppercase text-xs tracking-widest">Join the Club</h4>
            <p className="text-xs text-gray-500 mb-6 font-medium">Get early access to drops and cultural stories.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="bg-gray-800 border-none rounded-xl px-4 py-3 text-sm flex-1 focus:ring-1 focus:ring-rose-500 text-white" />
              <button onClick={() => alert("Thanks for joining the KickLabs tribe!")} className="bg-rose-600 p-3 rounded-xl hover:bg-rose-700 transition-colors">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <p className="mt-12 text-[10px] text-gray-600 font-black uppercase tracking-widest italic">© 2024 Kids KickLabs Nepal</p>
          </div>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

export default App;
