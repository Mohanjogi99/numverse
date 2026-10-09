import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../config/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <Card className="p-8 space-y-4 border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto font-display font-black text-2xl">
          404
        </div>
        <h1 className="text-xl font-display font-bold text-slate-900">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          The reflection or page you are looking for does not exist or has moved.
        </p>
        <div className="pt-2">
          <Link to={ROUTES.HOME}>
            <Button size="md" variant="primary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Return to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
