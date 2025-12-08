import React, { useState } from 'react';
import { generateItinerary, chatWithAI } from '../services/geminiService';
import { Sparkles, Send, Loader2, Map } from 'lucide-react';

export const GeminiAssistant: React.FC = () => {
  const [mode, setMode] = useState<'chat' | 'plan'>('plan');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  
  // Plan State
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState('Medium');
  const [interests, setInterests] = useState('');

  // Chat State
  const [chatMessage, setChatMessage] = useState('');

  const handlePlan = async () => {
    setLoading(true);
    const result = await generateItinerary({
      destination,
      days,
      budget,
      interests: interests.split(',').map(i => i.trim())
    });
    setResponse(result);
    setLoading(false);
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) return;
    setLoading(true);
    const result = await chatWithAI(chatMessage);
    setResponse(result);
    setLoading(false);
    setChatMessage('');
  };

  return (
    <div className="bg-brand-secondary rounded-xl p-6 shadow-xl border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-brand-primary h-6 w-6" />
        <h2 className="text-2xl font-bold text-white">AI Travel Assistant</h2>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => { setMode('plan'); setResponse(''); }}
          className={`flex-1 py-2 rounded-lg font-medium transition ${mode === 'plan' ? 'bg-brand-primary text-brand-dark' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Plan Trip
        </button>
        <button
          onClick={() => { setMode('chat'); setResponse(''); }}
          className={`flex-1 py-2 rounded-lg font-medium transition ${mode === 'chat' ? 'bg-brand-primary text-brand-dark' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Ask Anything
        </button>
      </div>

      <div className="space-y-4">
        {mode === 'plan' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Destination (Optional)</label>
              <input 
                type="text" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Hunza Valley"
                className="w-full bg-brand-dark border border-gray-600 rounded p-2 text-white focus:border-brand-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Duration (Days)</label>
              <input 
                type="number" 
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                min={1} max={15}
                className="w-full bg-brand-dark border border-gray-600 rounded p-2 text-white focus:border-brand-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Budget</label>
              <select 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-brand-dark border border-gray-600 rounded p-2 text-white focus:border-brand-primary outline-none"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Interests (comma separated)</label>
              <input 
                type="text" 
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Hiking, Food, History..."
                className="w-full bg-brand-dark border border-gray-600 rounded p-2 text-white focus:border-brand-primary outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <button 
                onClick={handlePlan}
                disabled={loading}
                className="w-full bg-brand-primary text-brand-dark font-bold py-3 rounded-lg hover:bg-amber-400 transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Map className="h-5 w-5" />}
                Generate Itinerary
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <input 
              type="text" 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChat()}
              placeholder="Ask about weather, roads, or culture..."
              className="flex-1 bg-brand-dark border border-gray-600 rounded p-3 text-white focus:border-brand-primary outline-none"
            />
            <button 
              onClick={handleChat}
              disabled={loading}
              className="bg-brand-primary text-brand-dark p-3 rounded hover:bg-amber-400 transition"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
        )}
      </div>

      {response && (
        <div className="mt-6 p-4 bg-brand-dark rounded-lg border border-gray-700 max-h-96 overflow-y-auto">
          <h3 className="text-brand-primary font-bold mb-2">Agevee Assistant:</h3>
          <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};
