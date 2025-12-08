import React, { useState } from 'react';
import { Activity, X, ShieldCheck } from 'lucide-react';

export const FloatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Mock Safety Index Calculation
  const safetyPercentage = 94;
  const roadOpenness = 85;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start animate-fade-in-up font-sans">
      {isOpen ? (
        <div className="bg-brand-secondary border border-brand-primary/30 rounded-lg shadow-2xl p-4 w-72 backdrop-blur-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-brand-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={16} /> Live Safety Index
              </h3>
              <p className="text-[10px] text-gray-400 mt-1">Real-time regional analysis</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition">
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            {/* CSS Conic Gradient Donut Chart */}
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-gray-800"
                 style={{
                   background: `conic-gradient(#d4af37 ${safetyPercentage}%, #1f2937 0)`
                 }}
            >
              <div className="absolute inset-2 bg-brand-secondary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{safetyPercentage}%</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">Safety Score</span>
                <span className="text-brand-primary font-bold">Excellent</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">Routes Open</span>
                <span className="text-green-400 font-bold">{roadOpenness}%</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <p className="text-xs text-gray-400 leading-tight">
              <span className="text-brand-primary">Ghanche Region</span> reports optimal conditions for trekking.
            </p>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-brand-secondary border border-gray-700 text-gray-300 p-3 rounded-full shadow-lg hover:bg-brand-dark hover:text-brand-primary transition-all duration-300 flex items-center justify-center"
        >
          <Activity size={24} />
        </button>
      )}
    </div>
  );
};