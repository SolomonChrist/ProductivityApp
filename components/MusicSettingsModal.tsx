import React, { useState, useEffect } from 'react';
import { CustomMusicConfig } from '../types';

interface MusicSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customConfig: CustomMusicConfig) => void;
  defaultConfigs: {
    focusModes: any;
    themes: any;
  }
}

const MusicSettingsModal: React.FC<MusicSettingsModalProps> = ({ isOpen, onClose, onSave, defaultConfigs }) => {
  const [customConfig, setCustomConfig] = useState<CustomMusicConfig>({ focusModes: {}, themes: {} });

  useEffect(() => {
    if (isOpen) {
      const savedConfig = JSON.parse(localStorage.getItem('customMusicConfig') || '{}');
      setCustomConfig(savedConfig);
    }
  }, [isOpen]);

  const handleInputChange = (category: 'focusModes' | 'themes', name: string, value: string) => {
    setCustomConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: { music: value }
      }
    }));
  };

  const handleSave = () => {
    onSave(customConfig);
  };
  
  const getInputValue = (category: 'focusModes' | 'themes', name: string) => {
    // Return custom URL if it exists, otherwise return empty string to show placeholder
    return customConfig[category]?.[name]?.music || '';
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Music Settings</h2>
          <button onClick={onClose} className="text-2xl font-light text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">&times;</button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">Focus Modes</h3>
            <div className="space-y-4">
              {Object.entries(defaultConfigs.focusModes).map(([key, config]: [string, any]) => (
                <div key={key}>
                  <label htmlFor={`focus-${key}`} className="text-sm font-medium text-gray-600 dark:text-gray-400">{key}</label>
                  <input
                    id={`focus-${key}`}
                    type="url"
                    value={getInputValue('focusModes', key)}
                    onChange={(e) => handleInputChange('focusModes', key, e.target.value)}
                    placeholder={`Default: ${config.music[0].substring(0, 50)}...`}
                    className="mt-1 w-full bg-gray-200 dark:bg-gray-700 border-none rounded-md p-2 focus:ring-2 focus:ring-[var(--active-color)] text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">Ambient Themes</h3>
            <div className="space-y-4">
              {Object.entries(defaultConfigs.themes).map(([key, config]: [string, any]) => (
                <div key={key}>
                  <label htmlFor={`theme-${key}`} className="text-sm font-medium text-gray-600 dark:text-gray-400">{key}</label>
                  <input
                    id={`theme-${key}`}
                    type="url"
                    value={getInputValue('themes', key)}
                    onChange={(e) => handleInputChange('themes', key, e.target.value)}
                    placeholder={`Default: ${config.music[0].substring(0, 50)}...`}
                    className="mt-1 w-full bg-gray-200 dark:bg-gray-700 border-none rounded-md p-2 focus:ring-2 focus:ring-[var(--active-color)] text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-[var(--active-color)] text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicSettingsModal;