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
        className="h-full flex flex-col justify-between p-5 sm:p-6 transition-all duration-300 hover:scale-[1.02] border-slate-200/90 relative overflow-hidden"
      >
        {/* Subtle background glow on hover */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-indigo-50/50 group-hover:bg-indigo-100/50 transition-colors pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-display font-bold text-2xl shadow-sm group-hover:bg-indigo-600 transition-colors">
              {localized.number}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
              {localized.theme}
            </span>
          </div>

          <h3 className="font-display font-semibold text-base sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5">
            {localized.tagline}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
            {localized.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
          <span>{t.common.viewDetails}</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </Link>
  );
};
