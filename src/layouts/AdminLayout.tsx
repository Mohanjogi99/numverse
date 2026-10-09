import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, ArrowLeft, Users, FileText, Settings, Activity, Database, Sparkles } from 'lucide-react';
import { ROUTES } from '../config/routes';

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  const adminNav = [
    { label: 'Overview', path: ROUTES.ADMIN, icon: Activity },
    { label: 'User Directory', path: ROUTES.ADMIN_USERS, icon: Users },
    { label: 'Question Bank', path: ROUTES.ADMIN_QUESTIONS, icon: FileText },
    { label: 'Number Engines', path: ROUTES.ADMIN_NUMBERS, icon: Database },
    { label: 'AI Settings', path: ROUTES.ADMIN_AI, icon: Sparkles },
    { label: 'System Settings', path: ROUTES.ADMIN_SETTINGS, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">NS Admin</div>
              <div className="text-xs text-slate-400">Phase 1 Architecture</div>
            </div>
          </div>

          <nav className="space-y-1">
            {adminNav.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Application</span>
          </Link>
        </div>
      </aside>

      {/* Admin Content Viewport */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
