import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Map as MapIcon, Users, Building, Compass, UserCheck, Shield, Star, Award, ChevronDown } from 'lucide-react';
import { LiveDashboard } from '../components/LiveDashboard';
import { MountainDivider } from '../components/MountainDivider';
import { DISTRICTS } from '../services/mockData';

// Animated Counter Component
const CountUp: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasAnimated) {
            let start = 0;
            const increment = end / (duration / 16); // 60fps
            const timer = setInterval(() => {
              start += increment;
              if (start >= end) {
                setCount(end);
                clearInterval(timer);
                setHasAnimated(true);
              } else {
                setCount(Math.ceil(start));
              }
            }, 16);
          }
        },
        { threshold: 0.5 }
      );
  
      if (countRef.current) observer.observe(countRef.current);
      return () => observer.disconnect();
    }, [end, duration, hasAnimated]);
  
    return <span ref={countRef}>{count}{suffix}</span>;
  };

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-dark overflow-hidden">
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/d/1aFBu2T-MzmIdbF2BrlCoCg5ffInQXe6S" 
            alt="Gilgit Baltistan Majestic Landscape" 
            className="w-full h-full object-cover scale-105 animate-pulse-slow" 
            style={{ animationDuration: '40s' }}
          />
          {/* Enhanced Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-transparent to-brand-dark"></div>
          <div className="absolute inset-0 bg-brand-dark/30 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto w-full flex flex-col items-center animate-fade-in-up mt-10">
          <div className="mb-6 flex items-center gap-4">
             <div className="h-px w-12 md:w-20 bg-brand-primary/60"></div>
             <span className="text-brand-primary uppercase tracking-[0.4em] text-xs md:text-sm font-bold font-serif shadow-black drop-shadow-lg">The Jewel of Pakistan</span>
             <div className="h-px w-12 md:w-20 bg-brand-primary/60"></div>
          </div>
          
          <h1 className="text-5xl md:text-9xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl font-serif leading-[0.9] perspective-1000">
            <span className="block opacity-90 transform translate-z-10">DISCOVER</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-amber-100 to-brand-primary bg-[length:200%_auto] animate-pulse">THE NORTH</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-12 font-light max-w-2xl leading-relaxed drop-shadow-lg font-sans border-l-2 border-brand-primary pl-6 text-left bg-black/20 p-4 backdrop-blur-sm rounded-r-lg">
            Curating the finest experiences in Gilgit-Baltistan. 
            <span className="text-brand-primary font-semibold"> Agevee Four Star</span> connects you with premier hotels, expert guides, and verified agencies.
          </p>
          
          {/* Main 3 Options - Professional Layout with Hover Effects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {[
                { to: "/search?type=AGENCY", icon: <Compass size={28} />, title: "Premium Tours", desc: "Expeditions by verified agencies." },
                { to: "/search?type=GUIDE", icon: <UserCheck size={28} />, title: "Expert Guides", desc: "Local mountaineers & historians." },
                { to: "/register?type=TOURIST", icon: <Users size={28} />, title: "Travellers Club", desc: "Join our community of explorers." }
            ].map((item, idx) => (
                <Link 
                  key={idx}
                  to={item.to} 
                  className="bg-brand-secondary/40 backdrop-blur-md border border-white/10 p-8 rounded-sm hover:bg-brand-primary hover:text-brand-dark transition-all duration-500 group text-left relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-brand-primary group-hover:text-brand-dark transition-colors">{item.icon}</div>
                        <ArrowRight size={20} className="text-gray-500 group-hover:text-brand-dark group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-dark mb-2 font-serif transition-colors">{item.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed group-hover:text-brand-dark/80 transition-colors">
                        {item.desc}
                    </p>
                  </div>
                </Link>
            ))}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 animate-bounce">
          <ChevronDown className="text-brand-primary" />
        </div>
        
        {/* Mountain Divider at Bottom of Hero */}
        <div className="absolute bottom-0 w-full z-20">
             <MountainDivider />
        </div>
      </section>

      {/* Infinite Marquee Strip */}
      <div className="bg-brand-primary py-3 overflow-hidden relative z-30 shadow-2xl">
        <div className="whitespace-nowrap animate-marquee flex gap-12 text-brand-dark font-bold uppercase tracking-widest text-sm">
            <span>• The Jewel of Pakistan</span>
            <span>• Majestic Peaks</span>
            <span>• Crystal Lakes</span>
            <span>• Rich Heritage</span>
            <span>• Hospitality</span>
            <span>• Adventure Awaits</span>
            <span>• K2 Basecamp</span>
            <span>• Deosai Plains</span>
            <span>• The Jewel of Pakistan</span>
            <span>• Majestic Peaks</span>
            <span>• Crystal Lakes</span>
            <span>• Rich Heritage</span>
            <span>• Hospitality</span>
            <span>• Adventure Awaits</span>
        </div>
      </div>

      {/* Live Situation Dashboard - Moved Back Here */}
      <section className="bg-brand-secondary border-b border-white/5 relative z-20">
        <LiveDashboard />
      </section>

      {/* Trust & Credibility Section */}
      <section className="py-20 bg-brand-dark border-b border-white/5 relative">
         <div className="max-w-7xl mx-auto px-4 text-center mt-12">
            <h2 className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-8">Why Choose Agevee</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                   { icon: <Shield size={32} />, title: "Verified Partners", text: "Every hotel, agency, and guide is rigorously vetted for quality and safety standards." },
                   { icon: <Star size={32} />, title: "Premium Selection", text: "We curate only the finest accommodations and experiences for discerning travelers." },
                   { icon: <Award size={32} />, title: "Local Expertise", text: "Deeply rooted in the region, offering insights you won't find on generic platforms." }
               ].map((feature, i) => (
                   <div key={i} className="flex flex-col items-center group cursor-default">
                      <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-[0_0_0_rgba(212,175,55,0)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-shadow duration-500">
                         <div className="text-brand-primary group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                      </div>
                      <h3 className="text-white font-serif font-bold text-xl mb-3">{feature.title}</h3>
                      <p className="text-gray-400 text-sm max-w-xs leading-relaxed">{feature.text}</p>
                   </div>
               ))}
            </div>
         </div>
      </section>

      {/* Creative Stats Strip */}
      <section className="py-24 bg-brand-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        {/* Abstract Background Shapes */}
        <div className="absolute -left-20 top-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 bottom-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
          {[
            { icon: <MapIcon size={24} />, label: "Districts Covered", value: 10, suffix: "+" },
            { icon: <Building size={24} />, label: "Luxury Stays", value: 500, suffix: "+" },
            { icon: <Users size={24} />, label: "Certified Guides", value: 200, suffix: "+" },
            { icon: <Compass size={24} />, label: "Expeditions", value: 1000, suffix: "+" }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="text-brand-primary mb-4 opacity-50 group-hover:opacity-100 transition">{stat.icon}</div>
              <h3 className="text-5xl font-serif font-bold text-white mb-2">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-gray-500 uppercase tracking-[0.2em] text-[10px] font-bold border-t border-brand-primary/20 pt-2 w-full">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Regions (Updated to show ALL districts) */}
      <section className="py-24 bg-brand-dark relative z-20">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <div className="inline-block mb-4">
             <Star className="w-8 h-8 text-brand-primary mx-auto mb-2" />
             <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">Curated Regions</h2>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore the most breathtaking destinations handpicked for their natural beauty, historical significance, and premium hospitality.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
           {DISTRICTS.map((district, i) => (
             <Link key={district.id} to={`/explore?id=${district.id}`} className="group relative h-[500px] w-full perspective-1000 block">
                <div className="relative w-full h-full transition-all duration-700 preserve-3d group-hover:rotate-y-12 shadow-2xl border border-white/5 rounded-sm overflow-hidden">
                   <div className="absolute inset-0">
                      <img src={district.image} alt={district.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-90"></div>
                   </div>
                   
                   <div className="absolute bottom-0 left-0 p-8 w-full translate-z-20">
                      <h3 className="text-3xl font-serif font-bold text-white mb-2">{district.name}</h3>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{district.description}</p>
                      <div className="flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-xs">
                         Explore <ArrowRight size={16} />
                      </div>
                   </div>
                </div>
             </Link>
           ))}
        </div>
        
        <div className="text-center mt-16">
            <Link to="/explore" className="inline-flex items-center gap-2 border border-brand-primary text-brand-primary px-8 py-3 rounded-sm hover:bg-brand-primary hover:text-brand-dark transition font-bold uppercase tracking-widest text-sm">
               View All Destinations
            </Link>
        </div>
      </section>

      {/* CTA Registration - High End Creative */}
      <section className="py-32 relative overflow-hidden bg-white">
        {/* Creative Polygon Background */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gray-100 -skew-x-12 translate-x-32 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-2/3">
            <div className="inline-block bg-brand-primary px-3 py-1 mb-6 text-brand-dark font-bold text-xs uppercase tracking-widest">For Business Owners</div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-brand-dark mb-6 leading-none">
              Partner With <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-amber-600">Agevee</span>
            </h2>
            <p className="text-xl text-brand-secondary/80 font-medium max-w-xl leading-relaxed border-l-4 border-brand-primary pl-6">
              Elevate your business by joining the premier tourism network of Gilgit-Baltistan. 
              We connect world-class service providers with discerning travelers.
            </p>
          </div>
          <div>
            <Link 
                to="/register?type=HOTEL" 
                className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden font-bold text-white transition-all duration-300 bg-brand-dark rounded-sm hover:bg-brand-secondary shadow-2xl"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-brand-primary"></span>
              <span className="relative uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                Register Business <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};