import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { ROUTES } from '../config/routes';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedPersonalityArchetype } from '../i18n/profileHelpers';

export const PersonalityTypeDetailPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { language, isHindi } = useLanguage();

  const archetypeKey = (type || 'explorer').toLowerCase();
  const archetype = getLocalizedPersonalityArchetype(archetypeKey, language);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 animate-fade-in text-slate-800 dark:text-slate-200">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(ROUTES.PERSONALITY_TYPES)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHindi ? 'सभी व्यक्तित्व प्रकार' : 'All Personality Types'}</span>
        </button>

        <Badge variant="secondary" size="sm">
          {archetype.code}
        </Badge>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-3 relative overflow-hidden border border-purple-800/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{archetype.subtitle}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white">
          {archetype.title}
        </h1>

        <p className="text-sm sm:text-base text-purple-200 max-w-2xl leading-relaxed">
          "{archetype.tagline}"
        </p>
      </div>

      {/* Summary & Core Traits */}
      <Card className="p-6 sm:p-10 space-y-6 border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            {isHindi ? 'आर्केटाइप का संक्षिप्त परिचय' : 'Archetypal Overview'}
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {archetype.summary}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            {isHindi ? 'मुख्य हस्ताक्षर विशेषताएँ' : 'Core Signature Traits'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {archetype.coreTraits.map((trait, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 text-xs font-semibold border border-purple-100 dark:border-purple-800"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Strengths & Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {isHindi ? 'मुख्य व्यावहारिक ताकतें' : 'Observable Strengths'}
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {archetype.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {isHindi ? 'विकास एवं सावधानी के क्षेत्र' : 'Evolutionary Growth Areas'}
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {archetype.challenges.map((ch, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  →
                </span>
                <span>{ch}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 5 Facets Breakdown (Relationships, Career, Communication, Learning, Growth) */}
      <div className="space-y-4">
        <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
          {isHindi ? 'व्यक्तित्व के विभिन्न पहलू एवं गतिशीलता' : 'Archetypal Facets & Dynamics'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-5 space-y-2 border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              {isHindi ? 'रिश्ते एवं संबंध' : 'Relationships & Bonds'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {archetype.relationships}
            </p>
          </Card>

          <Card className="p-5 space-y-2 border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              {isHindi ? 'करियर एवं नेतृत्व' : 'Career & Ambition'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {archetype.career}
            </p>
          </Card>

          <Card className="p-5 space-y-2 border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              {isHindi ? 'संवाद शैली' : 'Communication Style'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {archetype.communication}
            </p>
          </Card>

          <Card className="p-5 space-y-2 border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              {isHindi ? 'सीखने की शैली' : 'Learning & Mastery'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {archetype.learning}
            </p>
          </Card>

          <Card className="p-5 space-y-2 border-slate-200 dark:border-slate-800 bg-purple-50/40 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/40 sm:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
              {isHindi ? 'व्यक्तिगत विकास की दिशा' : 'Evolutionary Growth Vector'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {archetype.growth}
            </p>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-4 text-center">
        <Link to={ROUTES.PERSONALITY_TEST}>
          <Button size="lg" variant="primary" rightIcon={<Compass className="w-5 h-5" />}>
            {isHindi ? 'व्यक्तित्व मूल्यांकन शुरू करें' : 'Take Personality Assessment'}
          </Button>
        </Link>
      </div>

      <DisclaimerBanner variant="card" />
    </div>
  );
};
