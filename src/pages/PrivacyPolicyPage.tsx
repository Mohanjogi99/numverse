import React from 'react';
import { ShieldCheck, Lock, Eye, Server, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { APP_CONFIG } from '../config/constants';
import { useLanguage } from '../context/LanguageContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { isHindi } = useLanguage();
  const lastUpdated = 'October 10, 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 animate-fade-in text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-900/50">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{isHindi ? 'कानूनी एवं गोपनीयता अनुपालन' : 'Legal & Compliance Policy'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
          {isHindi ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {isHindi ? `अंतिम अपडेट: ${lastUpdated} • लागू तिथि: 10 अक्टूबर 2026` : `Last updated: ${lastUpdated} • Effective Date: October 10, 2026`}
        </p>
      </div>

      {/* Intro Summary */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-[#0D121F] dark:to-[#111625]">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">{isHindi ? 'डिजिटल पर्सनल डेटा प्रोटेक्शन' : 'DPDP Act 2023 & GDPR Compliant'}</Badge>
        </div>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          {isHindi
            ? `${APP_CONFIG.APP_NAME} ("हम", "हमारी", "प्लेटफ़ॉर्म") आपकी व्यक्तिगत गोपनीयता का गहरा सम्मान करता है। यह नीति बताती है कि जब आप numverse.art का उपयोग करते हैं तो हम आपकी जानकारी को कैसे संभालते हैं, सुरक्षित रखते हैं और न्यूनतम डेटा संग्रह के सिद्धांत का पालन करते हैं।`
            : `${APP_CONFIG.APP_NAME} ("we", "our", "us", or "Platform") is committed to protecting your personal privacy. This Privacy Policy outlines how we collect, handle, store, and safeguard your data when you interact with numverse.art in full accordance with the Digital Personal Data Protection (DPDP) Act 2023, IT Act 2000, and Google Developer Standards.`}
        </p>
      </Card>

      {/* Section 1: Data We Collect */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{isHindi ? '1. हम कौन सी जानकारी एकत्र करते हैं' : '1. Information We Collect'}</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>A. {isHindi ? 'विश्लेषण इनपुट' : 'Analysis Inputs'}:</strong> {isHindi ? 'आपके द्वारा दर्ज किए गए 10-अंकीय मोबाइल नंबर या जन्मतिथि केवल क्लाइंट-साइड एल्गोरिदम और विश्लेषण के लिए प्रोसेस किए जाते हैं। हम आपके फ़ोन नंबरों को न तो बेचते हैं और न ही किसी तीसरे पक्ष को विज्ञापन के लिए साझा करते हैं।' : 'Mobile numbers or dates of birth entered into analysis calculators are processed via deterministic algorithms. We do not harvest, monetize, or broker your phone numbers.'}
          </p>
          <p>
            <strong>B. {isHindi ? 'व्यक्तित्व परीक्षण उत्तर' : 'Personality Assessment Responses'}:</strong> {isHindi ? '50-प्रश्नों के उत्तर आपके स्थानीय ब्राउज़र सेशन (SessionStorage/LocalStorage) में सुरक्षित रहते हैं ताकि आपकी रिपोर्ट तैयार की जा सके।' : 'Answers given during the 10/25/50 question assessment are processed to compute your dimension scores.'}
          </p>
          <p>
            <strong>C. {isHindi ? 'भुगतान और बिलिंग डेटा' : 'Payment & Transaction Data'}:</strong> {isHindi ? 'भुगतान Razorpay (PCI-DSS Level 1 सर्टिफाइड पेमेंट गेटवे) द्वारा सुरक्षित रूप से प्रोसेस किया जाता है। हम आपके क्रेडिट/डेबिट कार्ड नंबर या UPI पिन को कभी स्टोर नहीं करते।' : 'Payments are securely processed via Razorpay (PCI-DSS Level 1 compliant gateway). We never receive or store your raw card numbers, CVV, or UPI PINs.'}
          </p>
        </div>
      </Card>

      {/* Section 2: Cookies & Analytics */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{isHindi ? '2. कुकीज़ और एनालिटिक्स' : '2. Cookies & Analytics Technologies'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {isHindi
            ? 'हम वेबसाइट के प्रदर्शन, पेज लोड गति और उपयोगकर्ता अनुभव को बेहतर बनाने के लिए आवश्यक कुकीज़ और अनाम एनालिटिक्स टूल्स (जैसे Google Analytics) का उपयोग करते हैं। आप किसी भी समय अपने ब्राउज़र सेटिंग्स से कुकीज़ को ब्लॉक या डिलीट कर सकते हैं।'
            : 'We use necessary cookies and anonymous telemetry tools (such as Google Analytics) solely to optimize page loading speeds, user flows, and interface responsiveness. You may disable cookies through your browser settings at any time without losing access to core assessment features.'}
        </p>
      </Card>

      {/* Section 3: Data Security */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{isHindi ? '3. डेटा सुरक्षा और एन्क्रिप्शन' : '3. Data Security & Encryption Standards'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {isHindi
            ? 'हमारी सभी संचार प्रक्रियाएं 256-बिट SSL/TLS एन्क्रिप्शन के तहत सुरक्षित हैं। आपका डेटा Google Cloud Firebase के अत्यधिक सुरक्षित, एन्क्रिप्टेड इंफ्रास्ट्रक्चर पर होस्ट किया गया है।'
            : 'All data transmissions are secured using industry-standard 256-bit SSL/TLS encryption protocols. Hosting infrastructure is managed via Google Cloud Firebase with strict zero-trust role-based access controls.'}
        </p>
      </Card>

      {/* Section 4: User Rights */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{isHindi ? '4. आपके अधिकार (Your Rights)' : '4. Your Rights & Data Choices'}</span>
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
          <li>{isHindi ? 'अपने स्थानीय डेटा को कभी भी सेटिंग्स या ब्राउज़र कैश से साफ़ करने का अधिकार।' : 'Right to erase stored report tokens and local preferences via the in-app Settings page.'}</li>
          <li>{isHindi ? 'अपनी रिपोर्ट को सुरक्षित PDF के रूप में डाउनलोड और स्टोर करने का अधिकार।' : 'Right to download and export your complete analytical reports.'}</li>
          <li>{isHindi ? 'किसी भी समय समर्थन टीम से डेटा हटाने का अनुरोध करने का अधिकार।' : 'Right to request full data deletion by contacting support@numverse.art.'}</li>
        </ul>
      </Card>

      {/* Section 5: Contact & Grievance */}
      <Card className="p-6 sm:p-8 space-y-3 bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
          {isHindi ? 'गोपनीयता अधिकारी एवं संपर्क' : 'Grievance Officer & Privacy Contact'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {isHindi
            ? 'यदि आपके पास इस गोपनीयता नीति के संबंध में कोई प्रश्न या शिकायत है, तो कृपया हमारे शिकायत निवारण अधिकारी से संपर्क करें:'
            : 'In accordance with Information Technology Act 2000 and DPDP Act 2023, if you have any questions or grievances regarding this Privacy Policy, contact:'}
        </p>
        <div className="pt-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white space-y-1">
          <p><strong>Grievance Officer:</strong> Numverse Privacy Team</p>
          <p><strong>Email:</strong> <a href="mailto:support@numverse.art" className="text-indigo-600 dark:text-indigo-400 underline">support@numverse.art</a></p>
          <p><strong>Website:</strong> <a href="https://numverse.art" className="text-indigo-600 dark:text-indigo-400">https://numverse.art</a></p>
        </div>
      </Card>
    </div>
  );
};
