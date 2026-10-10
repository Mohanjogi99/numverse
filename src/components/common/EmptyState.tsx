import React, { ReactNode } from 'react';
import { Compass, PlusCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionHref,
  onAction,
  icon,
}) => {
  return (
    <Card className="p-8 sm:p-12 text-center space-y-4 bg-slate-50/80 dark:bg-[#110F22]/70 border-dashed border-2 border-slate-200 dark:border-purple-900/40 backdrop-blur-sm">
      <div className="w-12 h-12 rounded-2xl bg-pink-500/10 dark:bg-pink-500/20 border border-pink-500/20 text-pink-500 dark:text-pink-400 flex items-center justify-center mx-auto shadow-xs">
        {icon || <Compass className="w-6 h-6" />}
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="font-display font-bold text-slate-900 dark:text-white text-base sm:text-lg">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
      {(actionText && (actionHref || onAction)) && (
        <div className="pt-2">
          {actionHref ? (
            <Link to={actionHref}>
              <Button size="sm" variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button size="sm" variant="primary" onClick={onAction} leftIcon={<PlusCircle className="w-4 h-4" />}>
              {actionText}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
