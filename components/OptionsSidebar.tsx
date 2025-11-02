import React from 'react';
import { FocusMode, Stats, TimerSettings } from '../types';
import { MusicIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import StatsDisplay from './StatsDisplay';
import Settings from './Settings';
import SiteFooter from './SiteFooter';

interface OptionsSidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    focusMode: FocusMode;
    setFocusMode: (mode: FocusMode) => void;
    focusVolume: number;
    setFocusVolume: (volume: number) => void;
    musicConfig: any;
    activeAmbienceKey: string | null;
    handleAmbienceClick: (themeName: string) => void;
    ambientVolume: number;
    setAmbientVolume: (volume: number) => void;
    setIsMusicModalOpen: (isOpen: boolean) => void;
    stats: Stats;
    settings: TimerSettings;
    setSettings: (settings: TimerSettings) => void;
    showBreathingGuide: boolean;
    setShowBreathingGuide: (enabled: boolean) => void;
    onReset: () => void;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const OptionsSidebar: React.FC<OptionsSidebarProps> = ({
    isSidebarOpen, toggleSidebar,
    focusMode, setFocusMode, focusVolume, setFocusVolume,
    musicConfig, activeAmbienceKey, handleAmbienceClick, ambientVolume, setAmbientVolume,
    setIsMusicModalOpen,
    stats,
    settings, setSettings, showBreathingGuide, setShowBreathingGuide, onReset, onExport, onImport
}) => {
    return (
        <aside className={`w-full bg-gray-200 dark:bg-gray-900/50 flex-shrink-0 flex flex-col lg:h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'p-6' : 'p-4 items-center'}`}>
            {isSidebarOpen ? (
                // EXPANDED VIEW
                <>
                    <div className="flex justify-end mb-2">
                        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/50" aria-label="Collapse sidebar">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="space-y-8 flex-grow lg:overflow-y-auto">
                        <div>
                            <div className="text-center mb-4">
                                <h2 className="text-xl font-bold">Focus Soundscape</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Select main audio for focus.</p>
                            </div>
                            <div className="w-full max-w-xs mx-auto px-4 mb-4">
                                <input
                                    type="range" min="0" max="1" step="0.01" value={focusVolume}
                                    onChange={(e) => setFocusVolume(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    aria-label="Focus volume"
                                />
                            </div>
                            <div className='flex items-center flex-wrap justify-center gap-2 sm:gap-4'>
                                {Object.values(FocusMode).map(mode => (
                                    <button key={mode} onClick={() => setFocusMode(mode)} className={`px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition ${focusMode === mode ? 'bg-[var(--active-color)] text-white' : 'bg-white/20 dark:bg-gray-800/50'}`}>
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="text-center mt-6 mb-4">
                                <h2 className="text-xl font-bold">Ambient Sound Layer</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Optionally, add a background sound.</p>
                            </div>
                            <div className="w-full max-w-xs mx-auto px-4 mb-4">
                                <input
                                    type="range" min="0" max="1" step="0.01" value={ambientVolume}
                                    onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    aria-label="Ambient volume"
                                />
                            </div>
                            <div className='flex items-center flex-wrap justify-center gap-2 sm:gap-4'>
                                {Object.keys(musicConfig.themes).map(themeName => (
                                    <button key={themeName} onClick={() => handleAmbienceClick(themeName)} className={`px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition ${activeAmbienceKey === themeName ? 'bg-[var(--active-color)] text-white' : 'bg-white/20 dark:bg-gray-800/50'}`}>
                                        {themeName.replace('CUSTOM ', '')}
                                    </button>
                                ))}
                                <button onClick={() => setIsMusicModalOpen(true)} className='p-2 rounded-full bg-white/20 dark:bg-gray-800/50' aria-label="Music settings">
                                    <MusicIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        
                        <StatsDisplay stats={stats} />

                        <Settings 
                            settings={settings} 
                            setSettings={setSettings} 
                            showBreathingGuide={showBreathingGuide} 
                            setShowBreathingGuide={setShowBreathingGuide} 
                            onReset={onReset}
                            onExport={onExport}
                            onImport={onImport}
                        />
                    </div>
                    <div className="mt-8 flex-shrink-0">
                         <SiteFooter />
                    </div>
                </>
            ) : (
                // COLLAPSED VIEW
                <div className="flex justify-center items-center h-full">
                    <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/50" aria-label="Expand sidebar">
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                </div>
            )}
        </aside>
    );
};

export default OptionsSidebar;