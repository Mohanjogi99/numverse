import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Heart,
  Briefcase,
  Coins,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Share2,
  Printer,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Globe,
  Loader2,
  AlertTriangle,
  Bot,
  Flame,
} from 'lucide-react';
import { FusionAnalysisResult, PillarKey, PillarProfile } from '../types/fusion';
import { StructuredAIReportContent, SupportedLanguage } from '../types/aiReport';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { ResultSkeleton } from '../components/ui/ResultSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { evaluatePersonalityTest } from '../engine/personalityEngine';
import { analyzeMobile } from '../engine/numberEngine';
import { fuseNumberAndPersonality } from '../engine/fusionEngine';
import { aiReportClientService } from '../services/aiReportClientService';
import { ROUTES } from '../config/routes';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { analytics } from '../services/analyticsService';

const PILLAR_ICONS: Record<PillarKey, React.ReactNode> = {
  love: <Heart className="w-5 h-5 text-rose-500" />,
  career: <Briefcase className="w-5 h-5 text-blue-500" />,
  money: <Coins className="w-5 h-5 text-amber-500" />,
  communication: <MessageSquare className="w-5 h-5 text-emerald-500" />,
  learning: <BookOpen className="w-5 h-5 text-purple-500" />,
  growth: <TrendingUp className="w-5 h-5 text-indigo-500" />,
};

export const ReportViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isLockedPreview = searchParams.get('locked') === 'true';
  const { showToast } = useToast();
  const { language, setLanguage, t } = useLanguage();

  const [fusion, setFusion] = useState<FusionAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePillar, setActivePillar] = useState<PillarKey>('love');

  // AI Narrative State
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language);
  const [aiContent, setAiContent] = useState<StructuredAIReportContent | null>(null);
  const [aiStatus, setAiStatus] = useState<'idle' | 'generating' | 'ready' | 'failed'>('idle');
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);
  const [hasEntitlement, setHasEntitlement] = useState(false);


  useEffect(() => {
    if (fusion) {
      import('../services/paymentClientService').then(({ paymentClientService }) => {
        paymentClientService.checkAccess('combo', fusion.id).then((access) => {
          setHasEntitlement(access);
        });
      });
    }
  }, [fusion]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    let loadedFusion: FusionAnalysisResult | null = null;

    if (id) {
      const stored = sessionStorage.getItem(`ns_fusion_${id}`);
      if (stored) {
        try {
          loadedFusion = JSON.parse(stored);
        } catch (e) {
          console.warn('Failed to parse cached fusion report:', e);
        }
      }
    }

    // Fallback synthesis if no cached fusion report exists yet
    if (!loadedFusion) {
      try {
        let numRes = null;
        let persRes = null;

        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (!key) continue;
          if (!numRes && key.startsWith('ns_analysis_')) {
            try {
              numRes = JSON.parse(sessionStorage.getItem(key) || '{}');
            } catch {
              // ignore
            }
          }
          if (!persRes && key.startsWith('ns_personality_')) {
            try {
              persRes = JSON.parse(sessionStorage.getItem(key) || '{}');
            } catch {
              // ignore
            }
          }
        }

        if (!numRes) {
          numRes = analyzeMobile('9876543210');
        }
        if (!persRes) {
          persRes = evaluatePersonalityTest('complete', [
            { questionId: 'q1', selectedOptionId: 'opt_5', value: 5 },
            { questionId: 'q2', selectedOptionId: 'opt_4', value: 4 },
            { questionId: 'q3', selectedOptionId: 'opt_4', value: 4 },
            { questionId: 'q4', selectedOptionId: 'opt_3', value: 3 },
            { questionId: 'q5', selectedOptionId: 'opt_4', value: 4 },
            { questionId: 'q6', selectedOptionId: 'opt_2', value: 2 },
            { questionId: 'q7', selectedOptionId: 'opt_5', value: 5 },
            { questionId: 'q8', selectedOptionId: 'opt_4', value: 4 },
            { questionId: 'q9', selectedOptionId: 'opt_3', value: 3 },
            { questionId: 'q10', selectedOptionId: 'opt_5', value: 5 },
          ]);
        }

        loadedFusion = fuseNumberAndPersonality(numRes, persRes);
      } catch (err) {
        console.error('Error generating report fallback:', err);
        setError('Unable to assemble your complete report. Please complete an assessment first.');
      }
    }

    if (loadedFusion) {
      setFusion(loadedFusion);
      analytics.logEvent('page_view', { page: 'fusion_report', id: loadedFusion.id });

      // Check if AI report already cached for default language
      const cachedAi = sessionStorage.getItem(`ns_ai_report_${loadedFusion.id}_${selectedLanguage}`);
      if (cachedAi) {
        try {
          const parsed = JSON.parse(cachedAi);
          setAiContent(parsed);
          setAiStatus('ready');
        } catch {
          // ignore
        }
      }
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id, selectedLanguage]);

  const handleGenerateAIReport = async () => {
    if (!fusion) return;

    setAiStatus('generating');
    setAiErrorMessage(null);
    analytics.logEvent('page_view', { action: 'generate_ai_report', language: selectedLanguage });

    try {
      const response = await aiReportClientService.requestAIReport(fusion, selectedLanguage, false);

      if (response.success && response.aiContent) {
        setAiContent(response.aiContent);
        setAiStatus('ready');
        showToast(
          selectedLanguage === 'hi'
            ? 'आपकी व्यक्तिगत AI कहानी तैयार है।'
            : 'Your personalized AI story is ready.',
          'success'
        );
      } else {
        setAiStatus('failed');
        setAiErrorMessage(
          response.error?.userMessage ||
            "We couldn't generate your personalized story right now. Please try again."
        );
        showToast('AI narrative generation notice: Displaying deterministic analysis.', 'info');
      }
    } catch (err) {
      console.error('Error in AI Report Generation:', err);
      setAiStatus('failed');
      setAiErrorMessage("We couldn't generate your personalized story right now. Please try again.");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Report link copied to clipboard.', 'success');
      analytics.logEvent('share_clicked', { type: 'report_link' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
        <ResultSkeleton />
      </div>
    );
  }

  if (error || !fusion) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <ErrorState
          title="Report Unavailable"
          message={error || 'We could not find the requested fusion report.'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const currentPillar: PillarProfile = fusion.pillars[activePillar] || fusion.pillars.love;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 animate-fade-in">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.report.returnHome}</span>
        </Link>
        <div className="flex items-center gap-2">
          {/* Language toggle for AI narrative */}
          <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl text-xs font-semibold border border-slate-200/60 dark:border-slate-800">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <button
              onClick={() => {
                setSelectedLanguage('en');
                setLanguage('en');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedLanguage === 'en' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => {
                setSelectedLanguage('hi');
                setLanguage('hi');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedLanguage === 'hi' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            onClick={handleShare}
          >
            {t.report.share}
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={handlePrint}
          >
            {t.report.print}
          </Button>
        </div>
      </div>

      {/* Locked Overlay Banner if in locked preview state and not yet entitled */}
      {isLockedPreview && !hasEntitlement && (
        <Card className="p-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-amber-400/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">{t.report.lockedTitle}</h3>
              <p className="text-xs text-amber-100">
                {t.report.lockedDesc}
              </p>
            </div>
          </div>
          <Link to={`/checkout/combo?reportId=${fusion.id}`}>
            <Button size="sm" variant="secondary" className="whitespace-nowrap shadow-md">
              {t.report.unlockReport} (₹149)
            </Button>
          </Link>
        </Card>
      )}

      {/* 1. Hero Identity Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl space-y-6 relative overflow-hidden border border-indigo-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-purple-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.report.synergyIndex}: {fusion.overallSynergyScore}%</span>
          </div>
          <Badge variant="primary" size="sm" className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
            Deterministic Engine v{fusion.engineVersion} • Report v{fusion.reportVersion}
          </Badge>
        </div>

        <div className="space-y-2 relative z-10">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-300">
            {t.report.unifiedIdentity}
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white">
            {fusion.fusionIdentity.name}
          </h1>
          <p className="text-purple-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            {fusion.fusionNarrative.summary}
          </p>
        </div>

        {/* 40% Number + 60% Personality Formula callout */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-purple-200 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>40% Number Frequency (Theme: <strong>{fusion.fusionIdentity.numberTheme}</strong>)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span>60% Personality Assessment (Type: <strong>{fusion.fusionIdentity.archetypeTitle}</strong>)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Deterministic Matrix Synthesis</span>
          </div>
        </div>
      </div>

      {/* 2. AI Personalized Story Section */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-slate-100">
                  {selectedLanguage === 'hi' ? 'आपकी व्यक्तिगत AI कहानी' : 'Your Personalized AI Story'}
                </h2>
                <Badge variant="gold" size="sm">
                  AI Narrative Layer
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedLanguage === 'hi'
                  ? 'आपकी आधिकारिक नंबर स्टोरी प्रोफ़ाइल पर आधारित संरचित व्यक्तिगत आत्म-चिंतन।'
                  : 'Synthesized narrative written from your authoritative deterministic profile.'}
              </p>
            </div>
          </div>

          {aiStatus !== 'generating' && (
            <Button
              size="sm"
              variant={aiStatus === 'ready' ? 'outline' : 'primary'}
              leftIcon={<Flame className="w-4 h-4 text-amber-500" />}
              onClick={handleGenerateAIReport}
            >
              {aiStatus === 'ready'
                ? selectedLanguage === 'hi'
                  ? 'कहानी पुनः उत्पन्न करें'
                  : 'Regenerate Story'
                : selectedLanguage === 'hi'
                ? 'मेरी व्यक्तिगत कहानी बनाएं'
                : 'Generate My Personalized Story'}
            </Button>
          )}
        </div>


        {/* AI Loading State */}
        {aiStatus === 'generating' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto animate-spin">
              <Loader2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-slate-900 text-base">
                {selectedLanguage === 'hi'
                  ? 'आपकी व्यक्तिगत कहानी तैयार की जा रही है...'
                  : 'Preparing your personalized story...'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {selectedLanguage === 'hi'
                  ? 'ओपनएआई रिस्पॉन्स एपीआई द्वारा आपकी संरचित प्रोफाइल का विश्लेषण किया जा रहा है।'
                  : 'Weaving your 40% numeric patterns and 60% personality dimensions into a cohesive reflection.'}
              </p>
            </div>
          </div>
        )}

        {/* AI Failed Notice with Fallback */}
        {aiStatus === 'failed' && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {selectedLanguage === 'hi' ? 'AI सूचना' : 'AI Narrative Notice'}
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                {aiErrorMessage || "We couldn't generate your personalized story right now. Please try again."}
              </p>
              <div className="pt-2">
                <Button size="sm" variant="outline" onClick={handleGenerateAIReport}>
                  {selectedLanguage === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* AI Ready Narrative Content */}
        {aiStatus === 'ready' && aiContent && (
          <div className="space-y-6 animate-fade-in">
            {/* Signature Sentence Callout */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white shadow-lg space-y-2 border border-indigo-800/40">
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">
                Core Signature Reflection
              </span>
              <p className="text-base sm:text-lg font-display italic font-medium leading-relaxed">
                "{aiContent.signatureSentence}"
              </p>
            </div>

            {/* Executive Summary */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {selectedLanguage === 'hi' ? 'सारांश' : 'Executive Reflection'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {aiContent.summary}
              </p>
            </div>

            {/* Full Story Narrative */}
            <div className="space-y-3">
              <h4 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-slate-100">
                {aiContent.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                {aiContent.story}
              </p>
            </div>

            {/* Strengths & Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{selectedLanguage === 'hi' ? 'प्रमुख सामर्थ्य' : 'Observed Strengths'}</span>
                </h5>
                <ul className="space-y-1.5">
                  {aiContent.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>{selectedLanguage === 'hi' ? 'चिंतन बिंदु' : 'Reflection Opportunities'}</span>
                </h5>
                <ul className="space-y-1.5">
                  {aiContent.challenges.map((c, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Multi-Pillar Deep Dive Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>{selectedLanguage === 'hi' ? 'संबंध' : 'Relationships'}</span>
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                  {aiContent.relationships}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                  <span>{selectedLanguage === 'hi' ? 'कार्यक्षेत्र' : 'Career Dynamic'}</span>
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                  {aiContent.career}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>{selectedLanguage === 'hi' ? 'वित्तीय दृष्टिकोण' : 'Money Mindset'}</span>
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                  {aiContent.money}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{selectedLanguage === 'hi' ? 'संवाद शैली' : 'Communication'}</span>
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                  {aiContent.communication}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                  <span>{selectedLanguage === 'hi' ? 'सीखने की शैली' : 'Learning Style'}</span>
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                  {aiContent.learning}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{selectedLanguage === 'hi' ? 'व्यक्तिगत विकास' : 'Personal Growth'}</span>
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                  {aiContent.growth}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty CTA State */}
        {aiStatus === 'idle' && (
          <div className="py-6 text-center space-y-3 bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              {selectedLanguage === 'hi'
                ? 'अपनी संख्या आवृत्ति और व्यक्तित्व आयामों को जोड़कर एक संपूर्ण व्यक्तिगत कहानी उत्पन्न करें।'
                : 'Generate a rich, multi-page personalized narrative that synthesizes your numeric rhythms and personality dimensions into an engaging story.'}
            </p>
            <Button
              size="md"
              variant="primary"
              leftIcon={<Flame className="w-4 h-4 text-amber-300" />}
              onClick={handleGenerateAIReport}
            >
              {selectedLanguage === 'hi'
                ? 'मेरी व्यक्तिगत कहानी बनाएं'
                : 'Generate My Personalized Story'}
            </Button>
          </div>
        )}
      </Card>

      {/* 3. Deterministic 6 Pillars Navigation Tabs */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-slate-100">
            {t.report.pillarsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.report.pillarsDesc}
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {(['love', 'career', 'money', 'communication', 'learning', 'growth'] as PillarKey[]).map((key) => {
            const p = fusion.pillars[key];
            const isActive = activePillar === key;
            return (
              <button
                key={key}
                onClick={() => setActivePillar(key)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-[1.02]'
                    : 'bg-white dark:bg-[#0D121F] hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    {PILLAR_ICONS[key]}
                  </div>
                  <span className={`text-xs font-mono font-bold ${isActive ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {p.score}%
                  </span>
                </div>
                <div>
                  <span className={`block text-xs font-bold capitalize ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {key}
                  </span>
                  <span className={`block text-[10px] ${isActive ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'}`}>
                    {p.scoreBand.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Card */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center">
                {PILLAR_ICONS[activePillar]}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Pillar Analysis
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-slate-100">
                  {currentPillar.title}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-display font-black text-slate-900 dark:text-white">
                  {currentPillar.score}/100
                </span>
                <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  {currentPillar.scoreBand.label}
                </span>
              </div>
              <Badge variant="primary" size="md">
                {currentPillar.scoreBand.label}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {currentPillar.headline}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentPillar.summary}
            </p>
          </div>

          {/* Strengths & Growth Vectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Observed Strengths</span>
              </h5>
              <ul className="space-y-1.5">
                {currentPillar.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Development Recommendations</span>
              </h5>
              <ul className="space-y-1.5">
                {currentPillar.growthAdvice.map((g, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reflection Prompt */}
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100/70 dark:border-purple-900/40 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              Self-Reflection Ingestion
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic">
              "{currentPillar.reflectionPrompt}"
            </p>
          </div>
        </Card>
      </div>


      {/* 4. Fused 6-Dimension Scoreboard (40/60 Weighting) */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Psychological Spectrum
          </span>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-slate-100 mt-1">
            Fused 6-Dimension Scoreboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Calculated via exact formula: (40% Number Frequency) + (60% Assessment Score)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(
            [
              'curiosity',
              'independence',
              'leadership',
              'social',
              'emotional',
              'stability',
            ] as const
          ).map((dim) => {
            const score = fusion.fusedDimensionScores[dim];
            const numScore = fusion.numberResult.dimensionScores[dim];
            const persScore = fusion.personalityResult.dimensionScores[dim];
            return (
              <div key={dim} className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold capitalize text-slate-800 dark:text-slate-200">{dim}</span>
                  <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400">{score}/100</span>
                </div>
                <ProgressBar value={score} max={100} variant="primary" size="md" />
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Number: {numScore} (×0.40)</span>
                  <span>Personality: {persScore} (×0.60)</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 5. Dimension Alignment & Creative Tensions Matrix */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-slate-100">
              Dimension Alignments & Dynamic Tensions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparing latent numerical rhythms against conscious assessment choices.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium">
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">Harmonic (Δ ≤ 15)</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">Complementary (15 &lt; Δ ≤ 35)</span>
            <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">Tension (Δ &gt; 35)</span>
          </div>
        </div>

        <div className="space-y-3">
          {fusion.alignments.map((align) => (
            <div
              key={align.dimension}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold capitalize text-slate-900 dark:text-slate-100">
                  {align.dimension}
                </span>
                <Badge
                  variant={
                    align.status === 'harmonic'
                      ? 'success'
                      : align.status === 'complementary'
                      ? 'primary'
                      : 'gold'
                  }
                  size="sm"
                >
                  {align.status} (Δ {align.delta} pts)
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{align.insight}</p>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Number Frequency: {align.numberScore}</span>
                <span>•</span>
                <span>Self-Assessment: {align.personalityScore}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 6. Immutable Snapshot Metadata Footer & AI Disclosure */}
      <Card className="p-5 border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Deterministic Snapshot #{fusion.snapshot.snapshotId}</span>
          </span>
          <span>Calculated: {new Date(fusion.calculatedAt).toLocaleString()}</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          Some narrative sections of this report are generated with AI from your Number Story profile. Core numbers, scoring formulas, and dimension metrics are computed deterministically without probabilistic modifications.
        </p>
      </Card>

      <DisclaimerBanner variant="card" />
    </div>
  );
};
