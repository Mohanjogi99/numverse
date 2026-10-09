import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  Compass,
  CheckCircle2,
  Heart,
  Briefcase,
} from 'lucide-react';
import { NumberAnalysisResult, DimensionKey, SingleDigit } from '../types/number';
import { NUMBER_PROFILES } from '../data/numberProfiles';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DimensionBar } from '../components/common/DimensionBar';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { ShareCard } from '../components/common/ShareCard';
import { ResultSkeleton } from '../components/ui/ResultSkeleton';
import { formatPercentage } from '../utils/formatters';
import { analyzeMobile } from '../engine/numberEngine';
import { ROUTES } from '../config/routes';
import { analytics } from '../services/analyticsService';

export const NumberResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<NumberAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (id) {
      const stored = sessionStorage.getItem(`ns_analysis_${id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setResult(parsed);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error('Failed to parse cached analysis:', e);
        }
      }
    }

    // Default sample fallback if visited directly
    const sample = analyzeMobile('7415766779');
    setResult(sample);
    setIsLoading(false);
  }, [id]);

  if (isLoading || !result) {
    return <ResultSkeleton />;
  }

  const primaryProfile = NUMBER_PROFILES[result.primaryNumber];
  const dominantList = result.dominantNumbers;
  const isDualDominant =
    dominantList.length >= 2 && dominantList[0].count === dominantList[1].count;
  const supportingNumber = !isDualDominant && dominantList.length > 1 ? dominantList[1] : null;

  const dimensions: DimensionKey[] = [
    'curiosity',
    'independence',
    'leadership',
    'social',
    'emotional',
    'stability',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-fade-in">
      {/* 1. HERO RESULT CARD (Sections 20, 21, 22) */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analysis Completed • Number Story Engine v{result.engineVersion}</span>
            </div>

            <div className="text-xs font-bold uppercase tracking-widest text-amber-300">
              {isDualDominant ? 'Dual Dominant Pattern' : 'Your Dominant Number'}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center font-display font-black text-3xl sm:text-4xl shadow-inner">
                {result.primaryNumber}
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-display font-bold text-white">
                  {primaryProfile.theme}
                </h1>
                <p className="text-sm sm:text-base text-indigo-200">
                  {formatPercentage(dominantList[0]?.percentage || 0)} Frequency Density
                </p>
              </div>
            </div>

            {/* Supporting Number / Dual Dominant Banner (Section 22) */}
            {isDualDominant ? (
              <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200">
                <span className="font-bold text-amber-300">Dual Dominant: </span>
                <span>
                  #{dominantList[0].digit} ({dominantList[0].theme}) & #{dominantList[1].digit} ({dominantList[1].theme}) with identical frequency ({dominantList[0].count} times each).
                </span>
              </div>
            ) : supportingNumber ? (
              <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200">
                <span className="font-bold text-indigo-300">Supporting Number: </span>
                <span>
                  #{supportingNumber.digit} — {supportingNumber.theme} ({formatPercentage(supportingNumber.percentage)})
                </span>
              </div>
            ) : null}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Button
              variant="gold"
              size="sm"
              onClick={() => {
                analytics.logEvent('number_analysis_start', { type: 're_analyze' });
                navigate(ROUTES.NUMBER_ANALYSIS);
              }}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Analyze Another Number
            </Button>
          </div>
        </div>
      </div>

      {/* 2. NUMBER DISTRIBUTION & DIMENSION SCORES (Sections 23, 24) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Number Distribution (Section 23) */}
        <Card className="p-6 space-y-6 lg:col-span-6 border-slate-200">
          <div>
            <h2 className="text-base font-display font-bold text-slate-900">
              Digit Frequency Distribution
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Occurrence breakdown of digits in sequence ({result.totalDigits} total digits).
            </p>
          </div>

          <div className="space-y-3" role="table" aria-label="Digit frequency distribution">
            {dominantList.map((dom) => (
              <div key={dom.digit} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-900 text-white font-mono text-[11px] flex items-center justify-center font-bold">
                      {dom.digit}
                    </span>
                    <span>{dom.theme}</span>
                  </span>
                  <span className="font-mono text-slate-500">
                    {dom.count}× ({formatPercentage(dom.percentage)})
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dom.isPrimary ? 'bg-indigo-600' : 'bg-purple-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, dom.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Full 0-9 Distribution Grid */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Full Spectrum (0–9)
            </h3>
            <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => {
                const cnt = result.digitFrequency[d as unknown as SingleDigit] || 0;
                return (
                  <div
                    key={d}
                    className={`p-1.5 rounded-lg border ${
                      cnt > 0 ? 'bg-indigo-50/80 border-indigo-200' : 'bg-slate-50 border-slate-100 opacity-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{d}</div>
                    <div className="text-[10px] text-slate-500 font-mono">×{cnt}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Dimension Scores (Section 24: Number Influence Profile) */}
        <Card className="p-6 space-y-4 lg:col-span-6 border-slate-200">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-display font-bold text-slate-900">
                Number Influence Profile
              </h2>
              <Badge variant="primary" size="sm">6 Dimensions</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Baseline psychological resonance based on Number Influence Matrix v1.0. Not a clinical measurement.
            </p>
          </div>

          <div className="space-y-2.5">
            {dimensions.map((dim) => (
              <DimensionBar key={dim} dimension={dim} score={result.dimensionScores[dim]} />
            ))}
          </div>
        </Card>
      </div>

      {/* 3. YOUR NUMBER STORY (Section 25) */}
      <Card className="p-6 sm:p-10 space-y-4 border-slate-200">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Narrative Synthesis</span>
          <h2 className="text-2xl font-display font-bold text-slate-900">Your Number Story</h2>
        </div>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          {primaryProfile.description}
        </p>
      </Card>

      {/* 4. STRENGTHS & CHALLENGES (Sections 26, 27) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="p-6 space-y-4 border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Core Strengths
          </h3>
          <ul className="space-y-2.5">
            {primaryProfile.strengths.slice(0, 4).map((str, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Challenges (Section 27: Non-deterministic wording) */}
        <Card className="p-6 space-y-4 border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Reflection Areas
          </h3>
          <ul className="space-y-2.5">
            {primaryProfile.challenges.slice(0, 3).map((ch, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  !
                </span>
                <span>You may sometimes {ch.toLowerCase().startsWith('challenges') ? ch : ch}.</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 5. RELATIONSHIP & CAREER PREVIEWS (Sections 28, 29) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3 border-slate-200 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600">
              <Heart className="w-4 h-4" />
              <h4 className="font-bold text-sm text-slate-900">Relationship Style Preview</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {primaryProfile.relationship}
            </p>
          </div>
          <div className="pt-2">
            <Link to={ROUTES.CHECKOUT.replace(':productId', 'combo')}>
              <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                Unlock full relationship harmony report <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </Card>

        <Card className="p-6 space-y-3 border-slate-200 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600">
              <Briefcase className="w-4 h-4" />
              <h4 className="font-bold text-sm text-slate-900">Career & Work Preferences</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {primaryProfile.career}
            </p>
          </div>
          <div className="pt-2">
            <Link to={ROUTES.CHECKOUT.replace(':productId', 'combo')}>
              <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                Unlock full career strategy report <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </Card>
      </div>

      {/* 6. PREMIUM CTA (Section 30) */}
      <Card className="p-8 sm:p-10 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-white shadow-xl space-y-6">
        <div className="space-y-2">
          <Badge variant="gold" size="sm">Complete Self-Reflection</Badge>
          <h3 className="text-xl sm:text-3xl font-display font-extrabold text-slate-900">
            Want to understand the complete picture?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Numbers provide one layer of your profile. Fuse your number pattern with our structured psychological assessment to unlock a comprehensive self-reflection report.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-700 pt-2">
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /><span>Personality assessment</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /><span>Six dimension scores</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /><span>Fusion identity</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /><span>Relationship profile</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /><span>Career profile</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /><span>Money mindset</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /><span>Communication style</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /><span>Learning vectors</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /><span>Growth opportunities</span></div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link to={ROUTES.PERSONALITY_TEST}>
            <Button
              size="lg"
              variant="primary"
              onClick={() => analytics.logEvent('premium_cta_clicked', { source: 'number_result_page' })}
              rightIcon={<Compass className="w-5 h-5" />}
            >
              Take Personality Test
            </Button>
          </Link>
          <Link to={ROUTES.CHECKOUT.replace(':productId', 'combo')}>
            <Button
              size="lg"
              variant="gold"
              onClick={() => analytics.logEvent('checkout_viewed', { productId: 'combo' })}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Discover My Complete Story
            </Button>
          </Link>
        </div>
      </Card>

      {/* 7. SHARE CARD COMPONENT (Section 31) */}
      <div className="pt-4 text-center space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Share Your Reflection
        </h3>
        <ShareCard
          digit={result.primaryNumber}
          theme={primaryProfile.theme}
          tagline={primaryProfile.tagline}
        />
      </div>

      <DisclaimerBanner variant="card" />
    </div>
  );
};
