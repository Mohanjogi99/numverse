import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  UserCheck,
  Layers,
  PlusCircle,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  FileText,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/common/EmptyState';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { ROUTES } from '../config/routes';
import { SingleDigit } from '../types/number';

interface SavedAnalysisItem {
  id: string;
  type: 'mobile' | 'dob';
  primaryNumber: SingleDigit;
  theme: string;
  date: string;
}

interface SavedPersonalityItem {
  id: string;
  tier: string;
  archetype: string;
  date: string;
}

interface SavedReportItem {
  id: string;
  theme: string;
  date: string;
}

export const DashboardPage: React.FC = () => {
  const [numberAnalyses, setNumberAnalyses] = useState<SavedAnalysisItem[]>([]);
  const [personalityTests, setPersonalityTests] = useState<SavedPersonalityItem[]>([]);
  const [fusionReports, setFusionReports] = useState<SavedReportItem[]>([]);

  useEffect(() => {
    const numList: SavedAnalysisItem[] = [];
    const persList: SavedPersonalityItem[] = [];
    const repList: SavedReportItem[] = [];

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key) continue;

      if (key.startsWith('ns_analysis_')) {
        try {
          const item = JSON.parse(sessionStorage.getItem(key) || '{}');
          numList.push({
            id: item.id,
            type: item.inputRaw?.includes('-') && item.inputRaw.length <= 10 ? 'dob' : 'mobile',
            primaryNumber: item.primaryNumber || 0,
            theme: item.dominantNumbers?.[0]?.theme || 'Balance',
            date: new Date(item.calculatedAt || Date.now()).toLocaleDateString(),
          });
        } catch (e) {
          console.warn('Could not parse cached number analysis', e);
        }
      } else if (key.startsWith('ns_personality_')) {
        try {
          const item = JSON.parse(sessionStorage.getItem(key) || '{}');
          persList.push({
            id: item.id,
            tier: item.tier || 'free',
            archetype: item.primaryArchetype?.title || 'Explorer',
            date: new Date(item.completedAt || Date.now()).toLocaleDateString(),
          });
        } catch (e) {
          console.warn('Could not parse cached personality test', e);
        }
      } else if (key.startsWith('ns_fusion_')) {
        try {
          const item = JSON.parse(sessionStorage.getItem(key) || '{}');
          repList.push({
            id: item.id,
            theme: item.fusionNarrative?.coreTheme || 'Harmonic Fusion',
            date: new Date(item.calculatedAt || Date.now()).toLocaleDateString(),
          });
        } catch (e) {
          console.warn('Could not parse cached fusion report', e);
        }
      }
    }

    setNumberAnalyses(numList);
    setPersonalityTests(persList);
    setFusionReports(repList);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-fade-in">
      {/* 1. WELCOME SECTION (Section 50) */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Exploration Session</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
            Your Self-Discovery Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Welcome to your workspace. Review your number frequency patterns, personality archetypes, and harmonic fusion reports.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Link to={ROUTES.NUMBER_ANALYSIS}>
            <Button size="sm" variant="gold" leftIcon={<PlusCircle className="w-4 h-4" />}>
              New Analysis
            </Button>
          </Link>
          <Link to={ROUTES.SETTINGS}>
            <Button size="sm" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Preferences
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. MY NUMBER ANALYSES (Section 50) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900">
              My Number Analyses
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">{numberAnalyses.length} saved</span>
        </div>

        {numberAnalyses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {numberAnalyses.map((item) => (
              <Card key={item.id} variant="interactive" className="p-5 flex flex-col justify-between space-y-3 border-slate-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      Digit #{item.primaryNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.date}</span>
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-base">{item.theme}</h3>
                  <p className="text-xs text-slate-500">Deterministic frequency profile</p>
                </div>
                <Link
                  to={`/number-result/${item.id}`}
                  className="text-xs font-semibold text-indigo-600 flex items-center justify-between pt-2 border-t border-slate-100 hover:text-indigo-800"
                >
                  <span>View Full Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No number analyses yet"
            description="Analyze your 10-digit mobile number or date of birth to discover your dominant theme and 6 dimension scores."
            actionText="Analyze My Number"
            actionHref={ROUTES.NUMBER_ANALYSIS}
            icon={<Compass className="w-6 h-6" />}
          />
        )}
      </div>

      {/* 3. MY PERSONALITY TESTS (Section 50) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900">
              My Personality Assessments
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">{personalityTests.length} saved</span>
        </div>

        {personalityTests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalityTests.map((item) => (
              <Card key={item.id} variant="interactive" className="p-5 flex flex-col justify-between space-y-3 border-slate-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full uppercase">
                      {item.tier} Tier
                    </span>
                    <span className="text-[11px] text-slate-400">{item.date}</span>
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-base">{item.archetype}</h3>
                  <p className="text-xs text-slate-500">Structured assessment outcome</p>
                </div>
                <Link
                  to={`/personality-result/${item.id}`}
                  className="text-xs font-semibold text-purple-600 flex items-center justify-between pt-2 border-t border-slate-100 hover:text-purple-800"
                >
                  <span>View Archetype Results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No personality assessments taken yet"
            description="Complete the 10, 25, or 50 question assessment to map your traits against 6 psychological dimensions."
            actionText="Start Personality Test"
            actionHref={ROUTES.PERSONALITY_TEST}
            icon={<UserCheck className="w-6 h-6" />}
          />
        )}
      </div>

      {/* 4. MY REPORTS & PURCHASES (Section 50) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Reports */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-display font-bold text-slate-900">My Reports</h2>
          </div>

          {fusionReports.length > 0 ? (
            <div className="space-y-3">
              {fusionReports.map((r) => (
                <Card key={r.id} variant="interactive" className="p-4 flex items-center justify-between border-slate-200">
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-sm">{r.theme}</h4>
                    <span className="text-[11px] text-slate-400">{r.date}</span>
                  </div>
                  <Link to={`/report/${r.id}`}>
                    <Button size="sm" variant="soft">View Report</Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="You haven't created a report yet"
              description="Fuse your number pattern with a personality assessment to unlock your multi-layer Number Story."
              actionText="Start Your Number Story"
              actionHref={ROUTES.NUMBER_ANALYSIS}
              icon={<FileText className="w-5 h-5" />}
            />
          )}
        </div>

        {/* Purchases */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-display font-bold text-slate-900">Purchases</h2>
          </div>

          <EmptyState
            title="No purchases recorded"
            description="Unlock premium tiers and comprehensive multi-layer fusion reports whenever you're ready."
            actionText="Explore Premium Tiers"
            actionHref={ROUTES.CHECKOUT.replace(':productId', 'combo')}
            icon={<ShoppingBag className="w-5 h-5" />}
          />
        </div>
      </div>

      <DisclaimerBanner variant="card" />
    </div>
  );
};
