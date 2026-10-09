import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MobileBottomNav } from '../components/common/MobileBottomNav';
import { ToastProvider } from '../context/ToastContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import { analytics } from '../services/analyticsService';

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    analytics.logEvent('page_view', { path: pathname });
  }, [pathname]);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col bg-[#FAFBFD] dark:bg-[#0A0914] text-slate-900 dark:text-slate-100 selection:bg-pink-500 selection:text-white pb-16 md:pb-0 transition-colors duration-200 coinsphere-glow-bg relative overflow-x-hidden">
            {/* Ambient Background Sunset Aurora Glow Spheres */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-pink-500/10 dark:bg-pink-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/4 left-5 w-[450px] h-[450px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-amber-500/10 dark:bg-amber-500/12 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-rose-500/10 dark:bg-rose-500/12 rounded-full blur-3xl pointer-events-none -z-10" />


            <Header />
            <main className="flex-grow w-full relative z-10">
              <Outlet />
            </main>
            <Footer />
            <MobileBottomNav />
          </div>

        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
