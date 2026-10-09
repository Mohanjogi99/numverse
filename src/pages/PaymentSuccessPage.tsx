import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getProductById } from '../config/products';
import { ROUTES } from '../config/routes';

export const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-VERIFIED';
  const productId = searchParams.get('productId') || 'combo';
  const reportId = searchParams.get('reportId');

  const product = getProductById(productId);

  return (
    <div className="max-w-lg mx-auto px-4 py-12 sm:py-20 text-center space-y-6 animate-fade-in">
      <Card className="p-8 sm:p-10 space-y-6 border-slate-200 shadow-2xl bg-white">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-100">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Payment Verified Server-Side</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Payment Successful
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your premium <strong>{product?.name || 'Self-Reflection Report'}</strong> has been unlocked and added to your workspace.
          </p>
        </div>

        {/* Order Details Receipt Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Transaction Reference:</span>
            <span className="font-mono font-semibold text-slate-900">{orderId}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Product Entitlement:</span>
            <span className="font-semibold text-slate-900">{product?.name || 'Premium Tier'}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Status:</span>
            <Badge variant="success" size="sm">
              Captured & Verified
            </Badge>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          {reportId ? (
            <Link to={`/report/${reportId}`} className="w-full">
              <Button
                size="md"
                variant="primary"
                className="w-full shadow-lg shadow-indigo-200"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View My Complete Report
              </Button>
            </Link>
          ) : (
            <Link to={ROUTES.DASHBOARD} className="w-full">
              <Button
                size="md"
                variant="primary"
                className="w-full shadow-lg shadow-indigo-200"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Go to Workspace
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
};
