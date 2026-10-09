import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeSwitcherProps {
  className?: string;
  variant?: 'capsule' | 'icon';
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
  variant = 'capsule',
}) => {
  const { theme, setTheme, isDark } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={`p-2 rounded-full border transition-all duration-200 flex items-center justify-center ${
          isDark
            ? 'bg-slate-800/80 border-slate-700/80 text-amber-400 hover:bg-slate-700/80 shadow-xs'
            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 shadow-xs'
        } ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-orange-600" />
        )}
      </button>
    );
  }

  // CoinSphere Dual-Capsule Toggle Switch: [ 🌙 | ☀️ ]
  return (
    <div
      className={`inline-flex items-center p-1 rounded-full bg-slate-900/90 dark:bg-[#101524] border border-slate-800/80 shadow-inner ${className}`}
      role="radiogroup"
      aria-label="Theme selection"
    >
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center ${
          theme === 'dark'
            ? 'bg-[#1C2438] text-amber-400 shadow-sm'
            : 'text-slate-500 hover:text-slate-300'
        }`}
        aria-label="Dark theme"
        title="Dark theme"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center ${
          theme === 'light'
            ? 'bg-amber-500/20 text-amber-400 shadow-sm'
            : 'text-slate-500 hover:text-slate-300'
        }`}
        aria-label="Light theme"
        title="Light theme"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

