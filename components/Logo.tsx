import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Container */}
      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
        {/* Outer Ring Segments (Gold) */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-primary border-b-brand-primary opacity-80 rotate-12"></div>
        <div className="absolute inset-[2px] rounded-full border-2 border-transparent border-l-brand-primary border-r-brand-primary opacity-40 -rotate-12"></div>
        
        {/* Main 4-Point Star (White/Light on Dark) */}
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-white relative z-10 drop-shadow-md" fill="currentColor">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
        
        {/* Center Detail (Gold) */}
        <div className="absolute w-2 h-2 bg-brand-primary rounded-full z-20 shadow-sm"></div>

        {/* 4 Small Stars (Gold) */}
        <div className="absolute top-1 left-2 text-[8px] text-brand-primary animate-pulse">★</div>
        <div className="absolute top-1 right-2 text-[8px] text-brand-primary animate-pulse delay-75">★</div>
        <div className="absolute bottom-1 right-2 text-[8px] text-brand-primary animate-pulse delay-150">★</div>
        <div className="absolute bottom-1 left-2 text-[8px] text-brand-primary animate-pulse delay-300">★</div>
      </div>
      
      {/* Text Container */}
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl font-black tracking-widest text-white leading-none font-sans drop-shadow-md">
          AGEVEE
        </h1>
        <div className="flex items-center justify-between w-full border-t border-brand-primary/30 mt-1 pt-0.5">
          <span className="text-[0.6rem] font-bold tracking-[0.2em] text-brand-primary uppercase whitespace-nowrap">
            Travel & Tours
          </span>
        </div>
      </div>
    </div>
  );
};