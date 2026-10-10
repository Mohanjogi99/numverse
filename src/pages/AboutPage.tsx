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

      {/* Core Mission & Concept */}
      <Card className="p-6 sm:p-10 space-y-6 border-slate-200/90 dark:border-slate-800 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>{isHindi ? 'अवधारणा (The Concept)' : 'The Concept & Philosophy'}</span>
          </h2>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60">
            {isHindi ? 'वैज्ञानिक एवं दार्शनिक दृष्टिकोण' : 'Scientific & Reflective Framework'}
          </span>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base text-justify font-normal">
          <p>
            {isHindi
              ? `मानव सभ्यता के प्रारंभ से ही संख्याओं का महत्व केवल सामान्य गणितीय गणनाओं या लेन-देन तक सीमित नहीं रहा है। समय की चक्रीय लय (Time Cycles), प्राकृतिक पैटर्नों, ऋतु-परिवर्तन और ब्रह्मांडीय व्यवस्था को समझने के लिए सदियों से मानव संस्कृति में संख्याओं का उपयोग होता आया है। आधुनिक डिजिटल युग में, हमारे आस-पास की संख्याएं—जैसे आपकी जन्मतिथि और आपका सर्वाधिक उपयोग में आने वाला मोबाइल नंबर—आपकी पहचान और दैनिक मानसिक ऊर्जा का एक सतत हिस्सा बन चुकी हैं।`
              : `Throughout human civilization, the importance of numbers has transcended mere counting and ledger keeping. Numbers have historically served as the language for understanding cyclic time rhythms, natural phenomena, and universal patterns. In the modern era, the numbers surrounding your daily life—such as your date of birth and your active mobile frequency—form an intimate part of your personal energetic environment.`}
          </p>

          <p>
            {isHindi
              ? `${APP_CONFIG.APP_NAME} आपके आस-पास मौजूद इन संख्यात्मक पैटर्नों को अंधविश्वास, भय या चमत्कारी दावों में बदलने के बजाय, आत्म-चिंतन और व्यक्तिगत समझ के एक स्पष्ट, तार्किक और बौद्धिक ढांचे में रूपांतरित करता है। हमारा मानना है कि संख्याएं किसी के भाग्य का ताला नहीं लगातीं, बल्कि वे व्यक्ति के अवचेतन झुकाव, निर्णय लेने की आदतों और स्वाभाविक ऊर्जा प्रवाह को समझने का एक उत्कृष्ट माध्यम हैं।`
              : `Rather than transforming numerical patterns into fear, superstition, or fatalistic prophecies, ${APP_CONFIG.APP_NAME} converts them into a structured, rational, and engaging framework for deep self-reflection. We believe that numbers do not dictate fixed destinies; rather, they illuminate subconscious cognitive rhythms, decision-making styles, and inherent behavioral tendencies.`}
          </p>

          <p>
            {isHindi
              ? `पारंपरिक भविष्यवाणियों के विपरीत, ${APP_CONFIG.APP_NAME} का कोर मॉडल एक पारदर्शी "40/60 हाइब्रिड आर्किटेक्चर" पर कार्य करता है। इसमें 40% प्रभाव आपकी जन्मतिथि और मोबाइल नंबर की सूक्ष्म आवृति (Latent Numerical Rhythm) का होता है, और 60% प्रभाव आपके चेतन मनोवैज्ञानिक व्यक्तित्व मूल्यांकन (Conscious Psychological Self-Assessment) का होता है। यह द्वि-स्तरीय दृष्टिकोण आपको किसी भ्रम में डाले बिना, जीवन के 6 मुख्य स्तंभों—प्रेम, करियर, धन, संवाद, सीखने की क्षमता और आत्म-विकास—में स्पष्ट दिशा और व्यावहारिक अंतर्दृष्टि प्रदान करता है।`
              : `Unlike conventional black-box numerology, ${APP_CONFIG.APP_NAME} is powered by a transparent "40/60 Hybrid Architecture": 40% weight is given to your latent cosmic/numerical vibration, and 60% weight is driven by your conscious psychological personality assessment. This balanced methodology provides actionable clarity across 6 vital life pillars—love, career, wealth, communication, intellectual strategy, and personal evolution—without ever making dogmatic or fatalistic claims.`}
          </p>
        </div>
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
