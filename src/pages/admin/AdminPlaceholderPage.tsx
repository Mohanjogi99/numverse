import React from 'react';
import { useLocation } from 'react-router-dom';
import { Database, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { NUMBER_ENGINE_VERSION } from '../../data/influenceMatrix';

export const AdminPlaceholderPage: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="gold" size="sm">Phase 1 Protected Architecture</Badge>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
            Admin System Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Route: <code className="text-indigo-400 font-mono">{pathname}</code>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-6 bg-slate-900 border-slate-800 text-slate-100 space-y-3">
          <div className="flex items-center gap-2.5 text-indigo-400">
            <Database className="w-5 h-5" />
            <h3 className="font-bold text-sm">Engine Status</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Number Story Engine v{NUMBER_ENGINE_VERSION} is operational with deterministic influence matrices.
          </p>
          <div className="pt-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Active & Loaded
            </span>
          </div>
        </Card>

        <Card className="p-6 bg-slate-900 border-slate-800 text-slate-100 space-y-3">
          <div className="flex items-center gap-2.5 text-purple-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-sm">Upcoming Admin Modules</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Full management panels for User CRM, Question Bank editor, AI prompt config, and Payment logs will be implemented in subsequent phases.
          </p>
          <div className="pt-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
              Reserved Architecture
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};
