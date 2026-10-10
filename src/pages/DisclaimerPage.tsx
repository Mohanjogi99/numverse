import React from 'react';
import { AlertTriangle, Compass, Cpu, Heart } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { APP_CONFIG } from '../config/constants';
import { NUMBER_ENGINE_VERSION } from '../data/influenceMatrix';
import { useLanguage } from '../context/LanguageContext';

export const DisclaimerPage: React.FC = () => {
  const { isHindi } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 animate-fade-in text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-900/50">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>{isHindi ? 'पद्धति एवं कानूनी प्रकटीकरण' : 'Methodology & Formal Disclosure'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
          {isHindi ? 'अस्वीकरण एवं कार्यप्रणाली (Disclaimer)' : 'Product Disclaimer & Methodology'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {isHindi ? 'पारदर्शी एल्गोरिदम और नैतिक आत्म-चिंतन का विवरण' : 'Transparent algorithmic formulation and ethical boundaries'}
        </p>
      </div>

      {/* Core Entertainment & Reflection Statement */}
      <Card className="p-6 sm:p-8 space-y-4 border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 dark:from-amber-950/30 dark:via-[#0D121F] dark:to-[#0D121F]">
        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">{isHindi ? 'महत्वपूर्ण प्रकटीकरण' : 'Core Product Disclosure'}</Badge>
        </div>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          {isHindi
            ? `${APP_CONFIG.APP_NAME} एक व्यक्तिगत आत्म-चिंतन और रचनात्मक मनोरंजन मंच है। हमारी सभी रिपोर्टें और अंतर्दृष्टियाँ गणितीय संख्या आवृत्तियों और मनोवैज्ञानिक प्रश्नावली के आधार पर चिंतन को प्रेरित करने के लिए तैयार की गई हैं। यह किसी भी रूप में जादुई भविष्यवाणी, ज्योतिष (Astrology), अंकशास्त्र (Numerology dogmas), या भविष्य के भाग्य का दावा नहीं करता है।`
            : `${APP_CONFIG.APP_NAME} is an entertainment and personal self-reflection platform. The insights generated are intended to prompt creative introspection, self-awareness, and personal conversation. Number Story is NOT an astrological prophecy, superstitious divination tool, or fortune-telling service.`}
        </p>
      </Card>

      {/* Limitation of Medical / Financial Advice */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <span>{isHindi ? 'चिकित्सा, कानूनी एवं वित्तीय सीमाओं की अस्वीकृति' : 'No Medical, Clinical, or Financial Advice'}</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            {isHindi
              ? 'Numverse द्वारा उत्पन्न किसी भी रिपोर्ट, स्कोर या सारांश को नैदानिक मनोवैज्ञानिक निदान (Clinical Psychological Diagnosis), मानसिक स्वास्थ्य सलाह, निवेश परामर्श, कानूनी मार्गदर्शन, या करियर गारंटी के रूप में नहीं माना जाना चाहिए।'
              : 'Content produced by Numverse must not be used as a substitute for professional mental health diagnostics, clinical psychological therapy, certified financial planning, legal counsel, or professional medical advice.'}
          </p>
        </div>
      </Card>

      {/* The Deterministic Algorithm Engine */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{isHindi ? `पारदर्शी एल्गोरिदम इंजन (v${NUMBER_ENGINE_VERSION})` : `Transparent Calculation Methodology (Engine v${NUMBER_ENGINE_VERSION})`}</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            {isHindi
              ? 'हमारा सिस्टम 100% पारदर्शी और प्रतिलिपि प्रस्तुत करने योग्य (Reproducible) नियमों पर कार्य करता है:'
              : 'Our scoring engine operates on transparent and fully reproducible deterministic formulas:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                {isHindi ? '40% संख्या आवृत्ति भार' : '40% Numeric Frequency Weight'}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHindi
                  ? 'आपके इनपुट नंबरों के वितरण को 6 आयाम मैट्रिक्स के साथ मैप करता है।'
                  : 'Synthesizes digit frequency against baseline psychological resonance matrix.'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                {isHindi ? '60% प्रश्नावली मूल्यांकन भार' : '60% Assessment Response Weight'}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHindi
                  ? 'आपके द्वारा चुने गए 5-पॉइंट लिकर्ट स्केल के वास्तविक उत्तरों पर आधारित।'
                  : 'Computed from 5-point Likert scale psychological self-assessment choices.'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Narrative Disclosure */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{isHindi ? 'AI जनरेटेड आख्यान प्रकटीकरण' : 'AI Narrative Generation Disclosure'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {isHindi
            ? 'प्रीमियम कॉम्बो रिपोर्ट में शामिल व्यक्तिगत कहानी खंड OpenAI API द्वारा हमारे सख्त, संरचित प्रॉम्प्ट और आपके सटीक स्कोर मैट्रिक्स के आधार पर तैयार किया जाता है। मूल गणनाओं में AI कोई बदलाव नहीं करता।'
            : 'Personalized narrative sections in the Premium Combo Report are generated using OpenAI API based on your exact deterministic scoring metrics. AI adds narrative synthesis without modifying mathematical baseline scores.'}
        </p>
      </Card>
    </div>
  );
};
