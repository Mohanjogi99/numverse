import React from 'react';
import { Sparkles, Shield, Cpu, Compass, Heart } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { APP_CONFIG } from '../config/constants';
import { NUMBER_ENGINE_VERSION } from '../data/influenceMatrix';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Product Philosophy & Principles</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          About {APP_CONFIG.APP_NAME}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          {APP_CONFIG.TAGLINE} A modern self-discovery platform that re-imagines numbers as mirrors for thoughtful reflection.
        </p>
      </div>

      {/* Core Mission */}
      <Card className="p-6 sm:p-10 space-y-4 border-slate-200/90">
        <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2.5">
          <Compass className="w-5 h-5 text-indigo-600" />
          <span>The Concept</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Throughout human culture, numbers have been used to mark time, track resources, and assign order. <strong>Number Story</strong> transforms the numbers surrounding you—such as your mobile sequence and date of birth—into an engaging framework for structured self-reflection.
        </p>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Rather than claiming mystical fortune-telling or deterministic prophecy, Number Story operates on an open, deterministic mathematical engine that maps numerical frequency to archetypal psychological dimensions.
        </p>
      </Card>

      {/* Our 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3 border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-slate-900">Deterministic Engine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Engine v{NUMBER_ENGINE_VERSION} relies entirely on transparent, reproducible matrix calculations. No black-box mysticism.
          </p>
        </Card>

        <Card className="p-6 space-y-3 border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-slate-900">Ethical Framing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We use reflective, non-prescriptive language ("Your profile suggests...", "You may..."). We never make fatalistic assertions.
          </p>
        </Card>

        <Card className="p-6 space-y-3 border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-slate-900">Privacy First</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Calculations are executed client-side. We do not harvest, monetize, or broker your personal phone numbers.
          </p>
        </Card>
      </div>

      {/* Formal Disclaimer Card */}
      <Card className="p-6 sm:p-8 bg-slate-50 border-slate-200 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Important Product Disclaimer
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Number Story is an entertainment and personal reflection platform. The insights generated are intended to prompt creative self-reflection and introspection. Number Story is not a clinically validated psychological evaluation, nor does it provide financial, medical, legal, or guaranteed predictive counsel.
        </p>
      </Card>
    </div>
  );
};
