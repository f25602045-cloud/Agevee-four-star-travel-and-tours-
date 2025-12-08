import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Hide on mobile/touch devices
  if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) return null;

  return (
    <>
      <div 
        className={`fixed top-0 left-0 pointer-events-none z-[100] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        {/* Main Dot */}
        <div className="w-2 h-2 bg-brand-primary rounded-full -mt-1 -ml-1"></div>
      </div>
      
      <div 
        className={`fixed top-0 left-0 pointer-events-none z-[100] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        {/* Trailing Ring */}
        <div 
          className={`border border-brand-primary rounded-full -mt-4 -ml-4 transition-all duration-150 ease-out ${
            isPointer ? 'w-12 h-12 -mt-6 -ml-6 bg-brand-primary/10 border-brand-primary/50' : 'w-8 h-8 opacity-50'
          }`}
        ></div>
      </div>
    </>
  );
};