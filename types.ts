
export interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  timerStartSfx: string;
  timerEndSfx: string;
  breakMusic: string;
}

export enum FocusMode {
  DeepWork = 'Deep Work',
  Study = 'Study',
  Creativity = 'Creativity',
  Custom = 'CUSTOM',
}

export enum TimerPhase {
  Focus = 'Focus',
  ShortBreak = 'Short Break',
  LongBreak = 'Long Break',
}

export interface Stats {
  completedPomodoros: number;
  totalFocusTime: number; // in seconds
  streak: number;
  points: number;
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

// Type for a single soundscape configuration
export interface Soundscape {
    color: string;
    music: string | string[];
}

// Type for the structure of all music configurations
export interface MusicConfig {
    [key: string]: Soundscape;
}

// Type for user-overrides stored in localStorage
export type CustomMusicConfig = {
    [category: string]: {
        [name: string]: {
            music?: string;
        }
    }
};