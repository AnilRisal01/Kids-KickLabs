
import React, { useState, useMemo } from 'react';

const CONDITIONS = [
  { id: 'light', label: 'Light Dirt', desc: 'Small stains', baseCost: 299, time: '1–2 days', icon: 'fa-broom' },
  { id: 'medium', label: 'Medium Dirt', desc: 'Visible stains + dust', baseCost: 499, time: '2–3 days', icon: 'fa-soap' },
  { id: 'heavy', label: 'Heavy Dirt', desc: 'Mud, deep stains, odor', baseCost: 799, time: '3–5 days', icon: 'fa-water' },
  { id: 'damage', label: 'Damage', desc: 'Torn fabric, loose sole', baseCost: 999, time: '5–7 days', icon: 'fa-hammer' },
];

const SERVICES = [
  { id: 'basic', label: 'Basic Cleaning', cost: 0, icon: 'fa-sparkles' },
  { id: 'deep', label: 'Deep Cleaning + Deodorize', cost: 250, icon: 'fa-wind' },
  { id: 'stain', label: 'Stain Removal', cost: 200, icon: 'fa-eraser' },
  { id: 'lace', label: 'Lace Replacement', cost: 150, icon: 'fa-lines-leaning' },
  { id: 'white', label: 'Sole Whitening', cost: 200, icon: 'fa-sun' },
  { id: 'glue', label: 'Minor Glue Repair', cost: 300, icon: 'fa-vial' },
];

const Restoration: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [shoeType, setShoeType] = useState('Sneakers');
  const [size, setSize] = useState('5');
  const [condition, setCondition] = useState('light');
  const [selectedServices, setSelectedServices] = useState<string[]>(['basic']);
  const [showResult, setShowResult] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleService = (id: string) => {
    if (id === 'basic') return; // Basic is mandatory
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const calculation = useMemo(() => {
    const selectedCond = CONDITIONS.find(c => c.id === condition)!;
    const base = selectedCond.baseCost;
    
    let addonTotal = 0;
    const selectedList = SERVICES.filter(s => selectedServices.includes(s.id));
    selectedList.forEach(s => addonTotal += s.cost);

    let discount = 0;
    if (selectedServices.length >= 3) {
      discount = addonTotal * 0.1;
    }

    const total = base + addonTotal - discount;
    return {
      base,
      addonTotal,
      discount,
      total,
      time: selectedCond.time,
      selectedList
    };
  }, [condition, selectedServices]);

  const handleCalculate = () => {
    if (!imagePreview) {
      alert("Please upload a shoe photo first!");
      return;
    }
    setShowResult(true);
  };

  const handleBooking = () => {
    alert("Namaste! Your restoration pickup has been booked. Our agent will contact you shortly to coordinate the pickup.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-kids font-bold text-gray-900 mb-4 tracking-tight">Shoe <span className="text-rose-600">Restoration</span></h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">
          Give your little explorer's shoes a new life. Upload a photo and get an instant professional cleaning estimate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Uploader */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <i className="fa-solid fa-camera text-rose-500"></i> Step 1: Upload Photo
            </h3>
            
            <div className="flex flex-col items-center">
              {imagePreview ? (
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-6 group">
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Shoe preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-rose-600 px-6 py-2 rounded-full font-bold text-sm">
                      Change Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="w-full aspect-video rounded-3xl border-4 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-rose-200 hover:bg-rose-50/30 transition-all mb-6">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                    <i className="fa-solid fa-cloud-arrow-up text-2xl text-rose-500"></i>
                  </div>
                  <span className="text-gray-900 font-bold">Select Shoe Photo</span>
                  <span className="text-gray-400 text-xs mt-1">Accepts JPG, PNG, JPEG</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            {/* Basic Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Shoe Type</label>
                <select 
                  value={shoeType}
                  onChange={(e) => setShoeType(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-rose-500"
                >
                  <option>Sneakers</option>
                  <option>Sandals</option>
                  <option>School Shoes</option>
                  <option>Boots</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kid's Size (Yrs)</label>
                <select 
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-rose-500"
                >
                  {Array.from({length: 10}, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} Years</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Condition & Services */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <i className="fa-solid fa-list-check text-rose-500"></i> Step 2: Shoe Condition
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {CONDITIONS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCondition(item.id)}
                  className={`flex items-center p-5 rounded-3xl border transition-all text-left group relative ${
                    condition === item.id 
                    ? 'border-rose-600 bg-rose-50/50 ring-1 ring-rose-600 shadow-md shadow-rose-100/50' 
                    : 'border-gray-100 bg-white hover:border-rose-200'
                  }`}
                >
                  {/* Icon with Circle Background */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 transition-colors ${
                    condition === item.id ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-gray-50 text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-400'
                  }`}>
                    <i className={`fa-solid ${item.icon} text-xl`}></i>
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <p className={`font-black text-sm ${condition === item.id ? 'text-rose-700' : 'text-gray-900'}`}>{item.label}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 leading-tight tracking-tight">{item.desc}</p>
                  </div>

                  {/* Radio Indicator */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    condition === item.id ? 'border-rose-600 bg-rose-600' : 'border-gray-200 bg-white'
                  }`}>
                    {condition === item.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in duration-300"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <i className="fa-solid fa-plus-circle text-rose-500"></i> Step 3: Select Services
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map(service => (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`flex items-center p-4 rounded-3xl border transition-all text-left ${
                    selectedServices.includes(service.id)
                    ? 'border-sky-600 bg-sky-50/50' 
                    : 'border-gray-100 bg-white hover:border-sky-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                    selectedServices.includes(service.id) ? 'bg-sky-600 text-white shadow-md shadow-sky-100' : 'bg-gray-50 text-gray-400'
                  }`}>
                    <i className={`fa-solid ${service.icon} text-base`}></i>
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-xs ${selectedServices.includes(service.id) ? 'text-sky-700' : 'text-gray-700'}`}>{service.label}</p>
                    <p className="text-[10px] text-sky-600 font-black mt-0.5">
                      {service.cost === 0 ? 'FREE' : `+ NPR ${service.cost}`}
                    </p>
                  </div>
                  {selectedServices.includes(service.id) && (
                    <i className="fa-solid fa-circle-check text-sky-600 ml-2"></i>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleCalculate}
              className="w-full mt-12 py-5 bg-rose-600 text-white rounded-3xl font-black text-lg hover:bg-rose-700 transition-all active:scale-95 shadow-xl shadow-rose-200"
            >
              Calculate Estimate
            </button>
          </div>
        </div>

        {/* Right Column: Estimate Result */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden">
            <div className="bg-gray-900 p-8 text-center">
              <p className="text-rose-500 font-black uppercase tracking-widest text-[10px] mb-2">Instant Restoration Estimate</p>
              <h4 className="text-5xl font-black text-white">NPR {calculation.total.toFixed(0)}</h4>
              {calculation.discount > 0 && (
                <p className="text-sky-400 text-xs font-bold mt-2 animate-pulse">
                  <i className="fa-solid fa-percent mr-1"></i> Multi-service discount applied!
                </p>
              )}
            </div>

            <div className="p-8">
              <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Service Breakdown</h5>
              
              <ul className="space-y-4 mb-8">
                <li className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    <span className="text-sm font-bold text-gray-700">Base Cost ({condition})</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">NPR {calculation.base}</span>
                </li>
                {calculation.selectedList.filter(s => s.cost > 0).map(s => (
                  <li key={s.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      <span className="text-sm font-medium text-gray-600">{s.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">NPR {s.cost}</span>
                  </li>
                ))}
                {calculation.discount > 0 && (
                  <li className="flex justify-between items-center text-sky-600 pt-2 font-bold">
                    <span>Bundle Discount (10% off addons)</span>
                    <span>- NPR {calculation.discount.toFixed(0)}</span>
                  </li>
                )}
              </ul>

              <div className="bg-gray-50 p-6 rounded-3xl mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                    <i className="fa-solid fa-truck-fast text-xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Turnaround</p>
                    <p className="text-sm font-black text-gray-900">{calculation.time}</p>
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pickup</p>
                   <p className="text-sm font-black text-rose-600">FREE</p>
                </div>
              </div>

              {showResult && (
                <button
                  onClick={handleBooking}
                  className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-rose-600 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-calendar-check"></i> Book Restoration Pickup
                </button>
              )}
              
              {!showResult && (
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs text-gray-400 font-medium italic">Please upload a photo and click "Calculate Estimate" to proceed with booking.</p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-50 flex items-start gap-3">
                <i className="fa-solid fa-circle-info text-sky-500 mt-0.5"></i>
                <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                  Final pricing may vary slightly after a physical inspection by our experts. This estimate is for demonstration purposes in our cultural legacy platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restoration;
