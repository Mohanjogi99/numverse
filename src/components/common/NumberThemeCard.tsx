import React from 'react';
import { Link } from 'react-router-dom';
import { NumberProfile } from '../../types/number';
import { Card } from '../ui/Card';
import { ArrowRight } from 'lucide-react';
import { buildNumberDetailUrl } from '../../config/routes';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedNumberProfile } from '../../i18n/profileHelpers';

export interface NumberThemeCardProps {
  profile: NumberProfile;
}

export const NumberThemeCard: React.FC<NumberThemeCardProps> = ({ profile }) => {
  const { language, t } = useLanguage();
  const localized = getLocalizedNumberProfile(profile.number, language);

  return (
    <Link to={buildNumberDetailUrl(profile.number)} className="block group">
      <Card
        variant="interactive"
        className="h-full flex flex-col justify-between p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 border-slate-200 dark:border-purple-900/30 bg-white dark:bg-[#110F22]/90 backdrop-blur-md hover:border-pink-500/50 hover:shadow-lg dark:hover:shadow-sunset-glow relative overflow-hidden"
      >
        {/* Subtle background glow on hover */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors pointer-events-none blur-xl" />

        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-display font-black text-xl shadow-md shadow-pink-500/25 shrink-0">
              {localized.number}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200/40 dark:border-purple-800/40 group-hover:bg-pink-500/20 group-hover:text-pink-300 transition-colors text-right truncate">
              {localized.theme}
            </span>
          </div>

          <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-pink-400 transition-colors line-clamp-1 mb-1">
            {localized.tagline}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-3">
            {localized.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-purple-950/60 flex items-center justify-between text-xs font-semibold text-pink-600 dark:text-pink-400 group-hover:text-pink-300">
          <span>{t.common.viewDetails}</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </Link>
  );
};
