import React from 'react';
import { TimerPhase, TimerSettings } from '../types';

interface TimerDisplayProps {
  timeLeft: number;
  phase: TimerPhase;
  settings: TimerSettings;
  showBreathingGuide: boolean;
  phaseJustEnded: boolean;
}

const BreathingVisual: React.FC = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full animate-gradient-breathe"></div>
        <span className="text-white text-2xl font-semibold z-10 select-none">Breathe</span>
    </div>
);

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, phase, settings, showBreathingGuide, phaseJustEnded }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration =
    phase === TimerPhase.Focus
      ? settings.focusDuration * 60
      : phase === TimerPhase.ShortBreak
      ? settings.shortBreakDuration * 60
      : settings.longBreakDuration * 60;
  
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const circumference = 2 * Math.PI * 90; // 90 is radius
  const strokeDashoffset = circumference * (1 - progress);

  const isBreak = phase !== TimerPhase.Focus;

  return (
    <div className={`relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-8 rounded-full ${phaseJustEnded ? 'phase-end-flash-animation' : ''}`}>
      <svg className="absolute w-full h-full" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="90"
          strokeWidth="8"
          className="stroke-current text-gray-200 dark:text-gray-700"
          fill="none"
        />
        <circle
          cx="100"
          cy="100"
          r="90"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          className="stroke-current text-[var(--active-color)]"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 1s linear',
          }}
        />
      </svg>
      <div className="relative text-center w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-full">
        {isBreak && showBreathingGuide ? (
          <BreathingVisual />
        ) : (
          <div className="text-6xl sm:text-7xl font-bold tabular-nums text-[var(--active-color)]">
            {formatTime(timeLeft)}
          </div>
        )}
        <div className={`absolute bottom-16 sm:bottom-20 text-lg sm:text-xl font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-2`}>
          {phase}
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;