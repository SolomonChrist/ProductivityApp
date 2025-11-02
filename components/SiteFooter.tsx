import React from 'react';

const SiteFooter: React.FC = () => {
  return (
    <footer className="w-full mt-8 pt-4 border-t border-gray-300 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <a href="https://youtu.be/vihx2ZPvw0M?si=YpUdk4e71wlEiFh-" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--active-color)] transition-colors">
            AI Masterclass Level 1
          </a>
          <a href="https://youtu.be/rkIU6R6hPwE?si=BN4YpuWFlVeTzSOZ" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--active-color)] transition-colors">
            AI Masterclass Level 2 (n8n)
          </a>
        </div>
        <div className="flex flex-col space-y-1 text-right">
          <a href="https://www.skool.com/learn-automation/about" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--active-color)] transition-colors">
            AI + Automation Community
          </a>
          <a href="https://www.solomonchrist.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--active-color)] transition-colors">
            Solomon Christ Website
          </a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
