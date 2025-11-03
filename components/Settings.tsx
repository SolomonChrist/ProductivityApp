import React, { useRef, useState, useEffect } from 'react';
import { TimerSettings } from '../types';
import Tooltip from './Tooltip';

interface SettingsProps {
  settings: TimerSettings;
  setSettings: (settings: TimerSettings) => void;
  showBreathingGuide: boolean;
  setShowBreathingGuide: (enabled: boolean) => void;
  onReset: () => void;
  onResetAllData: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, showBreathingGuide, setShowBreathingGuide, onReset, onResetAllData, onExport, onImport }) => {
  const importInputRef = useRef<HTMLInputElement>(null);

  // Use local state for string-based input values to provide a stable editing experience
  const [inputValues, setInputValues] = useState({
      focusDuration: String(settings.focusDuration),
      shortBreakDuration: String(settings.shortBreakDuration),
      longBreakDuration: String(settings.longBreakDuration),
      sessionsBeforeLongBreak: String(settings.sessionsBeforeLongBreak),
  });

  // Sync local state if parent state changes (e.g., from an import or adaptive mode)
  useEffect(() => {
      setInputValues({
          focusDuration: String(settings.focusDuration),
          shortBreakDuration: String(settings.shortBreakDuration),
          longBreakDuration: String(settings.longBreakDuration),
          sessionsBeforeLongBreak: String(settings.sessionsBeforeLongBreak),
      });
  }, [settings]);

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      // Allow only digits to be entered
      if (/^\d*$/.test(value)) {
          setInputValues({ ...inputValues, [name]: value });
      }
  };

  const handleNumericBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      let numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue < 1) {
          numValue = 1; // Default to 1 if empty or invalid
      }
      // Update parent state with the clean, parsed number
      setSettings({ ...settings, [name]: numValue });
  };
  
  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSettings({ ...settings, [name]: value });
  };
  
  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const Toggle = ({ label, id, checked, onChange, tooltipText }: { label: string; id: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, tooltipText: string }) => (
    <Tooltip text={tooltipText}>
        <label htmlFor={id} className="flex items-center cursor-pointer">
          <span className="text-sm font-medium mr-3">{label}</span>
          <div className="relative">
            <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={onChange} />
            <div className={`block w-10 h-6 rounded-full transition ${checked ? 'bg-[var(--active-color)]' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </label>
    </Tooltip>
  );

  return (
    <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Timer Settings</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label htmlFor="focusDuration" className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">Focus (min)</label>
          <input id="focusDuration" name="focusDuration" type="text" pattern="\d*" value={inputValues.focusDuration} onChange={handleNumericChange} onBlur={handleNumericBlur} className="w-full bg-gray-200 dark:bg-gray-700 border-none rounded-md p-2 focus:ring-2 focus:ring-[var(--active-color)]" />
        </div>
        <div>
          <label htmlFor="shortBreakDuration" className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">Short Break</label>
          <input id="shortBreakDuration" name="shortBreakDuration" type="text" pattern="\d*" value={inputValues.shortBreakDuration} onChange={handleNumericChange} onBlur={handleNumericBlur} className="w-full bg-gray-200 dark:bg-gray-700 border-none rounded-md p-2 focus:ring-2 focus:ring-[var(--active-color)]" />
        </div>
        <div>
          <label htmlFor="longBreakDuration" className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">Long Break</label>
          <input id="longBreakDuration" name="longBreakDuration" type="text" pattern="\d*" value={inputValues.longBreakDuration} onChange={handleNumericChange} onBlur={handleNumericBlur} className="w-full bg-gray-200 dark:bg-gray-700 border-none rounded-md p-2 focus:ring-2 focus:ring-[var(--active-color)]" />
        </div>
        <Tooltip text="The number of focus sessions to complete before a long break starts.">
            <div>
              <label htmlFor="sessionsBeforeLongBreak" className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">Sessions Cycle</label>
              <input id="sessionsBeforeLongBreak" name="sessionsBeforeLongBreak" type="text" pattern="\d*" value={inputValues.sessionsBeforeLongBreak} onChange={handleNumericChange} onBlur={handleNumericBlur} className="w-full bg-gray-200 dark:bg-gray-700 border-none rounded-md p-2 focus:ring-2 focus:ring-[var(--active-color)]" />
            </div>
        </Tooltip>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
         <div>
          <label htmlFor="timerStartSfx" className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">Timer Start Sound (URL)</label>
          <input id="timerStartSfx" name="timerStartSfx" type="url" value={settings.timerStartSfx} onChange={handleSfxChange} placeholder="Enter .mp3 URL" className="w-full bg-gray-200 dark:bg-gray-700 border-none rounded-md p-2 focus:ring-2 focus:ring-[var(--active-color)]" />
        </div>
        <div>
          <label htmlFor="timerEndSfx" className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">Timer End Sound (URL)</label>
          <input id="timerEndSfx" name="timerEndSfx" type="url" value={settings.timerEndSfx} onChange={handleSfxChange} placeholder="Enter .mp3 URL" className="w-full bg-gray-200 dark:bg-gray-700 border-none rounded-md p-2 focus:ring-2 focus:ring-[var(--active-color)]" />
        </div>
      </div>
      <div className="mb-6">
          <label htmlFor="breakMusic" className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 block">Break & Breathing Music (URL)</label>
          <input id="breakMusic" name="breakMusic" type="url" value={settings.breakMusic} onChange={handleSfxChange} placeholder="Enter .mp3 URL" className="w-full bg-gray-200 dark:bg-gray-700 border-none rounded-md p-2 focus:ring-2 focus:ring-[var(--active-color)]" />
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 space-y-4 sm:space-y-0">
        <div className='flex items-center space-x-6'>
            <Toggle label="Breathing" id="breathingGuide" checked={showBreathingGuide} onChange={(e) => setShowBreathingGuide(e.target.checked)} tooltipText="Show a visual breathing guide during breaks to help you relax." />
        </div>
        <div className="flex items-center flex-wrap justify-end gap-2">
            <button onClick={handleImportClick} className="text-sm font-medium px-3 py-1.5 rounded-md bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition">Import</button>
            <input type="file" ref={importInputRef} onChange={onImport} accept=".json" className="hidden" />
            <button onClick={onExport} className="text-sm font-medium px-3 py-1.5 rounded-md bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition">Export</button>
            <button onClick={onReset} className="text-sm font-medium text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition">Reset Timer</button>
            <button onClick={onResetAllData} className="text-sm font-medium text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition">Reset Data</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;