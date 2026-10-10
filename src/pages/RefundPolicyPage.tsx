import React from 'react';
import { RefreshCw, CheckCircle2, Clock, Mail, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { APP_CONFIG } from '../config/constants';
import { useLanguage } from '../context/LanguageContext';

export const RefundPolicyPage: React.FC = () => {
  const { isHindi } = useLanguage();
  const lastUpdated = 'October 10, 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 animate-fade-in text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-900/50">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{isHindi ? 'रिफंड एवं रद्दीकरण नीति' : 'Refund & Cancellation Policy'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
          {isHindi ? 'रिफंड एवं रद्दीकरण नीति (Refund Policy)' : 'Cancellation & Refund Policy'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {isHindi ? `अंतिम अपडेट: ${lastUpdated} • Razorpay एवं उपभोक्ता संरक्षण अनुपालन` : `Last updated: ${lastUpdated} • Razorpay & E-Commerce Compliance`}
        </p>
      </div>

      {/* 100% Satisfaction Banner */}
      <Card className="p-6 sm:p-8 space-y-4 border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/20 dark:from-emerald-950/30 dark:via-[#0D121F] dark:to-[#0D121F]">
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">{isHindi ? '100% उपभोक्ता सुरक्षा' : '100% Customer Protection'}</Badge>
        </div>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          {isHindi
            ? `${APP_CONFIG.APP_NAME} पर हम आपकी पूर्ण संतुष्टि के लिए प्रतिबद्ध हैं। चूंकि हमारी सेवाएं डिजिटल रिपोर्ट्स (Digital Goods) हैं जो तुरंत अनलॉक होती हैं, इसलिए हम नीचे दिए गए पारदर्शी नियमों के तहत रिफंड प्रदान करते हैं।`
            : `At ${APP_CONFIG.APP_NAME}, we strive to ensure a delightful experience. Because our offerings are immediately accessible digital analytical reports, our refund and cancellation terms operate under transparent, fair consumer principles outlined below.`}
        </p>
      </Card>

      {/* Eligibility for Refund */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>{isHindi ? 'रिफंड के लिए पात्रता शर्तें' : 'Refund Eligibility Conditions'}</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong>{isHindi ? 'तकनीकी त्रुटि / रिपोर्ट अनलॉक न होना:' : 'Technical Failure / Non-Delivery:'}</strong>{' '}
              {isHindi
                ? 'यदि आपके खाते से राशि कट गई है लेकिन तकनीकी समस्या के कारण रिपोर्ट अनलॉक नहीं हुई या डाउनलोड नहीं हो पाई।'
                : 'If your payment was debited but technical glitches prevented report generation or report unlocking.'}
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong>{isHindi ? 'दोहरा भुगतान (Duplicate Payment):' : 'Duplicate Deductions:'}</strong>{' '}
              {isHindi
                ? 'यदि नेटवर्क समस्या के कारण एक ही ऑर्डर के लिए दो बार भुगतान कट गया हो, तो अतिरिक्त राशि 100% तुरंत वापस की जाएगी।'
                : 'If network anomalies caused duplicate charges for the same assessment report, the duplicate transaction will be refunded in full immediately.'}
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong>{isHindi ? '7-दिन की संतुष्टि गारंटी:' : '7-Day Satisfaction Window:'}</strong>{' '}
              {isHindi
                ? 'यदि आप अपनी रिपोर्ट से संतुष्ट नहीं हैं, तो खरीद के 7 दिनों के भीतर हमें ईमेल करके बिना किसी झंझट के रिफंड का अनुरोध कर सकते हैं।'
                : 'If you are unsatisfied with your analytical report quality, you may submit a refund request within 7 calendar days of transaction.'}
            </div>
          </div>
        </div>
      </Card>

      {/* Refund Process & Timeline */}
      <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>{isHindi ? 'रिफंड प्रक्रिया एवं समय सीमा' : 'Processing Timeline & Method'}</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            {isHindi
              ? 'रिफंड स्वीकृत होने के बाद, राशि 5 से 7 कार्य दिवसों (Business Days) के भीतर सीधे आपके मूल भुगतान स्रोत (जैसे UPI, बैंक खाता, क्रेडिट कार्ड) में वापस क्रेडिट कर दी जाती है।'
              : 'Once approved, refunds are processed through our Razorpay payment gateway directly to the original payment method (Bank Account, UPI ID, or Card) within 5 to 7 business days as per standard banking protocol.'}
          </p>
        </div>
      </Card>

      {/* How to Request Refund */}
      <Card className="p-6 sm:p-8 space-y-3 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{isHindi ? 'रिफंड के लिए कैसे संपर्क करें' : 'How to Request a Refund'}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {isHindi
            ? 'रिफंड का अनुरोध करने के लिए कृपया अपनी Razorpay Payment ID और ईमेल के साथ हमें लिखें:'
            : 'To initiate a refund, simply email our customer support with your Razorpay Payment ID and order details:'}
        </p>
        <div className="pt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          <a href="mailto:support@numverse.art" className="underline">support@numverse.art</a>
        </div>
      </Card>
    </div>
  );
};
