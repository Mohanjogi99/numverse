import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  Compass,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { PersonalityAssessmentResult } from '../types/personality';
import { NumberAnalysisResult, DimensionKey } from '../types/number';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DimensionBar } from '../components/common/DimensionBar';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { ResultSkeleton } from '../components/ui/ResultSkeleton';
import { evaluatePersonalityTest } from '../engine/personalityEngine';
import { fuseNumberAndPersonality } from '../engine/fusionEngine';
import { analyzeMobile } from '../engine/numberEngine';
import { DIMENSION_INFO, getScoreBand } from '../config/constants';
import { ROUTES } from '../config/routes';
import { analytics } from '../services/analyticsService';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedPersonalityArchetype } from '../i18n/profileHelpers';

export const PersonalityResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t, isHindi } = useLanguage();
  const [result, setResult] = useState<PersonalityAssessmentResult | null>(null);
  const [cachedNumberResult, setCachedNumberResult] = useState<NumberAnalysisResult | null>(null);
  const [quickNumber, setQuickNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let loadedResult: PersonalityAssessmentResult | null = null;
    if (id) {
      const stored = sessionStorage.getItem(`ns_personality_${id}`);
      if (stored) {
        try {
          loadedResult = JSON.parse(stored);
          setResult(loadedResult);
          setIsLoading(false);
        } catch (e) {
          console.warn('Failed to parse cached personality result:', e);
        }
      }
    }

    if (!loadedResult) {
      // Default sample fallback
      const sample = evaluatePersonalityTest('free', [
        { questionId: 'q1', selectedOptionId: 'opt_5', value: 5 },
        { questionId: 'q2', selectedOptionId: 'opt_4', value: 4 },
        { questionId: 'q3', selectedOptionId: 'opt_3', value: 3 },
        { questionId: 'q4', selectedOptionId: 'opt_4', value: 4 },
        { questionId: 'q5', selectedOptionId: 'opt_3', value: 3 },
        { questionId: 'q6', selectedOptionId: 'opt_2', value: 2 },
        { questionId: 'q7', selectedOptionId: 'opt_5', value: 5 },
        { questionId: 'q8', selectedOptionId: 'opt_4', value: 4 },
        { questionId: 'q9', selectedOptionId: 'opt_3', value: 3 },
        { questionId: 'q10', selectedOptionId: 'opt_4', value: 4 },
      ]);
      setResult(sample);
      setIsLoading(false);
    }

    // Check for recent number analysis in session
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('ns_analysis_')) {
        try {
          const numData = JSON.parse(sessionStorage.getItem(key) || '');
          setCachedNumberResult(numData);
          break;
        } catch (e) {
          console.warn('Could not read cached analysis', e);
        }
      }
    }
  }, [id]);

  if (isLoading || !result) {
    return <ResultSkeleton />;
  }

  const primaryArchetype = getLocalizedPersonalityArchetype(result.primaryArchetype.id, language);
  const secondaryArchetype = result.secondaryArchetype
    ? getLocalizedPersonalityArchetype(result.secondaryArchetype.id, language)
    : null;

  const dimensions: DimensionKey[] = [
    'curiosity',
    'independence',
    'leadership',
    'social',
    'emotional',
    'stability',
  ];

  const handleCreateFusion = (numResult: NumberAnalysisResult) => {
    const fusion = fuseNumberAndPersonality(numResult, result);
    sessionStorage.setItem(`ns_fusion_${fusion.id}`, JSON.stringify(fusion));
    analytics.logEvent('premium_cta_clicked', { source: 'fusion_generated' });
    navigate(`/report/${fusion.id}`);
  };

  const handleQuickFusionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNumber.trim() || quickNumber.replace(/\D/g, '').length < 7) return;
    const numResult = analyzeMobile(quickNumber);
    sessionStorage.setItem(`ns_analysis_${numResult.id}`, JSON.stringify(numResult));
    handleCreateFusion(numResult);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-fade-in">
      {/* 1. HERO RESULT BANNER */}
      <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-950 dark:from-[#111827] dark:via-[#0F172A] dark:to-[#1E1B4B] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-purple-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isHindi
                  ? `परीक्षण पूर्ण • ${result.tier.toUpperCase()} स्तर (${result.totalQuestions} प्रश्न)`
                  : `Assessment Completed • ${result.tier.toUpperCase()} Tier (${result.totalQuestions} Questions)`}
              </span>
            </div>

            <div className="text-xs font-bold uppercase tracking-widest text-amber-300">
              {t.personalityResult.archetypeTitle}
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
                {primaryArchetype.title}
              </h1>
              <p className="text-sm sm:text-base text-purple-200 mt-1 font-medium">
                {primaryArchetype.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              "{primaryArchetype.tagline}"
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="gold"
              size="sm"
              onClick={() => {
                analytics.logEvent('personality_test_start', { tier: result.tier });
                navigate(ROUTES.PERSONALITY_TEST);
              }}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              {isHindi ? 'परीक्षण दोबारा दें' : 'Retake Test'}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. SIX DIMENSION DASHBOARD & SCORE BANDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Six Dimensions */}
        <Card className="p-6 space-y-4 lg:col-span-7 border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-display font-bold text-slate-900 dark:text-white">
              {t.personalityResult.dimensionScoresTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isHindi
                ? '6 प्रमुख मनोवैज्ञानिक आयामों पर आधारित आपके स्कोर का विवरण'
                : 'Reflective assessment scores across core psychological dimensions.'}
            </p>
          </div>

          <div className="space-y-3">
            {dimensions.map((dim) => {
              const score = result.dimensionScores[dim];
              const band = getScoreBand(score);
              return (
                <div key={dim} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <span>{DIMENSION_INFO[dim].label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${band.badgeClass}`}>
                        {band.label}
                      </span>
                      <span className="font-mono text-indigo-700 dark:text-indigo-400 font-bold">{score} / 100</span>
                    </div>
                  </div>
                  <DimensionBar dimension={dim} score={score} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Primary & Secondary Dimension Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Primary Dimension */}
          <Card className="p-6 space-y-3 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                {isHindi ? 'प्रमुख आयाम (Primary)' : 'Primary Dimension'}
              </span>
              <span className="text-xs font-mono font-bold text-indigo-900 dark:text-indigo-200 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800">
                {result.dimensionScores[result.primaryDimension]} pts
              </span>
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">
              {DIMENSION_INFO[result.primaryDimension].label}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {primaryArchetype.summary}
            </p>
          </Card>

          {/* Secondary Dimension */}
          {secondaryArchetype && result.secondaryDimension ? (
            <Card className="p-6 space-y-3 border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  {isHindi ? 'सहायक आयाम (Secondary)' : 'Secondary Dimension'}
                </span>
                <span className="text-xs font-mono font-bold text-purple-900 dark:text-purple-200 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-purple-100 dark:border-purple-800">
                  {result.dimensionScores[result.secondaryDimension]} pts
                </span>
              </div>
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">
                {DIMENSION_INFO[result.secondaryDimension].label} • {secondaryArchetype.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {secondaryArchetype.summary}
              </p>
            </Card>
          ) : null}
        </div>
      </div>

      {/* 3. STRENGTHS & GROWTH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {isHindi ? 'व्यक्तित्व की मुख्य ताकतें' : 'Archetypal Strengths'}
          </h3>
          <ul className="space-y-2.5">
            {primaryArchetype.strengths.map((str, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Growth Vectors */}
        <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {isHindi ? 'विकास एवं सावधानी बिंदु' : 'Evolutionary Growth Vectors'}
          </h3>
          <ul className="space-y-2.5">
            {primaryArchetype.challenges.map((ch, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  →
                </span>
                <span>{ch}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 4. PREMIUM PERSONALITY CTA */}
      <Card className="p-8 sm:p-10 border-2 border-purple-200 dark:border-purple-800/80 bg-gradient-to-br from-purple-50/60 via-indigo-50/40 to-white dark:from-purple-950/30 dark:via-[#0D121F] dark:to-[#0D121F] shadow-xl space-y-6">
        <div className="space-y-2">
          <Badge variant="secondary" size="sm">{isHindi ? 'विस्तृत प्रोफ़ाइल' : 'Comprehensive Profile'}</Badge>
          <h3 className="text-xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
            {isHindi ? 'कम्प्लीट पर्सनालिटी रिपोर्ट अनलॉक करें' : 'Unlock the Complete Personality Report'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {isHindi
              ? 'संवाद शैली, सीखने की प्रक्रिया, करियर के रुझान और रिश्तों के सामंजस्य की गहरी अंतर्दृष्टि प्राप्त करें।'
              : 'Gain deeper visibility into your communication dynamics, learning patterns, career tendencies, and harmonic relationship resonance.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2">
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" /><span>{isHindi ? 'पूर्ण 50-प्रश्न गहन मैट्रिक्स' : 'Full 50-question deep matrix'}</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" /><span>{isHindi ? '6 मनोवैज्ञानिक आयाम विश्लेषण' : 'Six dimension diagnostics'}</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" /><span>{isHindi ? 'रिश्तों का सामंजस्य' : 'Relationship compatibility'}</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" /><span>{isHindi ? 'करियर एवं नेतृत्व शैली' : 'Career & leadership style'}</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" /><span>{isHindi ? 'संवाद रणनीतियां' : 'Communication strategies'}</span></div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" /><span>{isHindi ? 'व्यक्तिगत विकास रोडमैप' : 'Personal growth roadmap'}</span></div>
          <div className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" /><span className="text-slate-500 dark:text-slate-400">{isHindi ? 'AI रिपोर्ट सम्मिलित' : 'AI Report Included'}</span></div>
          <div className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" /><span className="text-slate-500 dark:text-slate-400">{isHindi ? 'PDF निर्यात' : 'PDF Export'}</span></div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link to={ROUTES.CHECKOUT.replace(':productId', 'complete')}>
            <Button
              size="lg"
              variant="primary"
              onClick={() => analytics.logEvent('premium_cta_clicked', { source: 'personality_result_page' })}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="dark:shadow-neon-glow"
            >
              {isHindi ? 'कम्प्लीट रिपोर्ट अनलॉक करें (₹99)' : 'Unlock Complete Report (₹99)'}
            </Button>
          </Link>
        </div>
      </Card>

      {/* 5. FUSION ACTION BANNER */}
      <Card className="p-6 sm:p-8 border-indigo-200 dark:border-indigo-800/80 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-white dark:from-indigo-950/40 dark:via-[#0D121F] dark:to-[#0D121F] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[11px] font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>{isHindi ? 'फ्यूजन विश्लेषण तैयार' : 'Multi-Layer Fusion Ready'}</span>
            </div>
            <h4 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              {t.personalityResult.unlockFusionCta}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
              {t.personalityResult.unlockFusionDesc}
            </p>
          </div>

          {cachedNumberResult ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => handleCreateFusion(cachedNumberResult)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="dark:shadow-neon-glow"
            >
              {isHindi
                ? `अंक #${cachedNumberResult.primaryNumber} (${cachedNumberResult.dominantNumbers[0]?.theme}) के साथ फ्यूज करें`
                : `Fuse with #${cachedNumberResult.primaryNumber} (${cachedNumberResult.dominantNumbers[0]?.theme})`}
            </Button>
          ) : (
            <form onSubmit={handleQuickFusionSubmit} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                type="tel"
                placeholder={isHindi ? '10-अंकीय नंबर दर्ज करें' : 'Enter 10-digit number'}
                value={quickNumber}
                onChange={(e) => setQuickNumber(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-600"
              />
              <Button type="submit" size="md" variant="primary" rightIcon={<Compass className="w-4 h-4" />}>
                {isHindi ? 'फ्यूजन बनाएं' : 'Generate Fusion'}
              </Button>
            </form>
          )}
        </div>
      </Card>

      <DisclaimerBanner variant="card" />
    </div>
  );
};
