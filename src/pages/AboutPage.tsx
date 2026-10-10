import React from 'react';
import { Sparkles, Shield, Cpu, Compass, Heart } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { APP_CONFIG } from '../config/constants';
import { NUMBER_ENGINE_VERSION } from '../data/influenceMatrix';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage: React.FC = () => {
  const { isHindi } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-fade-in text-slate-800 dark:text-slate-200">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-900/50">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{isHindi ? 'प्लेटफ़ॉर्म दर्शन एवं सिद्धांत' : 'Product Philosophy & Principles'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isHindi ? `${APP_CONFIG.APP_NAME} के बारे में` : `About ${APP_CONFIG.APP_NAME}`}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {isHindi
            ? 'एक आधुनिक आत्म-खोज प्लेटफ़ॉर्म जो संख्याओं को गहन आत्म-चिंतन और व्यक्तिगत समझ के दर्पण के रूप में प्रस्तुत करता है।'
            : `${APP_CONFIG.TAGLINE} A modern self-discovery platform that re-imagines numbers as mirrors for thoughtful reflection.`}
        </p>
      </div>

      {/* Core Mission */}
      <Card className="p-6 sm:p-10 space-y-4 border-slate-200/90 dark:border-slate-800">
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{isHindi ? 'अवधारणा (The Concept)' : 'The Concept'}</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          {isHindi
            ? `मानव संस्कृति में समय, संसाधनों और व्यवस्था को समझने के लिए सदियों से संख्याओं का उपयोग होता आया है। ${APP_CONFIG.APP_NAME} आपके आस-पास की संख्याओं—जैसे आपके मोबाइल नंबर और जन्मतिथि—को आत्म-चिंतन और समझ के एक स्पष्ट ढांचे में बदलता है।`
            : `Throughout human culture, numbers have been used to mark time, track resources, and assign order. ${APP_CONFIG.APP_NAME} transforms the numbers surrounding you—such as your mobile sequence and date of birth—into an engaging framework for structured self-reflection.`}
        </p>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          {isHindi
            ? `अंधविश्वास या भविष्यवाणियों का दावा करने के बजाय, ${APP_CONFIG.APP_NAME} एक पारदर्शी और गणितीय इंजन पर काम करता है जो संख्यात्मक आवृति को मनोवैज्ञानिक व्यक्तित्व आयामों के साथ जोड़ता है।`
            : `Rather than claiming mystical fortune-telling or deterministic prophecy, ${APP_CONFIG.APP_NAME} operates on an open, deterministic mathematical engine that maps numerical frequency to archetypal psychological dimensions.`}
        </p>
      </Card>

      {/* Our 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-slate-900 dark:text-white">
            {isHindi ? 'गणितीय इंजन' : 'Deterministic Engine'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isHindi
              ? `इंजन v${NUMBER_ENGINE_VERSION} पूरी तरह से पारदर्शी और गणनात्मक मैट्रिक्स पर आधारित है। कोई अंधविश्वास नहीं।`
              : `Engine v${NUMBER_ENGINE_VERSION} relies entirely on transparent, reproducible matrix calculations. No black-box mysticism.`}
          </p>
        </Card>

        <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-slate-900 dark:text-white">
            {isHindi ? 'नैतिक दृष्टिकोण' : 'Ethical Framing'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isHindi
              ? 'हम हमेशा सकारात्मक और चिंतनशील भाषा का उपयोग करते हैं। हम कभी भी भाग्यवादी या डराने वाले दावे नहीं करते।'
              : 'We use reflective, non-prescriptive language ("Your profile suggests...", "You may..."). We never make fatalistic assertions.'}
          </p>
        </Card>

        <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-slate-900 dark:text-white">
            {isHindi ? 'गोपनीयता सर्वोपरि' : 'Privacy First'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isHindi
              ? 'गणनाएं आपके ब्राउज़र पर सुरक्षित रूप से प्रोसेस होती हैं। हम आपके व्यक्तिगत नंबर किसी तीसरे पक्ष को नहीं बेचते।'
              : 'Calculations are executed client-side. We do not harvest, monetize, or broker your personal phone numbers.'}
          </p>
        </Card>
      </div>

      {/* Formal Disclaimer Card */}
      <Card className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {isHindi ? 'महत्वपूर्ण अस्वीकरण (Disclaimer)' : 'Important Product Disclaimer'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {isHindi
            ? `${APP_CONFIG.APP_NAME} एक मनोरंजन और व्यक्तिगत आत्म-चिंतन प्लेटफ़ॉर्म है। यहाँ दी गई अंतर्दृष्टि रचनात्मक आत्म-खोज और व्यक्तिगत विकास के लिए है। यह कोई नैदानिक (Clinical) मनोवैज्ञानिक मूल्यांकन नहीं है, न ही यह वित्तीय, कानूनी या चिकित्सीय सलाह प्रदान करता है।`
            : `${APP_CONFIG.APP_NAME} is an entertainment and personal reflection platform. The insights generated are intended to prompt creative self-reflection and introspection. ${APP_CONFIG.APP_NAME} is not a clinically validated psychological evaluation, nor does it provide financial, medical, legal, or guaranteed predictive counsel.`}
        </p>
      </Card>
    </div>
  );
};
