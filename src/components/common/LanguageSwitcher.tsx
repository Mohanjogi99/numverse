import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'pill' | 'dropdown' | 'compact';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'pill',
  className = '',
}) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
          language === 'hi'
            ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-xs'
            : 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-xs'
        } ${className}`}
        title="Toggle language / भाषा बदलें"
      >
        <Globe className="w-3.5 h-3.5 text-indigo-600" />
        <span>{language === 'hi' ? '🇮🇳 हिन्दी' : '🌐 EN'}</span>
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-xl bg-slate-100/90 border border-slate-200/80 shadow-inner ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1 ${
          language === 'en'
            ? 'bg-white text-indigo-700 shadow-sm font-bold scale-[1.02]'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <span>English</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1 ${
          language === 'hi'
            ? 'bg-white text-indigo-700 shadow-sm font-bold scale-[1.02]'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <span>हिन्दी</span>
      </button>
    </div>
  );
};
