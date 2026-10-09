import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { APP_CONFIG } from '../../config/constants';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t, isHindi } = useLanguage();

  return (
    <footer className="bg-[#0A0914] text-slate-400 pt-12 pb-8 border-t border-purple-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to={ROUTES.HOME} className="inline-block">
              <BrandLogo size="lg" showText={true} showTagline={true} />
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {t.footer.aboutText}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              <span className="text-pink-400/90 font-semibold">{isHindi ? 'सूचना:' : 'Notice:'}</span> {t.common.disclaimerFull}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.NUMBER_ANALYSIS} className="hover:text-white transition-colors">
                  {t.nav.numberAnalysis}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PERSONALITY_TEST} className="hover:text-white transition-colors">
                  {t.nav.personalityTest}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PERSONALITY_TYPES} className="hover:text-white transition-colors">
                  {isHindi ? '10 व्यक्तित्व प्रकार' : 'Personality Archetypes'}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ABOUT} className="hover:text-white transition-colors">
                  {t.nav.about}
                </Link>
              </li>
            </ul>
          </div>

          {/* Number Themes */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {isHindi ? '0–9 अंक ऊर्जा' : '0–9 Themes'}
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
              <Link to="/number/0" className="hover:text-white transition-colors">0 • {isHindi ? 'संतुलन' : 'Balance'}</Link>
              <Link to="/number/1" className="hover:text-white transition-colors">1 • {isHindi ? 'धन' : 'Money'}</Link>
              <Link to="/number/2" className="hover:text-white transition-colors">2 • {isHindi ? 'संवाद' : 'Communication'}</Link>
              <Link to="/number/3" className="hover:text-white transition-colors">3 • {isHindi ? 'ज्ञान' : 'Knowledge'}</Link>
              <Link to="/number/4" className="hover:text-white transition-colors">4 • {isHindi ? 'कौशल' : 'Creation'}</Link>
              <Link to="/number/5" className="hover:text-white transition-colors">5 • {isHindi ? 'विस्तार' : 'Power'}</Link>
              <Link to="/number/6" className="hover:text-white transition-colors">6 • {isHindi ? 'सद्भाव' : 'Peace'}</Link>
              <Link to="/number/7" className="hover:text-white transition-colors">7 • {isHindi ? 'सत्य' : 'Truth'}</Link>
              <Link to="/number/8" className="hover:text-white transition-colors">8 • {isHindi ? 'अधिकार' : 'Authority'}</Link>
              <Link to="/number/9" className="hover:text-white transition-colors">9 • {isHindi ? 'करुणा' : 'Compassion'}</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {APP_CONFIG.APP_NAME}. {t.footer.rightsReserved}</p>
          <div className="flex items-center gap-6">
            <Link to={ROUTES.ABOUT} className="hover:text-slate-400 transition-colors">{isHindi ? 'गोपनीयता एवं नैतिकता' : 'Privacy & Ethics'}</Link>
            <Link to={ROUTES.ADMIN} className="hover:text-slate-400 transition-colors">Admin Gateway</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
