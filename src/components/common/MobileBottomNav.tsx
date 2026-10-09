import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Compass, UserCheck, LayoutDashboard, Flame } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { useLanguage } from '../../context/LanguageContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { isHindi } = useLanguage();

  const navItems = [
    { label: isHindi ? 'होम' : 'Home', path: ROUTES.HOME, icon: LayoutDashboard },
    { label: isHindi ? 'अंक' : 'Number', path: ROUTES.NUMBER_ANALYSIS, icon: Compass },
    { label: isHindi ? 'टेस्ट' : 'Test', path: ROUTES.PERSONALITY_TEST, icon: UserCheck },
    { label: isHindi ? 'संगम' : 'Fusion', path: ROUTES.DASHBOARD, icon: Flame },
    { label: isHindi ? 'प्रीमियम' : 'Premium', path: ROUTES.CHECKOUT.replace(':productId', 'combo'), icon: Sparkles },
  ];


  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C0B18]/95 backdrop-blur-2xl border-t border-purple-950/80 px-2 py-1.5 shadow-2xl"
    >
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                active ? 'text-pink-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? 'stroke-[2.5] text-pink-400' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );

};

