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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 mb-10">
          {/* Brand Col (4 cols) */}
          <div className="sm:col-span-2 md:col-span-4 space-y-4">
            <Link to={ROUTES.HOME} className="inline-block">
              <BrandLogo size="lg" showText={true} showTagline={true} />
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {t.footer.aboutText}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              <span className="text-pink-400/90 font-semibold">{isHindi ? 'सूचना:' : 'Notice:'}</span> {t.common.disclaimerFull}
            </p>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
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
                  {isHindi ? '10 व्यक्तित्व प्रकार' : '10 Personality Archetypes'}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ABOUT} className="hover:text-white transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DISCLAIMER} className="hover:text-pink-300 transition-colors">
                  {isHindi ? 'अस्वीकरण एवं पद्धति' : 'Methodology & Disclaimer'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies (3 cols) - Google Compliance */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {isHindi ? 'कानूनी एवं नीतियां' : 'Legal & Policies'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to={ROUTES.PRIVACY} className="hover:text-white transition-colors">
                  {isHindi ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.TERMS} className="hover:text-white transition-colors">
                  {isHindi ? 'नियम एवं शर्तें (Terms & Conditions)' : 'Terms & Conditions'}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REFUND} className="hover:text-white transition-colors">
                  {isHindi ? 'रिफंड एवं रद्दीकरण (Refund Policy)' : 'Refund & Cancellation Policy'}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CONTACT} className="hover:text-white transition-colors">
                  {isHindi ? 'संपर्क एवं सहायता (Contact Us)' : 'Contact Us & Support'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Number Themes (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {isHindi ? '0–9 अंक ऊर्जा' : '0–9 Themes'}
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
              <Link to="/number/0" className="hover:text-pink-300 transition-colors whitespace-nowrap">0 • {isHindi ? 'संतुलन' : 'Balance'}</Link>
              <Link to="/number/1" className="hover:text-pink-300 transition-colors whitespace-nowrap">1 • {isHindi ? 'धन' : 'Money'}</Link>
              <Link to="/number/2" className="hover:text-pink-300 transition-colors whitespace-nowrap">2 • {isHindi ? 'संवाद' : 'Comm.'}</Link>
              <Link to="/number/3" className="hover:text-pink-300 transition-colors whitespace-nowrap">3 • {isHindi ? 'ज्ञान' : 'Wisdom'}</Link>
              <Link to="/number/4" className="hover:text-pink-300 transition-colors whitespace-nowrap">4 • {isHindi ? 'कौशल' : 'Skill'}</Link>
              <Link to="/number/5" className="hover:text-pink-300 transition-colors whitespace-nowrap">5 • {isHindi ? 'विस्तार' : 'Power'}</Link>
              <Link to="/number/6" className="hover:text-pink-300 transition-colors whitespace-nowrap">6 • {isHindi ? 'सद्भाव' : 'Peace'}</Link>
              <Link to="/number/7" className="hover:text-pink-300 transition-colors whitespace-nowrap">7 • {isHindi ? 'सत्य' : 'Truth'}</Link>
              <Link to="/number/8" className="hover:text-pink-300 transition-colors whitespace-nowrap">8 • {isHindi ? 'अधिकार' : 'Lead'}</Link>
              <Link to="/number/9" className="hover:text-pink-300 transition-colors whitespace-nowrap">9 • {isHindi ? 'करुणा' : 'Love'}</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {APP_CONFIG.APP_NAME}. {t.footer.rightsReserved}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
            <span>🔒 256-Bit SSL Encrypted</span>
            <span>•</span>
            <span>⚡ Razorpay Live Verified</span>
            <span>•</span>
            <span>🛡️ DPDP Act 2023 Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
