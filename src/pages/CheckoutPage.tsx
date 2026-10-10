import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { getProductById, PRODUCTS } from '../config/products';
import { paymentClientService } from '../services/paymentClientService';
import { ROUTES } from '../config/routes';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export const CheckoutPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('reportId') || undefined;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t, isHindi } = useLanguage();

  const product = getProductById(productId || 'combo') || PRODUCTS.combo;

  const [customerName, setCustomerName] = useState('Explorer');
  const [customerEmail, setCustomerEmail] = useState('explorer@example.com');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasExistingAccess, setHasExistingAccess] = useState(false);

  useEffect(() => {
    paymentClientService.checkAccess(product.id, reportId).then((hasAccess) => {
      if (hasAccess) {
        setHasExistingAccess(true);
      }
    });
  }, [product.id, reportId]);

  const handleProceedToPayment = async () => {
    setIsProcessing(true);

    try {
      await paymentClientService.initiatePayment({
        productId: product.id,
        reportId,
        userDetails: {
          name: customerName,
          email: customerEmail,
        },
        onSuccess: (result) => {
          setIsProcessing(false);
          setHasExistingAccess(true);
          showToast(isHindi ? 'भुगतान सत्यापित! प्रीमियम रिपोर्ट अनलॉक हो गई।' : 'Payment verified successfully. Premium access unlocked!', 'success');
          navigate(
            `${ROUTES.PAYMENT_SUCCESS}?orderId=${result.orderId}&productId=${product.id}${
              reportId ? `&reportId=${reportId}` : ''
            }`
          );
        },
        onFailure: (errorMsg) => {
          setIsProcessing(false);
          showToast(errorMsg, 'error');
          navigate(
            `${ROUTES.PAYMENT_FAILED}?productId=${product.id}&error=${encodeURIComponent(errorMsg)}`
          );
        },
        onDismiss: async () => {
          setIsProcessing(false);
          const hasAccess = await paymentClientService.checkAccess(product.id, reportId);
          if (hasAccess) {
            setHasExistingAccess(true);
            navigate(
              `${ROUTES.PAYMENT_SUCCESS}?orderId=paid&productId=${product.id}${
                reportId ? `&reportId=${reportId}` : ''
              }`
            );
            return;
          }
          showToast(isHindi ? 'चेकआउट विंडो बंद कर दी गई।' : 'Checkout was closed.', 'info');
        },
      });
    } catch (err) {
      setIsProcessing(false);
      console.error('[CheckoutPage] Checkout initiation error:', err);
      showToast(isHindi ? 'पेमेंट गेटवे शुरू नहीं हो सका।' : 'Could not open payment gateway. Please try again.', 'error');
    }
  };

  if (hasExistingAccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-fade-in text-center">
        <Card className="p-8 sm:p-12 space-y-6 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <Badge variant="success" size="sm">
              {isHindi ? 'एक्सेस अनलॉक है' : 'Access Unlocked'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {isHindi ? 'आपके पास इस रिपोर्ट का एक्सेस पहले से है!' : 'You already have access to this report!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              {isHindi
                ? 'आपका प्रीमियम लाइसेंस सक्रिय है। अपनी संपूर्ण संश्लेषित रिपोर्ट देखने के लिए नीचे दिए गए बटन पर क्लिक करें।'
                : 'Your premium entitlement is verified and active. Click below to view your full synthesized reflection report.'}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            {reportId ? (
              <Link to={`/report/${reportId}`}>
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  {isHindi ? 'मेरी रिपोर्ट देखें' : 'View My Report'}
                </Button>
              </Link>
            ) : (
              <Link to={ROUTES.DASHBOARD}>
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  {isHindi ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'}
                </Button>
              </Link>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-fade-in">
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Application</span>
      </Link>

      <Card className="p-6 sm:p-10 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-200/50 dark:border-indigo-800/50">
                {product.name}
              </span>
              {product.badge && <Badge variant="gold" size="sm">{product.badge}</Badge>}
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-slate-100 mt-2">
              {t.checkout.orderSummary}
            </h1>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              {product.formattedPrice}
            </span>
            <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-medium">{t.checkout.oneTime}</span>
          </div>
        </div>

        {/* Customer Contact Prefill */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
            {t.checkout.billingDetails}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={t.checkout.yourName}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. John Doe"
            />
            <Input
              label={t.checkout.emailReceipt}
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="e.g. john@example.com"
            />
          </div>
        </div>

        {/* Feature inclusions */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{t.checkout.included}</p>
          <ul className="space-y-2">
            {product.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Price Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Item: {product.name}</span>
            <span>{product.formattedPrice}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>{t.checkout.gstIncluded}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t.checkout.includedBadge}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-slate-900 dark:text-white text-sm">
            <span>{t.checkout.totalPayable}</span>
            <span>{product.formattedPrice}</span>
          </div>
        </div>

        {/* Trust & Security Badge */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-[#131124] border border-indigo-100 dark:border-purple-900/50 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-pink-500 dark:text-pink-400 shrink-0" />
            <span>{t.checkout.sslBadge}</span>
          </div>
          <Badge
            variant="outline"
            size="sm"
            className={
              import.meta.env.VITE_RAZORPAY_KEY_ID?.startsWith('rzp_live')
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold'
            }
          >
            {import.meta.env.VITE_RAZORPAY_KEY_ID?.startsWith('rzp_live') ? '100% Live Secure' : 'Sandbox Mode'}
          </Badge>
        </div>

        {/* Payment CTA Button */}
        <Button
          size="lg"
          variant="primary"
          className="w-full text-white font-extrabold text-base sm:text-lg shadow-xl shadow-pink-500/25 active:scale-[0.98] transition-all"
          disabled={isProcessing}
          onClick={handleProceedToPayment}
          leftIcon={
            isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CreditCard className="w-5 h-5" />
            )
          }
        >
          {isProcessing ? t.checkout.processing : `${t.checkout.pay} ${product.formattedPrice} & ${t.checkout.unlock}`}
        </Button>
      </Card>

      <DisclaimerBanner variant="card" />
    </div>
  );
};

