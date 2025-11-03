import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import TimerDisplay from './components/TimerDisplay';
import Controls from './components/Controls';
import TaskList from './components/TaskList';
import MusicSettingsModal from './components/MusicSettingsModal';
import OptionsSidebar from './components/OptionsSidebar';
import { TimerSettings, TimerPhase, Stats, Task, FocusMode, CustomMusicConfig } from './types';
import { DEFAULT_TIMER_SETTINGS, FOCUS_MODES_CONFIG, BREAK_CONFIG, POINTS_PER_POMODORO, THEME_CONFIG } from './constants';

const getInitialTheme = (): boolean => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('theme');
        if (storedPrefs === 'dark') return true;
        if (storedPrefs === 'light') return false;

        const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
        return userMedia.matches;
    }
    return true; // Default to dark
};


// Helper to merge default and custom music configs
const mergeMusicConfigs = (): any => {
    const defaults = {
        focusModes: FOCUS_MODES_CONFIG,
        themes: THEME_CONFIG
    };
    const custom = JSON.parse(localStorage.getItem('customMusicConfig') || '{}');
    
    // Deep merge
    const merged = JSON.parse(JSON.stringify(defaults)); // Deep copy
    if (custom.focusModes) {
        for (const key in custom.focusModes) {
            if (merged.focusModes[key] && custom.focusModes[key].music) {
                merged.focusModes[key].music = [custom.focusModes[key].music];
            }
        }
    }
    if (custom.themes) {
        for (const key in custom.themes) {
            if (merged.themes[key] && custom.themes[key].music) {
                merged.themes[key].music = [custom.themes[key].music];
            }
        }
    }
    return merged;
};


const App: React.FC = () => {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const savedSettings = localStorage.getItem('timerSettings');
    return savedSettings ? { ...DEFAULT_TIMER_SETTINGS, ...JSON.parse(savedSettings) } : DEFAULT_TIMER_SETTINGS;
  });
  
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [phase, setPhase] = useState<TimerPhase>(TimerPhase.Focus);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [stats, setStats] = useState<Stats>(() => {
    const savedStats = localStorage.getItem('stats');
    return savedStats ? JSON.parse(savedStats) : { completedPomodoros: 0, totalFocusTime: 0, streak: 0, points: 0 };
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [focusMode, setFocusMode] = useState<FocusMode>(FocusMode.DeepWork);
  const [activeAmbienceKey, setActiveAmbienceKey] = useState<string | null>(null);
  const [showBreathingGuide, setShowBreathingGuide] = useState(true);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [musicConfig, setMusicConfig] = useState(mergeMusicConfigs);
  const [phaseJustEnded, setPhaseJustEnded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [focusVolume, setFocusVolume] = useState(1);
  const [ambientVolume, setAmbientVolume] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const ambienceAudioRef = useRef<HTMLAudioElement>(null);
  const sfxRef = useRef<HTMLAudioElement>(null);

  // Effect for managing theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (getInitialTheme()) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
  }, []);

  const getNextPhase = useCallback((): { nextPhase: TimerPhase, nextDuration: number } => {
    if (phase === TimerPhase.Focus) {
      const newSessionCount = sessionCount + 1;
      if (newSessionCount > 0 && newSessionCount % settings.sessionsBeforeLongBreak === 0) {
        return { nextPhase: TimerPhase.LongBreak, nextDuration: settings.longBreakDuration * 60 };
      }
      return { nextPhase: TimerPhase.ShortBreak, nextDuration: settings.shortBreakDuration * 60 };
    }
    return { nextPhase: TimerPhase.Focus, nextDuration: settings.focusDuration * 60 };
  }, [phase, sessionCount, settings]);

  const resetTimerToPhase = useCallback((p: TimerPhase, duration: number) => {
      setPhase(p);
      setTimeLeft(duration);
  }, []);

  const handlePhaseEnd = useCallback(async () => {
    setPhaseJustEnded(true);
    setTimeout(() => setPhaseJustEnded(false), 1000);

    if (phase === TimerPhase.Focus) {
        setStats(prevStats => ({
            ...prevStats,
            completedPomodoros: prevStats.completedPomodoros + 1,
            streak: prevStats.streak + 1,
            points: prevStats.points + POINTS_PER_POMODORO
        }));
        if (sfxRef.current && settings.timerEndSfx) {
            sfxRef.current.src = settings.timerEndSfx;
            sfxRef.current.play().catch(e => console.error("End SFX failed:", e));
        }
    } else { // End of a break
        if (sfxRef.current && settings.timerStartSfx) {
            sfxRef.current.src = settings.timerStartSfx;
            sfxRef.current.load();
            sfxRef.current.play().catch(e => console.error("Start SFX failed:", e));
        }
    }
    
    setSessionCount(prev => phase === TimerPhase.Focus ? prev + 1 : prev);
    
    const { nextPhase, nextDuration } = getNextPhase();
    resetTimerToPhase(nextPhase, nextDuration);
    setIsActive(true); // Auto-start next phase
  }, [phase, settings, getNextPhase, resetTimerToPhase]);


  useEffect(() => {
    let interval: ReturnType<typeof setTimeout> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        if (phase === TimerPhase.Focus) {
            setStats(prevStats => ({...prevStats, totalFocusTime: prevStats.totalFocusTime + 1}));
        }
      }, 1000);
    } else if (isActive && timeLeft <= 0) {
      handlePhaseEnd();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, phase, handlePhaseEnd]);

  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // This effect updates the timer if settings are changed WHILE the timer is paused.
  // It no longer depends on `isActive`, preventing the reset-on-pause bug.
  useEffect(() => {
    if (!isActive) {
      const newDuration =
        phase === TimerPhase.Focus ? settings.focusDuration * 60
        : phase === TimerPhase.ShortBreak ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60;
      setTimeLeft(newDuration);
    }
  }, [settings.focusDuration, settings.shortBreakDuration, settings.longBreakDuration, phase, setTimeLeft]);


  // Volume effects
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = focusVolume;
    }
  }, [focusVolume]);

  useEffect(() => {
    if (ambienceAudioRef.current) {
        ambienceAudioRef.current.volume = ambientVolume;
    }
  }, [ambientVolume]);


  // Main music effect
  useEffect(() => {
    const isFocus = phase === TimerPhase.Focus;
    const colorKey = isFocus ? musicConfig.focusModes[focusMode]?.color : BREAK_CONFIG.color;
    if(colorKey) {
      document.documentElement.style.setProperty('--active-color', `var(--${colorKey})`);
    }

    if (audioRef.current) {
        audioRef.current.volume = focusVolume;
        let musicSrc = '';
        if (isFocus) {
            const soundSource = musicConfig.focusModes[focusMode];
            if (soundSource) {
                const music = soundSource.music;
                musicSrc = Array.isArray(music) ? music[0] : music;
            }
        } else {
            musicSrc = settings.breakMusic;
        }

        if (musicSrc && audioRef.current.src !== musicSrc) {
            audioRef.current.src = musicSrc;
        }
        
        if (isActive && musicSrc) {
            audioRef.current.play().catch(e => console.error("Main audio play failed:", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [phase, focusMode, isActive, musicConfig, settings.breakMusic, focusVolume]);

  // Ambience music effect
  useEffect(() => {
    if (ambienceAudioRef.current) {
        ambienceAudioRef.current.volume = ambientVolume;
        if (activeAmbienceKey && isActive) {
            const soundSource = musicConfig.themes[activeAmbienceKey];
            if (soundSource) {
                const music = soundSource.music;
                const musicSrc = Array.isArray(music) ? music[0] : music;
                if (musicSrc && ambienceAudioRef.current.src !== musicSrc) {
                    ambienceAudioRef.current.src = musicSrc;
                }
                ambienceAudioRef.current.play().catch(e => console.error("Ambience audio play failed:", e));
            }
        } else {
            ambienceAudioRef.current.pause();
        }
    }
  }, [activeAmbienceKey, musicConfig, isActive, ambientVolume]);


  const handleStartPause = () => {
    if (!isActive && sfxRef.current && settings.timerStartSfx) { // On Play
        sfxRef.current.src = settings.timerStartSfx;
        sfxRef.current.play().catch(e => console.error("Start SFX failed:", e));
    }
    if (!isActive && timeLeft <= 0) {
        const duration = phase === TimerPhase.Focus ? settings.focusDuration * 60 :
                         phase === TimerPhase.ShortBreak ? settings.shortBreakDuration * 60 :
                         settings.longBreakDuration * 60;
        setTimeLeft(duration);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    if(window.confirm('Are you sure you want to reset the timer and stats for today?')) {
        setIsActive(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (ambienceAudioRef.current) {
            ambienceAudioRef.current.pause();
            ambienceAudioRef.current.currentTime = 0;
        }
        setActiveAmbienceKey(null);
        setPhase(TimerPhase.Focus);
        setTimeLeft(settings.focusDuration * 60);
        setSessionCount(0);
        setStats({ completedPomodoros: 0, totalFocusTime: 0, streak: 0, points: 0 });
    }
  }

  const handleResetAllData = () => {
    if (window.confirm('Are you sure you want to reset all data? This will erase all settings, stats, and tasks permanently.')) {
        localStorage.clear();
        window.location.reload();
    }
  };
  
  const handlePhaseSwitch = (newPhase: TimerPhase) => {
    setIsActive(false);
    if (audioRef.current) {
        audioRef.current.pause();
    }
    if (ambienceAudioRef.current) {
      ambienceAudioRef.current.pause();
    }
    setPhase(newPhase);
    let newDuration;
    switch (newPhase) {
        case TimerPhase.Focus:
            newDuration = settings.focusDuration * 60;
            break;
        case TimerPhase.ShortBreak:
            newDuration = settings.shortBreakDuration * 60;
            break;
        case TimerPhase.LongBreak:
            newDuration = settings.longBreakDuration * 60;
            break;
        default:
            newDuration = settings.focusDuration * 60;
    }
    setTimeLeft(newDuration);
  };
  
  const handleAmbienceClick = (themeName: string) => {
    setActiveAmbienceKey(prev => prev === themeName ? null : themeName);
  };

  const addTask = (text: string) => {
    if (text.trim()) {
        const newTask: Task = { id: Date.now(), text, completed: false };
        setTasks([...tasks, newTask]);
    }
  };
  
  const deleteTask = (id: number) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== id));
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };
  
  const handleSaveMusicSettings = (customConfig: CustomMusicConfig) => {
    localStorage.setItem('customMusicConfig', JSON.stringify(customConfig));
    setMusicConfig(mergeMusicConfigs());
    setIsMusicModalOpen(false);
  }
  
  const handleExport = () => {
    const fullCustomMusicConfig: CustomMusicConfig = {
        focusModes: {},
        themes: {}
    };

    Object.keys(musicConfig.focusModes).forEach(key => {
        fullCustomMusicConfig.focusModes[key] = {
            music: musicConfig.focusModes[key].music[0] || ''
        };
    });

    Object.keys(musicConfig.themes).forEach(key => {
        fullCustomMusicConfig.themes[key] = {
            music: musicConfig.themes[key].music[0] || ''
        };
    });

    const data = {
        settings,
        stats,
        tasks,
        customMusicConfig: fullCustomMusicConfig,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solomon-christ-ai-app-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const text = e.target?.result;
              if (typeof text !== 'string') return;
              const data = JSON.parse(text);

              if (data.settings) {
                  const newSettings = { ...DEFAULT_TIMER_SETTINGS, ...data.settings };
                  setSettings(newSettings);
                  localStorage.setItem('timerSettings', JSON.stringify(newSettings));
              }
              if (data.stats) {
                  setStats(data.stats);
                  localStorage.setItem('stats', JSON.stringify(data.stats));
              }
              if (data.tasks) {
                  setTasks(data.tasks);
                  localStorage.setItem('tasks', JSON.stringify(data.tasks));
              }
              if (data.customMusicConfig) {
                  localStorage.setItem('customMusicConfig', JSON.stringify(data.customMusicConfig));
                  setMusicConfig(mergeMusicConfigs()); // Reruns merge logic with new localStorage data
              }
              
              alert('Settings imported successfully!');

          } catch (error) {
              console.error("Failed to import settings:", error);
              alert('Failed to import settings. Please check the file format.');
          }
      };
      reader.readAsText(file);
      // Reset file input value to allow re-importing the same file
      event.target.value = '';
  };

  return (
    <div className={`bg-gray-100 dark:bg-gray-900 transition-colors duration-500 theme-${phase === TimerPhase.Focus ? musicConfig.focusModes[focusMode]?.color : BREAK_CONFIG.color}`}>
        <div className="flex flex-col lg:flex-row min-h-screen font-sans text-gray-800 dark:text-gray-200">
            <div className={`order-3 lg:order-1 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'lg:w-[30%]' : 'lg:w-16'}`}>
                <OptionsSidebar
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    focusMode={focusMode}
                    setFocusMode={setFocusMode}
                    focusVolume={focusVolume}
                    setFocusVolume={setFocusVolume}
                    musicConfig={musicConfig}
                    activeAmbienceKey={activeAmbienceKey}
                    handleAmbienceClick={handleAmbienceClick}
                    ambientVolume={ambientVolume}
                    setAmbientVolume={setAmbientVolume}
                    setIsMusicModalOpen={setIsMusicModalOpen}
                    stats={stats}
                    settings={settings}
                    setSettings={setSettings}
                    showBreathingGuide={showBreathingGuide}
                    setShowBreathingGuide={setShowBreathingGuide}
                    onReset={handleReset}
                    onResetAllData={handleResetAllData}
                    onExport={handleExport}
                    onImport={handleImport}
                />
            </div>
            
            <main className="order-1 lg:order-2 flex-grow flex flex-col items-center justify-center p-4 lg:p-8 relative">
                <div className="w-full max-w-md mx-auto flex flex-col items-center">
                    <Header />

                    <div className="text-center mt-8 mb-2">
                      <h2 className="text-md font-semibold">Timer Mode</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Switch between focus and break.</p>
                    </div>
                    <div className="flex justify-center items-center space-x-4 mb-4">
                        {Object.values(TimerPhase).map((p) => (
                            <button
                                key={p}
                                onClick={() => handlePhaseSwitch(p)}
                                className={`px-3 py-1 text-sm rounded-full transition ${phase === p ? 'bg-white/30 dark:bg-gray-700/80 font-semibold' : 'hover:bg-white/20 dark:hover:bg-gray-800/60'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    
                    <TimerDisplay timeLeft={timeLeft} phase={phase} settings={settings} showBreathingGuide={showBreathingGuide} phaseJustEnded={phaseJustEnded} />
                    <Controls isActive={isActive} onStartPause={handleStartPause} />
                </div>
            </main>

            <div className="order-2 lg:order-3 lg:w-[20%] flex-shrink-0">
                <TaskList tasks={tasks} addTask={addTask} toggleTask={toggleTask} deleteTask={deleteTask} />
            </div>
        </div>

      <audio ref={audioRef} loop />
      <audio ref={ambienceAudioRef} loop />
      <audio ref={sfxRef} />
      <MusicSettingsModal 
        isOpen={isMusicModalOpen} 
        onClose={() => setIsMusicModalOpen(false)}
        onSave={handleSaveMusicSettings}
        defaultConfigs={{ focusModes: FOCUS_MODES_CONFIG, themes: THEME_CONFIG }}
      />
    </div>
  );
};

export default App;