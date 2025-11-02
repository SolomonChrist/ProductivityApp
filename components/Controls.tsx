import React from 'react';
import { PlayIcon, PauseIcon } from './Icons';

interface ControlsProps {
  isActive: boolean;
  onStartPause: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isActive, onStartPause }) => {
  return (
    <div className="flex items-center justify-center">
      <button 
        onClick={onStartPause} 
        className="w-20 h-20 bg-[var(--active-color)] rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-105"
        aria-label={isActive ? "Pause timer" : "Start timer"}
      >
        {isActive ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
      </button>
    </div>
  );
};

export default Controls;
