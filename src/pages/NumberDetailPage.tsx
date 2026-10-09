import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, CheckCircle2 } from 'lucide-react';
import { NUMBER_PROFILES } from '../data/numberProfiles';
import { NUMBER_INFLUENCE_MATRIX } from '../data/influenceMatrix';
import { SingleDigit, DimensionKey } from '../types/number';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DimensionBar } from '../components/common/DimensionBar';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { ROUTES } from '../config/routes';

export const NumberDetailPage: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  const parsed = parseInt(number || '0', 10);
  const isValid = !isNaN(parsed) && parsed >= 0 && parsed <= 9;
  const validDigit = (isValid ? parsed : 0) as SingleDigit;

  const profile = NUMBER_PROFILES[validDigit];
  const matrixRow = NUMBER_INFLUENCE_MATRIX[validDigit];

  const dimensions: DimensionKey[] = [
    'curiosity',
    'independence',
    'leadership',
    'social',
    'emotional',
    'stability',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 animate-fade-in">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* 0-9 Quick Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <Link
              key={n}
              to={`/number/${n}`}
              className={`w-8 h-8 rounded-xl text-xs font-display font-bold flex items-center justify-center transition-all ${
                n === validDigit
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {n}
            </Link>
          ))}
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-display font-black text-3xl sm:text-4xl shadow-lg shadow-indigo-500/30 shrink-0">
              {profile.number}
            </div>
            <div className="space-y-1">
              <Badge variant="gold" size="sm">
                Theme: {profile.theme}
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white">
                {profile.tagline}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Archetypal meaning, behavioral strengths, and dimension baseline.
              </p>
            </div>
          </div>

          <Link to={ROUTES.NUMBER_ANALYSIS}>
            <Button variant="primary" size="md" rightIcon={<Compass className="w-4 h-4" />}>
              Analyze My Number
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview & Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 sm:p-8 space-y-6 lg:col-span-2 border-slate-200">
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Core Meaning & Essence
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {profile.description}
            </p>
          </div>

          {/* Strengths and Challenges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Key Strengths
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {profile.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Potential Challenges
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {profile.challenges.map((ch, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      →
                    </span>
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Matrix Baseline Dimensions */}
        <Card className="p-6 space-y-4 border-slate-200">
          <div>
            <h2 className="text-base font-display font-bold text-slate-900 mb-1">
              Influence Baseline
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Standard Engine v1.0 matrix weight for digit {profile.number}.
            </p>

            <div className="space-y-3">
              {dimensions.map((dim) => (
                <DimensionBar key={dim} dimension={dim} score={matrixRow[dim]} />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 6 Pillars Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-display font-bold text-slate-900">
          Archetypal Facets of #{profile.number}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-5 space-y-2 border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Relationships & Bonds
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {profile.relationship}
            </p>
          </Card>

          <Card className="p-5 space-y-2 border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Career & Ambition
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {profile.career}
            </p>
          </Card>

          <Card className="p-5 space-y-2 border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Money & Resources
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {profile.money}
            </p>
          </Card>

          <Card className="p-5 space-y-2 border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Communication Style
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {profile.communication}
            </p>
          </Card>

          <Card className="p-5 space-y-2 border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Learning & Mastery
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {profile.learning}
            </p>
          </Card>

          <Card className="p-5 space-y-2 border-slate-200 bg-indigo-50/40 border-indigo-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-800">
              Growth Evolution
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {profile.growth}
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="pt-4 text-center">
        <Link to={ROUTES.NUMBER_ANALYSIS}>
          <Button size="lg" variant="primary" rightIcon={<Compass className="w-5 h-5" />}>
            Analyze My Number
          </Button>
        </Link>
      </div>

      <DisclaimerBanner variant="card" />
    </div>
  );
};
