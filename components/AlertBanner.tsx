import React from 'react';
import { ALERTS } from '../services/mockData';
import { AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export const AlertBanner: React.FC = () => {
  const activeAlert = ALERTS[0]; // For simplicity, showing the top alert. In real app, could rotate.

  if (!activeAlert) return null;

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-900/90 text-red-100 border-red-700';
      case 'warning': return 'bg-amber-900/90 text-amber-100 border-amber-700';
      default: return 'bg-blue-900/90 text-blue-100 border-blue-700';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertOctagon size={18} />;
      case 'warning': return <AlertTriangle size={18} />;
      default: return <Info size={18} />;
    }
  };

  return (
    <div className={`fixed top-24 w-full z-40 border-b px-4 py-2 backdrop-blur-md flex justify-center items-center shadow-lg ${getAlertStyle(activeAlert.type)}`}>
      <div className="flex items-center gap-3 max-w-7xl mx-auto w-full animate-pulse-slow">
        <span className="shrink-0">{getIcon(activeAlert.type)}</span>
        <span className="font-bold text-sm md:text-base tracking-wide flex-1 text-center md:text-left">
          <span className="uppercase font-black mr-2">Advisory:</span>
          {activeAlert.message}
        </span>
      </div>
    </div>
  );
};