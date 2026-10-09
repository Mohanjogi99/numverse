import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { PRODUCTS } from '../config/products';
import { getQuestionsForTier } from '../data/personalityQuestions';
import { PersonalityTier, PersonalityAnswer } from '../types/personality';
import { evaluatePersonalityTest } from '../engine/personalityEngine';
import { analytics } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export const PersonalityTestPage: React.FC = () => {
  const { tier: tierParam } = useParams<{ tier?: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t, isHindi, getQuestionText, getOptionLabel } = useLanguage();

  const [selectedTier, setSelectedTier] = useState<PersonalityTier>(
    (tierParam as PersonalityTier) || 'free'
  );
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<PersonalityAnswer[]>([]);
  const [validationError, setValidationError] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  // Normalize tier parameter
  useEffect(() => {
    if (tierParam) {
      const validTiers: PersonalityTier[] = ['free', 'standard', 'complete', 'quick', 'deep'];
      if (validTiers.includes(tierParam as PersonalityTier)) {
        const normTier: PersonalityTier =
          tierParam === 'quick' ? 'free' : tierParam === 'deep' ? 'complete' : (tierParam as PersonalityTier);
        setSelectedTier(normTier);
        setHasStarted(true);

        // Restore partial progress if available
        const savedProgress = sessionStorage.getItem(`ns_test_progress_${normTier}`);
        if (savedProgress) {
          try {
            const parsed = JSON.parse(savedProgress);
            if (Array.isArray(parsed.answers) && parsed.answers.length > 0) {
              setAnswers(parsed.answers);
              setCurrentQuestionIndex(Math.min(parsed.answers.length, getQuestionsForTier(normTier).length - 1));
            }
          } catch (e) {
            console.warn('Could not parse partial test progress', e);
          }
        }
      }
    }
  }, [tierParam]);

  const activeQuestions = getQuestionsForTier(selectedTier);
  const totalQuestions = activeQuestions.length;

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const currentAnswer = currentQuestion
    ? answers.find((a) => a.questionId === currentQuestion.id)
    : null;

  const handleSelectOption = (questionId: string, optionId: string, weight: number) => {
    setValidationError('');
    const existingIndex = answers.findIndex((a) => a.questionId === questionId);
    let updated: PersonalityAnswer[];

    if (existingIndex >= 0) {
      updated = [...answers];
      updated[existingIndex] = { questionId, selectedOptionId: optionId, value: weight };
    } else {
      updated = [...answers, { questionId, selectedOptionId: optionId, value: weight }];
    }

    setAnswers(updated);
    sessionStorage.setItem(
      `ns_test_progress_${selectedTier}`,
      JSON.stringify({ tier: selectedTier, answers: updated })
    );

    // Auto-advance after brief delay for smooth interaction
    if (currentQuestionIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 200);
    } else {
      // Last question answered
      if (updated.length === totalQuestions) {
        setIsFinished(true);
      }
    }
  };

  const handleNext = () => {
    if (!currentAnswer) {
      setValidationError(isHindi ? 'कृपया जारी रखने से पहले एक विकल्प चुनें।' : 'Please select an option before continuing.');
      return;
    }
    setValidationError('');

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    setValidationError('');
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleStartTest = (tier: PersonalityTier) => {
    setSelectedTier(tier);
    setHasStarted(true);
    setCurrentQuestionIndex(0);
    analytics.logEvent('personality_test_start', { tier });
  };

  const handleCompleteTest = () => {
    if (answers.length < totalQuestions) {
      showToast(isHindi ? 'कृपया सभी प्रश्नों के उत्तर दें।' : 'Please answer all questions before submitting.', 'warning');
      setIsFinished(false);
      return;
    }

    try {
      const result = evaluatePersonalityTest(selectedTier, answers);
      sessionStorage.setItem(`ns_personality_${result.id}`, JSON.stringify(result));
      sessionStorage.removeItem(`ns_test_progress_${selectedTier}`);

      analytics.logEvent('personality_test_complete', {
        tier: selectedTier,
        primaryArchetype: result.primaryArchetype.id,
      });

      navigate(`/personality-result/${result.id}`);
    } catch (e) {
      console.error('[PersonalityTest] Evaluation error:', e);
      showToast(isHindi ? 'परिणाम का मूल्यांकन करने में त्रुटि हुई।' : 'Error calculating personality score.', 'error');
    }
  };

  // 1. TIER SELECTION SCREEN
  if (!hasStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.personalityTest.title}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.personalityTest.selectTier}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {t.personalityTest.subtitle}
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FREE (10 Questions) */}
          <Card
            variant="interactive"
            onClick={() => setSelectedTier('free')}
            className={`p-6 sm:p-7 space-y-5 border-2 transition-all flex flex-col justify-between ${
              selectedTier === 'free'
                ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-950/60 bg-indigo-50/20 dark:bg-indigo-950/30'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.home.freeTitle}</span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  10 {isHindi ? 'प्रश्न' : 'Questions'}
                </span>
              </div>
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white">{PRODUCTS.free.formattedPrice}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.personalityTest.miniTierDesc}
              </p>
            </div>
            <Button
              size="md"
              className="w-full mt-4 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-500 hover:via-pink-400 hover:to-amber-400 text-white font-bold shadow-md shadow-pink-500/20 border-none transition-all"
              onClick={() => handleStartTest('free')}
            >
              {t.personalityTest.startTestBtn}
            </Button>
          </Card>

          {/* STANDARD (25 Questions) */}
          <Card
            variant="interactive"
            onClick={() => setSelectedTier('standard')}
            className={`p-6 sm:p-7 space-y-5 border-2 transition-all flex flex-col justify-between ${
              selectedTier === 'standard'
                ? 'border-pink-500/80 ring-2 ring-pink-500/20 bg-pink-500/5 dark:bg-purple-950/40'
                : 'border-slate-200 dark:border-purple-900/30 dark:bg-[#110F22]/80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">{t.home.standardTitle}</span>
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
                  25 {isHindi ? 'प्रश्न' : 'Questions'}
                </span>
              </div>
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white">{PRODUCTS.standard.formattedPrice}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.personalityTest.standardTierDesc}
              </p>
            </div>
            <Button
              size="md"
              className="w-full mt-4 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-500 hover:via-pink-400 hover:to-amber-400 text-white font-bold shadow-md shadow-pink-500/20 border-none transition-all"
              onClick={() => handleStartTest('standard')}
            >
              {t.personalityTest.startTestBtn}
            </Button>
          </Card>

          {/* COMPLETE (50 Questions) */}
          <Card
            variant="interactive"
            onClick={() => setSelectedTier('complete')}
            className={`p-6 sm:p-7 space-y-5 border-2 transition-all flex flex-col justify-between ${
              selectedTier === 'complete'
                ? 'border-pink-500/80 ring-2 ring-pink-500/20 bg-pink-500/5 dark:bg-purple-950/40'
                : 'border-slate-200 dark:border-purple-900/30 dark:bg-[#110F22]/80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">{t.home.completeTitle}</span>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                  50 {isHindi ? 'प्रश्न' : 'Questions'}
                </span>
              </div>
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white">{PRODUCTS.complete.formattedPrice}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.personalityTest.completeTierDesc}
              </p>
            </div>
            <Button
              size="md"
              className="w-full mt-4 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-500 hover:via-pink-400 hover:to-amber-400 text-white font-bold shadow-md shadow-pink-500/20 border-none transition-all"
              onClick={() => handleStartTest('complete')}
            >
              {t.personalityTest.startTestBtn}
            </Button>
          </Card>
        </div>

        {/* Test Instructions */}
        <Card className="p-6 sm:p-8 bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-4 max-w-3xl mx-auto">
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-base sm:text-lg">
            {isHindi ? 'शुरू करने से पहले आवश्यक जानकारी' : 'Before You Begin'}
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span>{isHindi ? 'इसमें कोई सही या गलत उत्तर नहीं है।' : 'There are no right or wrong answers.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span>{isHindi ? 'वही विकल्प चुनें जो आपके वास्तविक स्वभाव के सबसे करीब हो।' : 'Choose the response that feels most like you.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span>{isHindi ? 'उत्तर पैमाना: पूर्णतः असहमत • असहमत • तटस्थ • सहमत • पूर्णतः सहमत।' : 'Response scale: Strongly Disagree • Disagree • Neutral • Agree • Strongly Agree.'}</span>
            </li>
          </ul>
          <div className="pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => handleStartTest(selectedTier)}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t.personalityTest.startTestBtn}
            </Button>
          </div>
        </Card>

        <DisclaimerBanner variant="card" />
      </div>
    );
  }

  // 2. TEST COMPLETION STATE
  if (isFinished) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <Card className="p-8 sm:p-10 space-y-5 border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-[#0D121F]">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
              {isHindi ? 'परीक्षण सफलतापूर्वक संपन्न हुआ!' : 'Your answers are complete.'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isHindi
                ? `${selectedTier.toUpperCase()} स्तर के सभी ${totalQuestions} प्रश्न पूरे कर लिए गए हैं।`
                : `All ${totalQuestions} questions completed for the ${selectedTier.toUpperCase()} tier.`}
            </p>
          </div>
          <div className="pt-2">
            <Button
              size="lg"
              variant="gold"
              className="w-full shadow-card shadow-amber-500/20"
              onClick={handleCompleteTest}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              {t.personalityResult.title}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 3. QUESTION SCREEN
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-fade-in">
      {/* Test Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
          <button
            type="button"
            onClick={() => setHasStarted(false)}
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHindi ? 'स्तर बदलें' : 'Change Tier'}</span>
          </button>
          <span>
            {t.personalityTest.questionCounter} {currentQuestionIndex + 1} / {totalQuestions} ({progressPercent}%)
          </span>
        </div>
        <ProgressBar value={progressPercent} size="sm" variant="primary" />
      </div>

      {/* Question Card */}
      <Card className="p-6 sm:p-10 border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md border border-transparent dark:border-indigo-900/40">
            {isHindi ? `आयाम: ${currentQuestion.category}` : `Dimension: ${currentQuestion.category}`}
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white leading-snug">
            {getQuestionText(currentQuestion)}
          </h2>
        </div>

        {/* 5 Response Options */}
        <fieldset className="space-y-3" role="radiogroup" aria-label={getQuestionText(currentQuestion)}>
          <legend className="sr-only">{getQuestionText(currentQuestion)}</legend>
          {currentQuestion.options.map((opt) => {
            const isSelected = currentAnswer?.selectedOptionId === opt.id;
            const localizedLabel = getOptionLabel(opt.weight);
            return (
              <label
                key={opt.id}
                className={`w-full flex items-center justify-between p-4 sm:p-4.5 rounded-2xl border cursor-pointer transition-all duration-150 select-none ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 dark:ring-indigo-400/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0E18] hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className={`text-sm sm:text-base ${isSelected ? 'font-bold text-indigo-950 dark:text-indigo-200' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                  {localizedLabel || opt.label}
                </span>
                <input
                  type="radio"
                  name={`question_${currentQuestion.id}`}
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => handleSelectOption(currentQuestion.id, opt.id, opt.weight)}
                  className="w-5 h-5 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
            );
          })}
        </fieldset>

        {validationError && (
          <p className="text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-medium animate-pulse" role="alert">
            {validationError}
          </p>
        )}

        {/* Test Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentQuestionIndex === 0}
            onClick={handlePrevious}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {t.personalityTest.prevBtn}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="dark:shadow-neon-glow"
          >
            {currentQuestionIndex === totalQuestions - 1 ? t.personalityTest.finishBtn : t.personalityTest.nextBtn}
          </Button>
        </div>
      </Card>

      <DisclaimerBanner variant="inline" />
    </div>
  );
};
