import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an issue processing this request. Please try again.',
  onRetry,
}) => {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <Card className="p-8 space-y-4 border-slate-200 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-display font-bold text-slate-900">{title}</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          {onRetry && (
            <Button size="sm" variant="primary" onClick={onRetry} leftIcon={<RefreshCw className="w-4 h-4" />}>
              Try Again
            </Button>
          )}
          <Link to={ROUTES.HOME}>
            <Button size="sm" variant="outline" className="w-full sm:w-auto" leftIcon={<Home className="w-4 h-4" />}>
              Go Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
