import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Calendar, ArrowRight, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { analyzeMobile } from '../engine/numberEngine';
import { analyzeDateOfBirth } from '../engine/dobEngine';
import { isValidDobString } from '../utils/validation';
import { analytics } from '../services/analyticsService';
import { useLanguage } from '../context/LanguageContext';

export const NumberAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, isHindi } = useLanguage();
  const [tab, setTab] = useState<'mobile' | 'dob'>('mobile');

  // Mobile state
  const [mobileInput, setMobileInput] = useState('');
  const [mobileError, setMobileError] = useState('');

  // DOB state
  const [dobInput, setDobInput] = useState('');
  const [dobError, setDobError] = useState('');

  // Multi-stage loading state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = mobileInput.trim();

    if (!cleanInput) {
      setMobileError(t.numberAnalysis.invalidMobile);
      return;
    }

    const digitsOnly = cleanInput.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setMobileError(t.numberAnalysis.invalidMobile);
      return;
    }

    setMobileError('');
    setIsAnalyzing(true);
    analytics.logEvent('number_analysis_start', { type: 'mobile' });

    // Multi-stage loading animation
    setLoadingStage(isHindi ? 'आपके अंकों का विश्लेषण किया जा रहा है...' : 'Analyzing your numbers...');
    setTimeout(() => {
      setLoadingStage(isHindi ? 'मुख्य ऊर्जा थीम की पहचान हो रही है...' : 'Finding your dominant themes...');
      setTimeout(() => {
        setLoadingStage(isHindi ? 'आपकी प्रोफ़ाइल तैयार की जा रही है...' : 'Building your profile...');
        setTimeout(() => {
          const result = analyzeMobile(mobileInput);
          sessionStorage.setItem(`ns_analysis_${result.id}`, JSON.stringify(result));
          analytics.logEvent('number_analysis_complete', {
            type: 'mobile',
            dominantNumber: result.primaryNumber,
          });
          navigate(`/number-result/${result.id}`);
        }, 600);
      }, 600);
    }, 600);
  };

  const handleDobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dobInput.trim() || !isValidDobString(dobInput)) {
      setDobError(t.numberAnalysis.invalidDob);
      return;
    }

    setDobError('');
    setIsAnalyzing(true);
    analytics.logEvent('number_analysis_start', { type: 'dob' });

    setLoadingStage(isHindi ? 'आपकी जन्मतिथि का विश्लेषण हो रहा है...' : 'Analyzing your birth date numbers...');
    setTimeout(() => {
      setLoadingStage(isHindi ? 'मूल जीवन आवृत्तियों की गणना हो रही है...' : 'Calculating core life frequencies...');
      setTimeout(() => {
        setLoadingStage(isHindi ? 'आपकी प्रोफ़ाइल तैयार की जा रही है...' : 'Building your profile...');
        setTimeout(() => {
          const result = analyzeDateOfBirth(dobInput);
          sessionStorage.setItem(`ns_dob_${result.id}`, JSON.stringify(result));
          const mobileResult = analyzeMobile(result.rawDate.replace(/\D/g, ''));
          sessionStorage.setItem(`ns_analysis_${mobileResult.id}`, JSON.stringify(mobileResult));
          analytics.logEvent('number_analysis_complete', {
            type: 'dob',
            coreNumber: result.coreLifeNumber,
          });
          navigate(`/number-result/${mobileResult.id}`);
        }, 600);
      }, 600);
    }, 600);
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6 animate-fade-in">
        <Card className="p-8 sm:p-10 space-y-6 border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-[#0D121F]">
          <LoadingSpinner size="lg" />
          <div className="space-y-2">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white animate-pulse">
              {loadingStage}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHindi ? 'नंबर स्टोरी इंजन v1.0 मैट्रिक्स लागू किया जा रहा है' : 'Applying Number Story Engine v1.0 deterministic matrix'}
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full animate-[progress_1.8s_ease-in-out_infinite]" style={{ width: '70%' }} />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.common.selfDiscoveryEngine}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.numberAnalysis.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {t.numberAnalysis.subtitle}
        </p>
      </div>

      {/* Main Analysis Card */}
      <Card className="p-6 sm:p-10 border-slate-200/90 dark:border-slate-800 shadow-xl max-w-2xl mx-auto">
        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 dark:bg-slate-900/80 rounded-2xl mb-8 border border-transparent dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setTab('mobile');
              setMobileError('');
              setDobError('');
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              tab === 'mobile'
                ? 'bg-white dark:bg-[#131A2B] text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{t.numberAnalysis.mobileTab}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('dob');
              setMobileError('');
              setDobError('');
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              tab === 'dob'
                ? 'bg-white dark:bg-[#131A2B] text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t.numberAnalysis.dobTab}</span>
          </button>
        </div>

        {tab === 'mobile' ? (
          <form onSubmit={handleMobileSubmit} className="space-y-6" noValidate>
            <Input
              label={t.numberAnalysis.mobileLabel}
              placeholder={t.numberAnalysis.mobilePlaceholder}
              value={mobileInput}
              onChange={(e) => {
                setMobileInput(e.target.value);
                if (mobileError) setMobileError('');
              }}
              error={mobileError}
              helperText={t.numberAnalysis.mobileHint}
              leftIcon={<Smartphone className="w-5 h-5" />}
              autoComplete="tel"
            />

            {/* Privacy Note */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <Lock className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span>{t.numberAnalysis.privacyNotice}</span>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full shadow-card dark:shadow-neon-glow"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t.numberAnalysis.analyzeCta}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleDobSubmit} className="space-y-6" noValidate>
            <Input
              label={t.numberAnalysis.dobLabel}
              type="date"
              value={dobInput}
              onChange={(e) => {
                setDobInput(e.target.value);
                if (dobError) setDobError('');
              }}
              error={dobError}
              helperText={t.numberAnalysis.dobHint}
              leftIcon={<Calendar className="w-5 h-5" />}
            />

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <Lock className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span>{t.numberAnalysis.privacyNotice}</span>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full shadow-card dark:shadow-neon-glow"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t.numberAnalysis.analyzeCta}
            </Button>
          </form>
        )}

        {/* Features Checklist */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{isHindi ? '100% सटीक गणना' : '100% Deterministic calculations'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{isHindi ? '0–9 अंक ऊर्जा मैपिंग' : '0–9 Thematic mapping'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{isHindi ? '6 मनोवैज्ञानिक आयाम' : '6 Psychological dimensions'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{isHindi ? 'गोपनीय और सुरक्षित' : 'Private by design'}</span>
          </div>
        </div>
      </Card>

      <div className="max-w-2xl mx-auto">
        <DisclaimerBanner variant="card" />
      </div>
    </div>
  );
};
