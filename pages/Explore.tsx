import React, { useState, useEffect } from 'react';
import { DISTRICTS, LISTINGS, WEATHER_DATA, ROAD_STATUS } from '../services/mockData';
import { getDistrictDetails } from '../services/geminiService';
import { DistrictDetails, Listing } from '../types';
import { MapPin, ArrowRight, Star, Mountain, Landmark, Hotel, Loader2, ArrowLeft, Info, Thermometer, AlertTriangle, Cloud, Navigation, ExternalLink } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { BookingModal } from '../components/BookingModal';
import { InteractiveMap } from '../components/InteractiveMap';

export const Explore: React.FC = () => {
  const [searchParams] = useSearchParams();
  const districtId = searchParams.get('id');
  const [aiDetails, setAiDetails] = useState<DistrictDetails | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Booking State
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (districtId) {
        const district = DISTRICTS.find(d => d.id === districtId);
        if (district) {
          if (district.hardcodedDetails) {
            setAiDetails(district.hardcodedDetails);
            setLoading(false);
          } else {
            setLoading(true);
            const details = await getDistrictDetails(district.name);
            setAiDetails(details);
            setLoading(false);
          }
        }
      } else {
        setAiDetails(null);
      }
    };
    fetchDetails();
  }, [districtId]);
  
  const getPlaceImage = (placeName: string, context: string) => {
    const prompt = `${placeName} ${context} Gilgit Baltistan scenic travel photography 8k`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=400&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
  };

  // If a specific district is selected via query param, show details
  if (districtId) {
    const district = DISTRICTS.find(d => d.id === districtId);
    if (!district) return <div className="pt-24 text-center text-white">District not found</div>;

    const nearbyListings = LISTINGS.filter(l => l.districtId === districtId);
    const currentWeather = WEATHER_DATA.find(w => w.district === district.name);
    const relevantRoads = ROAD_STATUS.filter(r => r.affects.includes(districtId));

    return (
      <div className="min-h-screen bg-brand-dark font-sans text-gray-200">
        {selectedListing && (
            <BookingModal 
                listing={selectedListing} 
                onClose={() => setSelectedListing(null)} 
            />
        )}

        {/* Cinematic Hero */}
        <div className="relative h-[70vh] w-full">
          <img 
            src={district.image} 
            alt={district.name} 
            className="w-full h-full object-cover fixed top-0 left-0 z-0" 
            style={{ height: '70vh' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-black/30 z-10"></div>
          
          <div className="absolute inset-0 z-20 flex flex-col justify-end pb-20">
            <div className="max-w-7xl mx-auto px-4 w-full">
               <Link to="/explore" className="inline-flex items-center text-white/80 mb-8 hover:text-brand-primary transition-colors tracking-widest text-sm uppercase font-bold">
                <ArrowLeft size={16} className="mr-2" /> Return to Districts
              </Link>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 font-serif mb-4 drop-shadow-2xl">
                    {district.name}
                  </h1>
                  <div className="h-1 w-24 bg-brand-primary mb-6"></div>
                </div>
                {loading && (
                   <div className="flex items-center gap-3 bg-brand-dark/80 backdrop-blur-md px-6 py-3 rounded-full border border-brand-primary/30 text-brand-primary animate-pulse">
                     <Loader2 className="animate-spin" />
                     <span className="text-sm font-semibold tracking-wide">AI AGENT ANALYZING REGION...</span>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body (Overlapping) */}
        <div className="relative z-30 bg-brand-dark min-h-screen border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto px-4 py-12">
            
            {/* Real-Time Situation Report Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 -mt-24 relative z-40">
              {/* Weather Status */}
              <div className="bg-brand-secondary/90 backdrop-blur-xl border border-gray-700 p-6 rounded-sm shadow-xl hover:border-brand-primary/50 transition">
                <div className="flex items-center gap-3 mb-4 text-brand-primary">
                  <Cloud size={24} />
                  <h3 className="font-bold uppercase tracking-widest text-xs">Current Weather</h3>
                </div>
                {currentWeather ? (
                  <div>
                    <div className="text-4xl font-serif font-bold text-white mb-1">{currentWeather.temp}</div>
                    <div className="text-gray-400 font-light">{currentWeather.condition}</div>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">Weather data unavailable</div>
                )}
              </div>

              {/* Road Status */}
              <div className="bg-brand-secondary/90 backdrop-blur-xl border border-gray-700 p-6 rounded-sm shadow-xl hover:border-brand-primary/50 transition">
                <div className="flex items-center gap-3 mb-4 text-brand-primary">
                  <Navigation size={24} />
                  <h3 className="font-bold uppercase tracking-widest text-xs">Access Routes</h3>
                </div>
                <div className="space-y-2">
                  {relevantRoads.length > 0 ? (
                    relevantRoads.map((road, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{road.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          road.status === 'OPEN' ? 'bg-green-900 text-green-400' :
                          road.status === 'CLOSED' ? 'bg-red-900 text-red-400' : 'bg-yellow-900 text-yellow-400'
                        }`}>
                          {road.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 italic">No major warnings</div>
                  )}
                </div>
              </div>

              {/* AI/General Status */}
              <div className="bg-brand-secondary/90 backdrop-blur-xl border border-gray-700 p-6 rounded-sm shadow-xl hover:border-brand-primary/50 transition">
                <div className="flex items-center gap-3 mb-4 text-brand-primary">
                  <AlertTriangle size={24} />
                  <h3 className="font-bold uppercase tracking-widest text-xs">Travel Advisory</h3>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Always carry warm clothing. 4x4 vehicles recommended for interior travel in {district.name}. Check local police posts for latest security updates.
                </p>
              </div>
            </div>

            {/* Overview Text */}
            <div className="mb-20">
               {!loading && (
                <p className="text-xl md:text-2xl text-gray-200 max-w-4xl leading-relaxed font-light font-serif border-l-4 border-brand-primary pl-6">
                  {aiDetails?.overview || district.description}
                </p>
              )}
            </div>
            
            {loading ? (
               <div className="py-32 flex flex-col items-center justify-center text-center opacity-60">
                  <Loader2 size={64} className="text-brand-primary animate-spin mb-6" />
                  <h3 className="text-2xl font-serif text-white mb-2">Curating Experience</h3>
                  <p className="text-gray-400">Fetching the latest insights, weather patterns, and historical data...</p>
               </div>
            ) : (
              <>
                {aiDetails && (
                  <div className="space-y-24 mb-24">
                    {/* Natural Places */}
                    <section>
                      <div className="flex items-end gap-4 mb-12 border-b border-gray-800 pb-4">
                         <h2 className="text-4xl font-serif font-bold text-white">Natural <span className="text-brand-primary">Wonders</span></h2>
                         <p className="text-gray-500 pb-2 uppercase tracking-widest text-sm font-bold">Nature's Masterpieces</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {aiDetails.naturalPlaces.map((place, idx) => (
                          <div key={idx} className="group bg-brand-secondary border border-gray-800 rounded-sm overflow-hidden hover:border-brand-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/10">
                            <div className="h-64 overflow-hidden relative">
                              <img 
                                src={getPlaceImage(place.name, "nature mountain landscape")} 
                                alt={place.name} 
                                className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:filter group-hover:brightness-110"
                              />
                              <div className="absolute top-4 right-4 bg-brand-dark/80 backdrop-blur-md p-2 rounded-full text-brand-primary">
                                <Mountain size={20} />
                              </div>
                            </div>
                            <div className="p-8">
                              <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-brand-primary transition-colors">{place.name}</h3>
                              <p className="text-gray-400 text-sm leading-relaxed border-t border-gray-700 pt-4 mt-2">
                                {place.description}
                              </p>
                              <a href="#" className="inline-block mt-4 text-brand-primary border border-brand-primary px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-brand-dark transition">
                                More Details
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Historical Places */}
                    <section>
                      <div className="flex items-end gap-4 mb-12 border-b border-gray-800 pb-4 text-right justify-end">
                         <p className="text-gray-500 pb-2 uppercase tracking-widest text-sm font-bold">Timeless Legacy</p>
                         <h2 className="text-4xl font-serif font-bold text-white"><span className="text-brand-primary">Historical</span> Heritage</h2>
                      </div>
                      <div className="space-y-8">
                        {aiDetails.historicalPlaces.map((place, idx) => (
                          <div key={idx} className="flex flex-col md:flex-row bg-brand-secondary border border-gray-800 rounded-sm overflow-hidden hover:border-brand-primary/30 transition duration-500 group">
                             <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative">
                               <img 
                                  src={getPlaceImage(place.name, "ancient architecture fort stone")} 
                                  alt={place.name} 
                                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                               />
                               <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition"></div>
                             </div>
                             <div className="p-10 md:w-3/5 flex flex-col justify-center relative">
                                <div className="absolute -right-6 -top-6 text-white/5 rotate-12">
                                  <Landmark size={150} />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-white mb-4 relative z-10 group-hover:text-brand-primary transition-colors">{place.name}</h3>
                                <p className="text-gray-300 text-base leading-relaxed relative z-10 font-light mb-4">{place.description}</p>
                                <a href="#" className="relative z-10 inline-block text-brand-primary font-bold uppercase tracking-widest text-sm hover:underline">
                                    More Details <ArrowRight size={14} className="inline ml-1" />
                                </a>
                             </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                )}
                
                {/* Image Gallery Grid */}
                {district.gallery && district.gallery.length > 0 && (
                  <section className="mb-24">
                     <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-4">
                        <h2 className="text-3xl font-serif font-bold text-white">Visual Journey</h2>
                        <span className="text-brand-primary uppercase tracking-widest text-xs font-bold">Captured Moments</span>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {district.gallery.map((imgUrl, i) => (
                          <div key={i} className={`relative overflow-hidden group rounded-sm ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                             <img 
                               src={imgUrl} 
                               alt={`${district.name} gallery ${i}`} 
                               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
                             />
                             <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                          </div>
                        ))}
                     </div>
                  </section>
                )}

                {/* Combined Hotels & Map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/10 pt-16">
                  <div className="lg:col-span-8">
                    <div className="flex items-center gap-4 mb-10">
                       <h2 className="text-3xl font-serif font-bold text-white">Premium Accommodation</h2>
                       <div className="h-px flex-1 bg-gray-800"></div>
                    </div>
                    
                    {/* Verified Listings */}
                    <div className="space-y-6">
                      {nearbyListings.length > 0 ? (
                        nearbyListings.map(listing => (
                          <div key={listing.id} className="flex flex-col md:flex-row bg-brand-secondary border border-gray-700 hover:border-brand-primary transition-all duration-300 shadow-lg group rounded-sm overflow-hidden">
                            <div className="md:w-1/3 relative">
                              <img src={listing.image} alt={listing.name} className="w-full h-full object-cover min-h-[200px]" />
                              <div className="absolute top-3 left-3 bg-brand-primary text-brand-dark text-xs font-bold px-3 py-1 uppercase tracking-wider">
                                {listing.type}
                              </div>
                            </div>
                            <div className="p-6 md:w-2/3 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-2xl font-serif font-bold text-white group-hover:text-brand-primary transition-colors">{listing.name}</h3>
                                  <div className="flex text-brand-primary gap-1">
                                    {Array(listing.rating > 0 ? Math.floor(listing.rating) : 5).fill(0).map((_,i) => <Star key={i} size={16} fill="currentColor" />)}
                                  </div>
                                </div>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{listing.description}</p>
                                <div className="flex gap-2 mb-4">
                                  {listing.features.map((f, i) => (
                                    <span key={i} className="text-xs text-gray-400 border border-gray-700 px-2 py-1">{f}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between items-end">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xl text-brand-primary font-serif font-bold">
                                    {Array(listing.priceLevel).fill('$').join('')}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {listing.website && (
                                        <a 
                                        href={listing.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-transparent border border-gray-600 text-gray-300 px-4 py-2 text-sm hover:bg-white hover:text-brand-dark transition font-bold uppercase tracking-wider flex items-center gap-2"
                                        >
                                        Website <ExternalLink size={14} />
                                        </a>
                                    )}
                                    <button 
                                        onClick={() => setSelectedListing(listing)}
                                        className="bg-brand-dark text-white border border-gray-600 px-6 py-2 text-sm hover:bg-brand-primary hover:text-brand-dark hover:border-brand-primary transition font-bold uppercase tracking-wider"
                                    >
                                    {listing.type === 'HOTEL' ? 'Book Stay' : 'View Details'}
                                    </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-8 border border-dashed border-gray-700 rounded bg-brand-secondary/30">
                          <p className="text-gray-400 italic">No Agevee-verified partners listed here yet.</p>
                        </div>
                      )}
                    </div>

                    {/* AI Suggestions Mini List */}
                    {aiDetails && aiDetails.hotels.length > 0 && (
                      <div className="mt-12 bg-brand-secondary/30 p-8 border border-gray-800 rounded-sm">
                        <h4 className="flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-sm mb-6">
                          <Info size={16} /> Additional Recommendations
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {aiDetails.hotels.map((hotel, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-brand-dark border border-gray-800 hover:border-brand-primary/30 transition rounded-sm">
                               <img 
                                  src={getPlaceImage(hotel.name, "luxury hotel interior")} 
                                  alt={hotel.name}
                                  className="w-16 h-16 object-cover rounded-sm grayscale group-hover:grayscale-0"
                               />
                               <div>
                                 <h5 className="font-bold text-white font-serif">{hotel.name}</h5>
                                 <p className="text-xs text-gray-500 mt-1 leading-snug">{hotel.description}</p>
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar / Interactive Map */}
                  <div className="lg:col-span-4 space-y-8">
                    <div className="sticky top-24">
                      <div className="bg-brand-secondary p-1 rounded-sm border border-brand-primary/20 shadow-2xl">
                        <div className="bg-brand-dark border border-gray-700 p-4 mb-1">
                           <h3 className="font-serif font-bold text-white flex items-center gap-2">
                             <MapPin className="text-brand-primary" size={18} /> Interactive Map
                           </h3>
                        </div>
                        <div className="h-[400px] w-full bg-brand-dark relative group overflow-hidden">
                          {/* Replaced iframe with InteractiveMap */}
                          <InteractiveMap 
                             districts={DISTRICTS}
                             listings={LISTINGS}
                             selectedDistrictId={districtId}
                             className="w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };