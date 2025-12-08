import React, { useState } from 'react';
import { Logo } from './Logo';
import { ArrowRight } from 'lucide-react';

interface IntroScreenProps {
  onOpen: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onOpen }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleOpen = () => {
    setIsExiting(true);
    setTimeout(() => {
      onOpen();
    }, 1000); // Wait for animation
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
        isExiting ? 'opacity-0 -translate-y-full' : 'opacity-100'
      }`}
    >
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Upper_Kachura_Lake_Skardu.jpg/2560px-Upper_Kachura_Lake_Skardu.jpg" 
          alt="Intro Background" 
          className="w-full h-full object-cover scale-110 animate-pulse-slow" 
        />
        <div className="absolute inset-0 bg-brand-dark/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 animate-fade-in-up">
        <div className="mb-8 transform scale-150 origin-center">
          <Logo className="justify-center" />
        </div>
        
        <h2 className="text-2xl md:text-3xl text-gray-300 font-serif font-light tracking-widest mb-12 border-t border-b border-brand-primary/30 py-4 max-w-2xl mx-auto">
          WELCOME TO GILGIT BALTISTAN
        </h2>

        <button 
          onClick={handleOpen}
          className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden font-bold text-brand-dark transition-all duration-300 bg-brand-primary rounded-sm hover:bg-white hover:scale-105 shadow-[0_0_40px_rgba(212,175,55,0.3)]"
        >
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
          <span className="relative flex items-center gap-3 tracking-[0.3em] uppercase text-sm">
            Enter Experience <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.5em] animate-pulse">
          Explore The Majestic North
        </p>
      </div>
    </div>
  );
};