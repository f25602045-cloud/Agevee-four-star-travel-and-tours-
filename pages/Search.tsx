import React, { useState, useMemo, useEffect } from 'react';
import { LISTINGS, DISTRICTS } from '../services/mockData';
import { GeminiAssistant } from '../components/GeminiAssistant';
import { Search as SearchIcon, Filter, MapPin } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  // Initialize filters from URL params if present
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setTypeFilter(typeParam);
    }
    const districtParam = searchParams.get('district');
    if (districtParam) {
      setSelectedDistrict(districtParam);
    }
  }, [searchParams]);

  const filteredListings = useMemo(() => {
    return LISTINGS.filter(l => {
      const matchDistrict = selectedDistrict === 'all' || l.districtId === selectedDistrict;
      const matchType = typeFilter === 'all' || l.type === typeFilter;
      const matchPrice = priceFilter === 'all' || l.priceLevel <= parseInt(priceFilter);
      return matchDistrict && matchType && matchPrice;
    });
  }, [selectedDistrict, typeFilter, priceFilter]);

  return (
    <div className="pt-24 min-h-screen bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 pb-20">
        
        {/* Gemini Assistant Section */}
        <div className="mb-16">
          <GeminiAssistant />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-brand-secondary p-6 rounded-xl border border-gray-700 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="text-brand-primary" />
                <h2 className="text-xl font-bold text-white">Smart Filters</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm uppercase tracking-wide">District</label>
                  <select 
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-brand-dark border border-gray-600 rounded p-3 text-white focus:border-brand-primary outline-none"
                  >
                    <option value="all">All Districts</option>
                    {DISTRICTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm uppercase tracking-wide">Looking For</label>
                  <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full bg-brand-dark border border-gray-600 rounded p-3 text-white focus:border-brand-primary outline-none"
                  >
                    <option value="all">All Services</option>
                    <option value="HOTEL">Hotels</option>
                    <option value="AGENCY">Travel Agencies (Tours)</option>
                    <option value="GUIDE">Tour Guides</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm uppercase tracking-wide">Max Price Level</label>
                  <select 
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full bg-brand-dark border border-gray-600 rounded p-3 text-white focus:border-brand-primary outline-none"
                  >
                    <option value="all">Any Price</option>
                    <option value="2">$$ (Budget)</option>
                    <option value="3">$$$ (Standard)</option>
                    <option value="5">$$$$$ (Luxury)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="w-full lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Recommended Results ({filteredListings.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredListings.map(item => {
                const distName = DISTRICTS.find(d => d.id === item.districtId)?.name;
                return (
                  <div key={item.id} className="bg-brand-secondary rounded-xl overflow-hidden flex flex-col border border-gray-700 hover:border-brand-primary transition duration-300">
                    <div className="relative h-48">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                       <span className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                         {item.type}
                       </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                        <span className="text-brand-primary font-mono">{Array(item.priceLevel).fill('$').join('')}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-400 text-sm mb-4">
                        <MapPin size={14} className="mr-1" />
                        <span>{distName}</span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.features.slice(0, 3).map((f, i) => (
                           <span key={i} className="text-xs bg-brand-dark text-gray-500 px-2 py-1 rounded">{f}</span>
                        ))}
                      </div>

                      <button className="w-full bg-brand-primary/10 text-brand-primary border border-brand-primary py-2 rounded hover:bg-brand-primary hover:text-brand-dark transition font-semibold">
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredListings.length === 0 && (
                <div className="col-span-2 text-center py-20 bg-brand-secondary rounded-xl border border-dashed border-gray-700">
                  <SearchIcon className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                  <p className="text-gray-400 text-lg">No results found matching your criteria.</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting the filters or ask the AI assistant above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};