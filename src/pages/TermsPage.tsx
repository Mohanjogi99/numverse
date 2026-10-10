import React from 'react';
import { FileText, CheckCircle2, AlertCircle, Scale, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { APP_CONFIG } from '../config/constants';
import { useLanguage } from '../context/LanguageContext';

export const TermsPage: React.FC = () => {
  const { isHindi } = useLanguage();
  const lastUpdated = 'October 10, 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 animate-fade-in text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-900/50">
          <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>{isHindi ? 'उपयोग की शर्तें' : 'Terms of Service'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
          {isHindi ? 'नियम एवं शर्तें (Terms & Conditions)' : 'Terms & Conditions'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {isHindi ? `अंतिम संशोधन: ${lastUpdated}` : `Last Modified: ${lastUpdated}`}
        </p>
      </div>

      {/* Intro */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">{isHindi ? 'कानूनी अनुबंध' : 'Binding Agreement'}</Badge>
        </div>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          {isHindi
            ? `Numverse (numverse.art) पर आपका स्वागत है। इस वेबसाइट और हमारे डिजिटल आत्म-चिंतन टूल्स का उपयोग करके, आप निम्नलिखित नियमों और शर्तों से पूरी तरह सहमत होते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया इस सेवा का उपयोग न करें।`
            : `Welcome to ${APP_CONFIG.APP_NAME} (numverse.art). By accessing or using our website, services, and digital assessment tools, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our platform.`}
        </p>
      </Card>

      {/* Section 1: Nature of Service */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span>{isHindi ? '1. सेवा का स्वरूप (Nature of Service)' : '1. Nature of Service & Self-Reflection Scope'}</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            {isHindi
              ? `${APP_CONFIG.APP_NAME} एक व्यक्तिगत आत्म-चिंतन (Self-Reflection) और मनोरंजन मंच है जो संख्या पैटर्न और संरचित मनोवैज्ञानिक प्रश्नों का उपयोग करता है।`
              : `${APP_CONFIG.APP_NAME} is an entertainment and personal self-reflection platform utilizing deterministic mathematical algorithms and psychological reflection frameworks.`}
          </p>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-amber-900 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {isHindi
                ? 'यह सेवा कोई चिकित्सा, नैदानिक (Clinical), कानूनी, वित्तीय, या भविष्यसूचक सलाह प्रदान नहीं करती है। किसी भी महत्वपूर्ण जीवन निर्णय के लिए कृपया पेशेवर विशेषज्ञों से परामर्श लें।'
                : 'Our reports do not constitute clinical psychological diagnosis, medical advice, financial guidance, legal counsel, or guaranteed future predictions.'}
            </span>
          </div>
        </div>
      </Card>

      {/* Section 2: Intellectual Property */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span>{isHindi ? '2. बौद्धिक संपदा अधिकार' : '2. Intellectual Property Rights'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {isHindi
            ? 'Numverse के सभी कंटेंट, एल्गोरिदम, ब्रांडिंग लोगो, डिज़ाइन सिस्टम, और रिपोर्ट प्रारूप Numverse की विशेष बौद्धिक संपदा हैं। बिना लिखित अनुमति के इसका व्यावसायिक पुनरुत्पादन निषिद्ध है।'
            : 'All algorithms, visual design assets, branding, proprietary archetype models, and report formats are the exclusive intellectual property of Numverse. Unauthorized copying, modification, or commercial exploitation is strictly prohibited.'}
        </p>
      </Card>

      {/* Section 3: User Obligations */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span>{isHindi ? '3. उपयोगकर्ता के कर्तव्य' : '3. User Obligations & Permitted Use'}</span>
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
          <li>{isHindi ? 'प्लेटफ़ॉर्म का उपयोग केवल वैध और व्यक्तिगत उद्देश्यों के लिए करना।' : 'Use the platform exclusively for lawful, ethical, and personal reflection purposes.'}</li>
          <li>{isHindi ? 'सिस्टम में दुर्भावनापूर्ण कोड या स्वचालित बॉट न चलाना।' : 'Refrain from scraping, reverse-engineering, or disrupting platform infrastructure.'}</li>
          <li>{isHindi ? 'भुगतान के लिए अपने स्वयं के अधिकृत भुगतान माध्यम का उपयोग करना।' : 'Ensure billing information provided during checkout is accurate and authorized.'}</li>
        </ul>
      </Card>

      {/* Section 4: Governing Law */}
      <Card className="p-6 sm:p-8 space-y-3 bg-purple-50/50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/60">
        <h3 className="text-sm font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
          {isHindi ? 'लागू कानून एवं क्षेत्राधिकार' : 'Governing Law & Jurisdiction'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {isHindi
            ? 'ये शर्तें भारत के कानूनों के अनुसार शासित होंगी। किसी भी विवाद का निपटारा भारत के न्यायालयों के अनन्य क्षेत्राधिकार के अंतर्गत होगा।'
            : 'These terms are governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in India.'}
        </p>
      </Card>
    </div>
  );
};
