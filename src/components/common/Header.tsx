import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Sparkles,
  Compass,
  UserCheck,
  LayoutDashboard,
  Search,
  Bell,
  Flame,
  CreditCard,
} from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '../../context/LanguageContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { isHindi } = useLanguage();

  const navLinks = [
    { name: isHindi ? 'डैशबोर्ड' : 'Dashboard', path: ROUTES.HOME, icon: LayoutDashboard },
    { name: isHindi ? 'अंक विश्लेषण' : 'Number Engine', path: ROUTES.NUMBER_ANALYSIS, icon: Compass },
    { name: isHindi ? 'व्यक्तित्व टेस्ट' : 'Personality Test', path: ROUTES.PERSONALITY_TEST, icon: UserCheck },
    { name: isHindi ? 'महा-संगम' : 'Fusion Report', path: ROUTES.DASHBOARD, icon: Flame },
    { name: isHindi ? 'प्रीमियम पैकेज' : 'Pricing', path: ROUTES.CHECKOUT.replace(':productId', 'combo'), icon: CreditCard },
  ];


  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const cleanDigits = searchQuery.replace(/\D/g, '');
    if (cleanDigits.length >= 10) {
      navigate(`${ROUTES.NUMBER_RESULT}?mobile=${cleanDigits.slice(-10)}`);
      setSearchQuery('');
    } else {
      navigate(`${ROUTES.NUMBER_ANALYSIS}`);
    }
  };


  return (
    <header className="sticky top-0 z-50 bg-[#0C0B18]/95 dark:bg-[#0A0914]/98 backdrop-blur-2xl border-b border-purple-950/60 dark:border-slate-800/80 shadow-2xl transition-all duration-200">
      {/* Ambient Top Glow Line (Sunset Aurora: Violet -> Fuchsia -> Pink -> Amber) */}
      <div className="h-[2px] w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 via-pink-500 to-amber-400" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-nowrap justify-between items-center h-16 sm:h-18 gap-2 sm:gap-4">
          {/* 1. Brand Logo */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center group transition-transform active:scale-95 shrink-0"
          >
            <BrandLogo size="md" showText={true} showTagline={false} />
          </Link>

          {/* 2. Central Menubar Navigation (Strictly Single Line) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-[#131126]/90 p-1 rounded-full border border-purple-900/40 shadow-inner shrink-0">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-gradient-to-r from-fuchsia-500/25 via-pink-500/20 to-amber-500/20 text-pink-300 border border-pink-500/40 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <link.icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-pink-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* 3. Compact Search Bar (Desktop only) */}
          <div className="hidden 2xl:flex items-center w-48 shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? 'नंबर खोजें...' : 'Quick lookup...'}
                className="w-full pl-8 pr-7 py-1 rounded-full bg-[#131124] border border-purple-900/40 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500/60 transition-all"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-500 bg-purple-950/80 px-1 py-0.5 rounded">
                ↵
              </span>
            </form>
          </div>

          {/* 4. Desktop Right Controls (Clean, Compact, No Wrapping) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Theme Switcher Dual Capsule */}
            <ThemeSwitcher variant="capsule" />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notifications Icon Button */}
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="p-1.5 sm:p-2 rounded-full bg-[#131124] border border-purple-900/40 text-slate-400 hover:text-white hover:border-pink-500/50 transition-all relative shrink-0"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-[#0C0B18]" />
            </button>

            {/* Glowing Sunset Aurora CTA Button */}
            <Link to={ROUTES.NUMBER_ANALYSIS} className="shrink-0">
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-500 hover:via-pink-400 hover:to-amber-400 shadow-md shadow-pink-500/25 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                <span>{isHindi ? 'अंक विश्लेषण' : 'Analyze'}</span>
              </button>
            </Link>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            <ThemeSwitcher variant="icon" />
            <LanguageSwitcher variant="compact" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl bg-[#131124] border border-purple-900/40 text-slate-300 hover:text-white focus:outline-none shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-pink-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>



      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-purple-900/50 bg-[#0C0B18]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
          {/* Search bar for mobile */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'मोबाइल नंबर खोजें...' : 'Lookup number...'}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#131124] border border-purple-900/40 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500/60"
            />
          </form>

          {/* Nav links */}
          <div className="space-y-1 pt-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'text-pink-300 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/15 border border-pink-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <link.icon className={`w-4 h-4 ${active ? 'text-pink-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </div>
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-purple-900/40 grid grid-cols-2 gap-2">
            <Link to={ROUTES.PERSONALITY_TEST} onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full border-purple-800/50 text-slate-200" size="sm" variant="outline">
                {isHindi ? 'व्यक्तित्व टेस्ट' : 'Personality Test'}
              </Button>
            </Link>
            <Link to={ROUTES.NUMBER_ANALYSIS} onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white font-bold shadow-md shadow-pink-500/20" size="sm">
                {isHindi ? 'अंक विश्लेषण' : 'Analyze Number'}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};


