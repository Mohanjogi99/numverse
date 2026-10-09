import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../config/routes';

export const PaymentFailedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId') || 'combo';
  const errorMessage = searchParams.get('error') || 'The transaction was cancelled or declined by your bank.';

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
      <Card className="p-8 sm:p-10 space-y-6 border-slate-200 shadow-xl bg-white">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-md shadow-rose-100">
          <AlertCircle className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Payment Incomplete
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {errorMessage}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
          <p>No amount was deducted from your account. You can retry checkout anytime with another payment method.</p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link to={`/checkout/${productId}`} className="w-full">
            <Button size="md" variant="primary" className="w-full" leftIcon={<RefreshCw className="w-4 h-4" />}>
              Try Again
            </Button>
          </Link>
          <Link to={ROUTES.DASHBOARD} className="w-full">
            <Button size="md" variant="outline" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Workspace
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
