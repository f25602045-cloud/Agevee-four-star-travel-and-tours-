import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, User, Bot } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! Welcome to Agevee Four Star. 🏔️ I can help you find hotels, check road status, or plan your trip. How can I assist you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate thinking/typing delay for realism
    const responseText = await chatWithAI(input);
    
    const botMsg: Message = { id: Date.now() + 1, text: responseText, sender: 'bot' };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen ? (
        <div className="bg-brand-secondary border border-brand-primary/30 rounded-2xl shadow-2xl w-80 md:w-96 overflow-hidden flex flex-col h-[500px] animate-fade-in-up backdrop-blur-xl">
          {/* Header */}
          <div className="bg-brand-dark/90 p-4 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-brand-dark">
                   <Bot size={24} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-brand-dark"></div>
              </div>
              <div>
                <h3 className="text-white font-bold font-serif tracking-wide">Agevee Assistant</h3>
                <p className="text-[10px] text-brand-primary uppercase tracking-wider font-bold">Online • Auto-Reply Active</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition bg-white/5 p-1 rounded-full"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-brand-primary text-brand-dark font-medium rounded-tr-none' 
                    : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-none p-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-brand-dark/50 border-t border-gray-700">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about hotels, tours..."
                className="w-full bg-brand-secondary border border-gray-600 text-white rounded-full py-3 pl-4 pr-12 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-sm transition shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-1.5 p-2 bg-brand-primary text-brand-dark rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
            <div className="text-center mt-2">
               <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                 <Sparkles size={8} /> Powered by Agevee AI
               </p>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-brand-primary text-brand-dark rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:bg-white hover:scale-110 transition-all duration-300"
        >
          <MessageCircle size={28} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-brand-dark"></span>
          </span>
          
          {/* Tooltip */}
          <div className="absolute right-16 bg-brand-secondary text-white text-xs font-bold py-1 px-3 rounded border border-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat with Us
          </div>
        </button>
      )}
    </div>
  );
};