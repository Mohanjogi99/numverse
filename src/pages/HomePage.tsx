import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Sparkles,
  ShieldCheck,
  Lock,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Heart,
  Coins,
  Brain,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { NumberThemeCard } from '../components/common/NumberThemeCard';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { NUMBER_PROFILES } from '../data/numberProfiles';
import { PERSONALITY_ARCHETYPES } from '../data/personalityTypes';
import { PRODUCTS } from '../config/products';
import { ROUTES } from '../config/routes';
import { SingleDigit } from '../types/number';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedNumberProfile, getLocalizedPersonalityArchetype } from '../i18n/profileHelpers';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t, isHindi } = useLanguage();
  const [activeHeroDigit, setActiveHeroDigit] = useState<SingleDigit>(7);

  const numberKeys: SingleDigit[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const archetypesPreview = Object.values(PERSONALITY_ARCHETYPES);
  const activeHeroProfile = getLocalizedNumberProfile(activeHeroDigit, language);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 lg:pt-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-purple-600/20 via-pink-500/20 via-rose-500/15 to-amber-500/20 dark:from-purple-600/25 dark:via-fuchsia-500/20 dark:via-pink-500/20 dark:to-amber-500/25 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Messaging & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 dark:bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs sm:text-sm font-bold tracking-wide shadow-xs">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>{t.home.heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              {t.home.heroTitlePrefix} <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 via-pink-400 to-amber-300">
                {t.home.heroTitleHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.home.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link to={ROUTES.NUMBER_ANALYSIS} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-500 hover:via-pink-400 hover:to-amber-400 text-white font-bold shadow-lg shadow-pink-500/30 dark:shadow-sunset-glow border-none" rightIcon={<Compass className="w-5 h-5" />}>
                  {t.home.analyzeBtn}
                </Button>
              </Link>
              <Link to={ROUTES.PERSONALITY_TEST} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto dark:border-purple-900/50 dark:bg-[#131124]/80 dark:text-slate-200 dark:hover:bg-slate-800">
                  {t.home.takeTestBtn}
                </Button>
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="pt-1">
              <DisclaimerBanner variant="inline" />
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5">
            <Card className="p-6 sm:p-7 border-slate-200/90 dark:border-purple-900/40 shadow-2xl bg-white/90 dark:bg-[#110F22]/90 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-purple-950/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {t.home.spectrumTitle}
                  </span>
                </div>
                <span className="text-xs text-pink-400 font-semibold">{t.home.spectrumPreview}</span>
              </div>

              {/* Number Chips Selector */}
              <div className="grid grid-cols-5 gap-1.5 my-4">
                {numberKeys.map((digit) => {
                  const p = getLocalizedNumberProfile(digit, language);
                  const shortName = p.theme.split(' ')[0];
                  return (
                    <button
                      key={digit}
                      onClick={() => setActiveHeroDigit(digit)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${
                        activeHeroDigit === digit
                          ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white shadow-md shadow-pink-500/30 scale-105 font-black'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold'
                      }`}
                    >
                      <span className="text-sm leading-none">{digit}</span>
                      <span className="text-[9px] uppercase tracking-tighter truncate max-w-full mt-0.5 opacity-90">
                        {shortName}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Digit Highlight Panel */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50/80 via-purple-50/50 to-amber-50/50 dark:from-purple-950/40 dark:via-pink-950/30 dark:to-amber-950/30 border border-pink-200/60 dark:border-pink-900/40 space-y-2.5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 text-white flex items-center justify-center font-display font-black text-xl shadow-md shadow-pink-500/30 shrink-0">
                      {activeHeroDigit}
                    </div>
                    <div>
                      <div className="text-base font-display font-bold text-slate-900 dark:text-white">
                        {activeHeroProfile.theme}
                      </div>
                      <div className="text-xs text-pink-600 dark:text-pink-400 font-semibold">
                        {activeHeroProfile.tagline}
                      </div>
                    </div>
                  </div>
                  <Link to={`/number/${activeHeroDigit}`} className="text-pink-500 hover:text-pink-400 transition-colors p-1">
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {activeHeroProfile.description}
                </p>
              </div>

              <div className="pt-4 text-center">
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full text-white font-bold shadow-md shadow-pink-500/20"
                  onClick={() => navigate(ROUTES.NUMBER_ANALYSIS)}
                >
                  {t.home.discoverDominantBtn}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 1.5 VISUAL SIGNIFICANCE / NUMEROLOGY MATRIX SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B0D1B] via-[#120D27] to-[#1A0E2E] border border-purple-500/30 shadow-2xl p-6 sm:p-10 lg:p-12 text-white">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left: Engaging Numerology Art Image with Glow Frame */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative group rounded-2xl overflow-hidden border border-purple-400/40 shadow-2xl shadow-purple-950/50 bg-black/40">
                <img
                  src="/images/numerology-showcase.jpg"
                  alt={isHindi ? "अंकशास्त्र और जीवन स्तम्भ आत्म-खोज" : "Numerology and Life Pillars Cosmic Matrix"}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Floating Badge Over Image */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between backdrop-blur-md bg-slate-950/80 border border-purple-400/30 rounded-xl p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-semibold text-purple-200">
                      {isHindi ? "प्रत्यक्ष कॉस्मिक फ्रीक्वेंसी मैट्रिक्स" : "Live Frequency Matrix"}
                    </span>
                  </div>
                  <span className="font-mono text-amber-300 font-bold">0 — 9 VIBRATIONS</span>
                </div>
              </div>
            </div>

            {/* Right: Explanation & Life Pillar Highlights */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span>{isHindi ? "अंकों का आपके जीवन पर गहरा प्रभाव" : "The Power of Numerology & Frequency"}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight leading-tight text-white">
                {isHindi ? (
                  <>
                    अंक केवल संख्याएं नहीं हैं, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
                      वे आपके जीवन का ब्लूप्रिंट हैं
                    </span>
                  </>
                ) : (
                  <>
                    Numbers Are Not Just Digits, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
                      They Are Your Life’s Blueprint
                    </span>
                  </>
                )}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {isHindi
                  ? "आपकी जन्मतिथि (DOB) और दैनिक मोबाइल नंबर की आवृति (Frequency) आपके 4 प्रमुख जीवन क्षेत्रों—करियर, रिश्ते, वित्तीय वृद्धि और मानसिक संतुलन को सीधे प्रभावित करती है।"
                  : "Your Date of Birth (DOB) and daily mobile number frequencies directly shape 4 critical life pillars—Career, Relationships, Financial Growth, and Mental Balance."}
              </p>

              {/* 4 Feature Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white/5 border border-purple-500/20 backdrop-blur-sm space-y-1 hover:border-purple-400/40 transition-colors">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <span>{isHindi ? "करियर और उद्देश्य" : "Career & Purpose"}</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">
                    {isHindi ? "लीडरशिप और सही दिशा की पहचान" : "Identify natural leadership & timing"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-purple-500/20 backdrop-blur-sm space-y-1 hover:border-pink-400/40 transition-colors">
                  <div className="flex items-center gap-2 text-pink-300 font-bold text-sm">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <span>{isHindi ? "रिश्ते और प्रेम" : "Relationships"}</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">
                    {isHindi ? "आंतरिक तालमेल और समझ" : "Harmonize communication & bond"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-purple-500/20 backdrop-blur-sm space-y-1 hover:border-amber-400/40 transition-colors">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>{isHindi ? "वित्तीय समृद्धि" : "Financial Growth"}</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">
                    {isHindi ? "अवसर और निर्णय लेने की शक्ति" : "Unlock abundance & decision clarity"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-purple-500/20 backdrop-blur-sm space-y-1 hover:border-emerald-400/40 transition-colors">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <Brain className="w-4 h-4 text-emerald-400" />
                    <span>{isHindi ? "मानसिक स्पष्टता" : "Inner Harmony"}</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">
                    {isHindi ? "तनाव मुक्ति और ऊर्जा संतुलन" : "Psychological balance & focus"}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link to={ROUTES.NUMBER_ANALYSIS} className="w-full sm:w-auto">
                  <Button
                    size="md"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-500 hover:via-pink-400 hover:to-amber-400 text-white font-bold shadow-lg shadow-pink-500/25 border-none"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {isHindi ? "अपना नंबर अभी जांचें" : "Analyze Your Numbers Now"}
                  </Button>
                </Link>
                <Link to={ROUTES.PERSONALITY_TEST} className="w-full sm:w-auto">
                  <Button
                    size="md"
                    variant="outline"
                    className="w-full sm:w-auto border-purple-500/40 text-purple-200 hover:bg-purple-950/50 hover:text-white"
                  >
                    {isHindi ? "व्यक्तित्व टेस्ट लें" : "Take Personality Test"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{t.home.methodologyTitle}</h2>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            {t.home.methodologyHeading}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.home.methodologySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Step 1 */}
          <Card className="p-6 sm:p-8 space-y-4 border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-display font-bold text-xl">
              1
            </div>
            <h4 className="text-lg font-display font-bold text-slate-900 dark:text-white">{t.home.step1Title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.home.step1Desc}
            </p>
          </Card>

          {/* Step 2 */}
          <Card className="p-6 sm:p-8 space-y-4 border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-display font-bold text-xl">
              2
            </div>
            <h4 className="text-lg font-display font-bold text-slate-900 dark:text-white">{t.home.step2Title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.home.step2Desc}
            </p>
          </Card>

          {/* Step 3 */}
          <Card className="p-6 sm:p-8 space-y-4 border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-display font-bold text-xl">
              3
            </div>
            <h4 className="text-lg font-display font-bold text-slate-900 dark:text-white">{t.home.step3Title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.home.step3Desc}
            </p>
          </Card>
        </div>
      </section>

      {/* 3. NUMBER THEMES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">
              {t.home.numberThemesBadge}
            </h2>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
              {t.home.numberThemesHeading}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              {t.home.numberThemesSubtitle}
            </p>
          </div>
          <Link to={ROUTES.NUMBER_ANALYSIS}>
            <Button variant="soft" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {t.home.analyzeBtn}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {numberKeys.map((num) => (
            <NumberThemeCard key={num} profile={NUMBER_PROFILES[num]} />
          ))}
        </div>
      </section>

      {/* 4. PERSONALITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 dark:from-[#0D121F] dark:via-[#111827] dark:to-[#17132B] rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.home.personalityBadge}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-white">
              {t.home.personalityHeading}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t.home.personalitySubtitle}
            </p>

            <div className="pt-2">
              <Link to={ROUTES.PERSONALITY_TEST}>
                <Button variant="gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {t.home.explorePersonalityBtn}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PERSONALITY TYPES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">
              {t.home.archetypesBadge}
            </h2>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
              {t.home.archetypesHeading}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              {t.home.archetypesSubtitle}
            </p>
          </div>
          <Link to={ROUTES.PERSONALITY_TYPES}>
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {t.home.exploreAllArchetypesBtn}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {archetypesPreview.map((arch) => {
            const localizedArch = getLocalizedPersonalityArchetype(arch.id, language);
            return (
              <Link key={arch.id} to={`/personality-types/${arch.id}`} className="block group">
                <Card variant="interactive" className="p-4 sm:p-5 h-full flex flex-col justify-between border-slate-200 dark:border-slate-800">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 px-2 py-0.5 rounded-md">
                      {localizedArch.subtitle}
                    </span>
                    <h4 className="font-display font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {localizedArch.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{localizedArch.tagline}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>{t.common.viewDetails}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. PREMIUM PRICING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{t.home.pricingBadge}</h2>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            {t.home.pricingHeading}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t.home.pricingSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* FREE */}
          <Card className="p-6 space-y-5 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.home.freeTitle}</span>
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white">{PRODUCTS.free.formattedPrice}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{PRODUCTS.free.description}</p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                {PRODUCTS.free.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to={ROUTES.NUMBER_ANALYSIS}>
              <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-500 hover:via-pink-400 hover:to-amber-400 text-white font-bold shadow-md shadow-pink-500/20 border-none">
                {PRODUCTS.free.ctaText}
              </Button>
            </Link>
          </Card>

          {/* STANDARD */}
          <Card className="p-6 space-y-5 border-slate-200 dark:border-purple-900/30 dark:bg-[#110F22]/80 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">{t.home.standardTitle}</span>
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white">{PRODUCTS.standard.formattedPrice}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{PRODUCTS.standard.description}</p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                {PRODUCTS.standard.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to={`/personality-test/standard`}>
              <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-500 hover:via-pink-400 hover:to-amber-400 text-white font-bold shadow-md shadow-pink-500/20 border-none">
                {PRODUCTS.standard.ctaText}
              </Button>
            </Link>
          </Card>

          {/* COMPLETE */}
          <Card className="p-6 space-y-5 border-slate-200 dark:border-purple-900/30 dark:bg-[#110F22]/80 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">{t.home.completeTitle}</span>
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white">{PRODUCTS.complete.formattedPrice}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{PRODUCTS.complete.description}</p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                {PRODUCTS.complete.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to={`/personality-test/complete`}>
              <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-500 hover:via-pink-400 hover:to-amber-400 text-white font-bold shadow-md shadow-pink-500/20 border-none">
                {PRODUCTS.complete.ctaText}
              </Button>
            </Link>
          </Card>

          {/* COMBO (HIGHLIGHT: BEST VALUE) */}
          <Card className="p-6 space-y-5 border-2 border-pink-500 dark:border-pink-500/80 bg-gradient-to-b from-pink-50/40 via-purple-50/20 to-amber-50/30 dark:from-purple-950/30 dark:via-[#16142C] dark:to-[#16142C] shadow-card dark:shadow-sunset-glow flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="gold" size="sm" className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white font-extrabold border-none shadow-md shadow-pink-500/30">
                {t.home.comboBadge}
              </Badge>
            </div>
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">{t.home.comboTitle}</span>
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white">{PRODUCTS.combo.formattedPrice}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{PRODUCTS.combo.description}</p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-pink-100 dark:border-purple-900/40">
                {PRODUCTS.combo.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                    <span className="font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to={`/checkout/combo`}>
              <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-500 hover:via-pink-400 hover:to-amber-400 text-white font-bold shadow-lg shadow-pink-500/30 border-none">
                {PRODUCTS.combo.ctaText}
              </Button>
            </Link>
          </Card>


        </div>
      </section>

      {/* 7. TRUST & INTEGRITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          {/* Card 1: Private by Design */}
          <Card className="group p-5 sm:p-6 space-y-3.5 border-slate-200/90 dark:border-purple-900/40 bg-white/95 dark:bg-[#110F22]/90 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-pink-500/10 dark:hover:shadow-sunset-glow/20 hover:border-pink-500/40 dark:hover:border-pink-500/50 flex flex-col justify-start h-full cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 dark:bg-pink-500/15 border border-pink-500/20 text-pink-500 dark:text-pink-400 flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-base group-hover:text-pink-400 transition-colors">
              {t.home.trustPrivate}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.home.trustPrivateDesc}
            </p>
          </Card>

          {/* Card 2: Self-Reflection Focused */}
          <Card className="group p-5 sm:p-6 space-y-3.5 border-slate-200/90 dark:border-purple-900/40 bg-white/95 dark:bg-[#110F22]/90 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-indigo-glow/20 hover:border-purple-500/40 dark:hover:border-purple-500/50 flex flex-col justify-start h-full cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-base group-hover:text-purple-400 transition-colors">
              {t.home.trustReflection}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.home.trustReflectionDesc}
            </p>
          </Card>

          {/* Card 3: No Guaranteed Predictions */}
          <Card className="group p-5 sm:p-6 space-y-3.5 border-slate-200/90 dark:border-purple-900/40 bg-white/95 dark:bg-[#110F22]/90 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/10 hover:border-emerald-500/40 dark:hover:border-emerald-500/50 flex flex-col justify-start h-full cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-400 transition-colors">
              {t.home.trustHonest}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.home.trustHonestDesc}
            </p>
          </Card>

          {/* Card 4: Secure Payments */}
          <Card className="group p-5 sm:p-6 space-y-3.5 border-slate-200/90 dark:border-purple-900/40 bg-white/95 dark:bg-[#110F22]/90 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-500/10 dark:hover:shadow-amber-glow/20 hover:border-amber-500/40 dark:hover:border-amber-500/50 flex flex-col justify-start h-full cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-base group-hover:text-amber-400 transition-colors">
              {t.home.trustSecure}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.home.trustSecureDesc}
            </p>
          </Card>
        </div>
      </section>


      {/* 8. DISCLAIMER FOOTER NOTICE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <DisclaimerBanner variant="card" />
      </section>
    </div>
  );
};
