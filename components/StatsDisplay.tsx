import React from 'react';
import { Stats } from '../types';

interface StatsDisplayProps {
  stats: Stats;
}

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-white/5 dark:bg-gray-700/30 rounded-lg text-center">
    <div className="text-2xl font-bold text-[var(--active-color)]">{value}</div>
    <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mt-1">{label}</div>
  </div>
);

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  const formatTotalTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Today's Stats</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Focus Time" value={formatTotalTime(stats.totalFocusTime)} />
        <StatCard label="Pomodoros" value={stats.completedPomodoros} />
        <StatCard label="Streak" value={stats.streak} />
        <StatCard label="Points" value={stats.points} />
      </div>
    </div>
  );
};

export default StatsDisplay;
