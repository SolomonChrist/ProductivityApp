
import { FocusMode, TimerSettings } from './types';

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  timerStartSfx: 'https://cdn.pixabay.com/audio/2022/11/21/audio_1e37f053a9.mp3', // Gentle start chime
  timerEndSfx: 'https://cdn.pixabay.com/audio/2022/03/15/audio_731c31275b.mp3', // Bell sound
  breakMusic: 'https://cdn.pixabay.com/audio/2022/11/22/audio_8e945c43a2.mp3', // Gentle break music
};

export const POINTS_PER_POMODORO = 10;

export const FOCUS_MODES_CONFIG = {
  [FocusMode.DeepWork]: {
    color: 'deep-work',
    music: [
      'https://cdn.pixabay.com/audio/2022/02/16/audio_19ce3b7d76.mp3', // Binaural beats
      'https://cdn.pixabay.com/audio/2023/09/27/audio_78bc6e38b0.mp3', // Low frequency drone
    ],
  },
  [FocusMode.Study]: {
    color: 'study',
    music: [
      'https://cdn.pixabay.com/audio/2022/05/27/audio_1db76a9f73.mp3', // Lofi study
      'https://cdn.pixabay.com/audio/2024/04/08/audio_54a1a06734.mp3', // Soft piano
    ],
  },
  [FocusMode.Creativity]: {
    color: 'creativity',
    music: [
      'https://cdn.pixabay.com/audio/2023/04/17/audio_653c062a49.mp3', // Cinematic ambient
      'https://cdn.pixabay.com/audio/2022/06/10/audio_512b9666ab.mp3' // Electronic tones
    ],
  },
  [FocusMode.Custom]: {
    color: 'custom',
    music: [
      'https://cdn.pixabay.com/audio/2023/10/11/audio_a72c05e630.mp3', // Ambient soundscape
      'https://cdn.pixabay.com/audio/2024/05/28/audio_6789b94a6d.mp3' // Calm nature sounds
    ],
  }
};

export const THEME_CONFIG = {
    'CUSTOM Ambience 1': {
        color: 'ambience-1',
        music: ['https://cdn.pixabay.com/audio/2022/11/19/audio_b28735079a.mp3'],
    },
    'CUSTOM Ambience 2': {
        color: 'ambience-2',
        music: ['https://cdn.pixabay.com/audio/2023/09/20/audio_55e3372076.mp3'],
    },
    'CUSTOM Ambience 3': {
        color: 'ambience-3',
        music: ['https://cdn.pixabay.com/audio/2022/08/17/audio_2c87b59363.mp3'],
    }
};

export const ACHIEVEMENT_CONFIG = {
    'Cosmic Journey': {
        requirement: { type: 'points', value: 250 },
        color: 'cosmic',
        music: ['https://cdn.pixabay.com/audio/2022/01/21/audio_c3a44a71a5.mp3'],
    },
    'Zen Garden': {
        requirement: { type: 'streak', value: 10 },
        color: 'green-400',
        music: ['https://cdn.pixabay.com/audio/2022/08/02/audio_3925d74291.mp3'],
    }
};


export const ALL_SOUNDSCAPES = { ...FOCUS_MODES_CONFIG, ...THEME_CONFIG, ...ACHIEVEMENT_CONFIG };

export const BREAK_CONFIG = {
    color: 'break',
};