import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { PERSONALITY_ARCHETYPES } from '../data/personalityTypes';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { ROUTES } from '../config/routes';

export const PersonalityTypesPage: React.FC = () => {
  const archetypes = Object.values(PERSONALITY_ARCHETYPES);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-fade-in">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Archetype Index</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          The 10 Personality Types
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Discover the distinct psychological patterns and behavioral archetypes evaluated by the Number Story assessment engine.
        </p>
      </div>

      {/* 10 Archetypes Grid (Section 53) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {archetypes.map((arch) => (
          <Link key={arch.id} to={`/personality-types/${arch.id}`} className="block group">
            <Card
              variant="interactive"
              className="p-5 h-full flex flex-col justify-between border-slate-200 hover:border-purple-300 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    {arch.code}
                  </span>
                  <span className="text-xs font-medium text-slate-400">{arch.subtitle}</span>
                </div>

                <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {arch.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {arch.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-800">
                <span>Explore Profile</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Take Assessment CTA */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-950 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-display font-bold">Discover Which Archetype Resonates With You</h2>
        <p className="text-purple-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Take our structured assessment to map your traits across 6 key dimensions and discover your primary & secondary archetypes.
        </p>
        <div className="pt-2">
          <Link to={ROUTES.PERSONALITY_TEST}>
            <Button variant="gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start Personality Assessment
            </Button>
          </Link>
        </div>
      </div>

      <DisclaimerBanner variant="card" />
    </div>
  );
};
