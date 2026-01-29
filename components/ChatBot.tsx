
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const gemini = GeminiService.getInstance();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await gemini.getShoppingAdvice(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: response || "I'm sorry, I couldn't answer that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to assistant." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-rose-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <i className="fa-solid fa-message-sparkles text-2xl"></i>
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          <div className="bg-rose-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <p className="font-bold">KickBot Assistant</p>
                <p className="text-[10px] opacity-70">Always online 🇳🇵</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <i className="fa-solid fa-hand-wave text-3xl mb-4 text-rose-200"></i>
                <p className="text-sm">Namaste! How can I help you choose the perfect shoes today?</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-rose-600 text-white' : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
