import React, { useState } from 'react';
import { WEATHER_DATA, ROAD_STATUS, EMERGENCY_CONTACTS } from '../services/mockData';
import { getLiveTravelUpdates } from '../services/geminiService';
import { LiveStatusResponse } from '../types';
import { Cloud, Thermometer, Phone, ShieldCheck, AlertCircle, RefreshCw, ExternalLink, Globe } from 'lucide-react';

export const LiveDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [liveData, setLiveData] = useState<LiveStatusResponse | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    const { data, sources } = await getLiveTravelUpdates();
    if (data) {
      setLiveData(data);
      setSources(sources);
      setLastSync(new Date().toLocaleTimeString());
    }
    setLoading(false);
  };

  // Helper to determine status color
  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'OPEN') return 'bg-green-900/50 text-green-400 border-green-800';
    if (s === 'CLOSED') return 'bg-red-900/50 text-red-400 border-red-800';
    return 'bg-yellow-900/50 text-yellow-400 border-yellow-800';
  };

  return (
    <div className="bg-brand-secondary border-y border-white/5 py-12 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-brand-primary h-8 w-8" />
            <div>
              <h2 className="text-3xl font-serif font-bold text-white">Live Situation Room</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                {liveData ? `Verified Online • Last Updated: ${liveData.lastUpdated}` : 'Standard Database • Static Records'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleSync}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-sm border transition font-bold uppercase text-sm tracking-wider ${
              loading 
                ? 'bg-brand-dark border-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-brand-primary text-brand-dark border-brand-primary hover:bg-white'
            }`}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Syncing...' : 'Sync Live Status'}
          </button>
        </div>

        {/* Live Data Sources (Only visible after sync) */}
        {sources.length > 0 && (
          <div className="mb-6 bg-brand-dark/30 p-4 border border-gray-800 rounded-sm">
             <div className="flex flex-wrap gap-4 text-xs text-gray-400 items-center">
                <span className="flex items-center gap-2 text-brand-primary font-bold"><Globe size={12}/> Verified Sources:</span>
                {sources.slice(0, 3).map((s, i) => (
                  <a key={i} href={s} target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1 truncate max-w-[200px] border-b border-gray-700 hover:border-white transition-colors">
                    {new URL(s).hostname} <ExternalLink size={10} />
                  </a>
                ))}
                {sources.length > 3 && <span>+{sources.length - 3} more</span>}
             </div>
          </div>
        )}

        {liveData && liveData.generalAlerts && liveData.generalAlerts.length > 0 && (
           <div className="mb-8 bg-red-900/20 border border-red-900/50 p-4 rounded-sm animate-fade-in-up">
              <h4 className="text-red-400 font-bold text-sm uppercase mb-2 flex items-center gap-2"><AlertCircle size={16}/> Major Alerts</h4>
              <ul className="list-disc pl-5 space-y-1">
                {liveData.generalAlerts.map((alert, i) => (
                  <li key={i} className="text-gray-300 text-sm">{alert}</li>
                ))}
              </ul>
           </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Weather Widget */}
          <div className="bg-brand-dark/50 p-6 rounded-lg border border-gray-700 h-96 overflow-y-auto custom-scrollbar">
            <h3 className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2 sticky top-0 bg-brand-dark/95 py-2 z-10 border-b border-gray-800">
              <Cloud size={16} /> Regional Weather
            </h3>
            <div className="space-y-3">
              {(liveData ? liveData.districts : WEATHER_DATA).map((w: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-gray-800 pb-2 last:border-0 group hover:bg-white/5 p-2 rounded transition">
                  <span className="text-gray-300 font-medium">{liveData ? w.name : w.district}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs hidden sm:block">{liveData ? w.weather.condition : w.condition}</span>
                    <span className="text-white font-bold bg-brand-secondary px-2 py-0.5 rounded border border-gray-700">
                      {liveData ? w.weather.temp : w.temp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Road Status Widget */}
          <div className="bg-brand-dark/50 p-6 rounded-lg border border-gray-700 h-96 overflow-y-auto custom-scrollbar">
            <h3 className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2 sticky top-0 bg-brand-dark/95 py-2 z-10 border-b border-gray-800">
              <AlertCircle size={16} /> Road Networks
            </h3>
            <div className="space-y-3">
              {liveData ? (
                liveData.districts.map((d: any, i: number) => (
                  <div key={i} className="flex flex-col text-sm border-b border-gray-800 pb-3 last:border-0 group hover:bg-white/5 p-2 rounded transition">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-200 font-bold">{d.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(d.roadStatus.status)}`}>
                        {d.roadStatus.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-tight">{d.roadStatus.details || "No specific details reported."}</p>
                  </div>
                ))
              ) : (
                ROAD_STATUS.map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-gray-800 pb-2 last:border-0 p-2">
                    <span className="text-gray-300 truncate max-w-[150px]">{r.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${
                      r.status === 'OPEN' ? 'bg-green-900/50 text-green-400 border-green-800' :
                      r.status === 'CLOSED' ? 'bg-red-900/50 text-red-400 border-red-800' :
                      'bg-yellow-900/50 text-yellow-400 border-yellow-800'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Emergency Contacts Widget */}
          <div className="bg-brand-dark/50 p-6 rounded-lg border border-gray-700 h-96 overflow-y-auto custom-scrollbar">
            <h3 className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2 sticky top-0 bg-brand-dark/95 py-2 z-10 border-b border-gray-800">
              <Phone size={16} /> Emergency SOS
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {EMERGENCY_CONTACTS.map((c, i) => (
                <div key={i} className="bg-brand-secondary p-4 rounded text-center hover:bg-brand-primary hover:text-brand-dark transition group cursor-pointer border border-gray-700 hover:border-brand-primary">
                  <span className="block text-xs text-gray-400 group-hover:text-brand-dark/70 uppercase mb-1 tracking-widest font-bold">{c.name}</span>
                  <span className="block text-2xl font-black font-mono tracking-tight">{c.number}</span>
                </div>
              ))}
              <div className="mt-4 p-4 border border-brand-primary/20 rounded bg-brand-primary/5">
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  In case of zero connectivity, locate the nearest Pakistan Army or Frontier Corps (FC) checkpost for immediate assistance via satellite comms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};