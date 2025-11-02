
import React from 'react';

const BreathingAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full bg-blue-500/20 animate-breathe"></div>
        <div className="absolute w-2/3 h-2/3 rounded-full bg-blue-500/30 animate-breathe" style={{ animationDelay: '-1s' }}></div>
        <div className="absolute w-1/3 h-1/3 rounded-full bg-blue-500/40 animate-breathe" style={{ animationDelay: '-2s' }}></div>
        <span className="text-white z-10">Breathe</span>
    </div>
  );
};

export default BreathingAnimation;
