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
    <Card className="p-8 sm:p-12 text-center space-y-4 bg-slate-50/70 border-dashed border-2 border-slate-200">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
        {icon || <Compass className="w-6 h-6" />}
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="font-display font-bold text-slate-800 text-base sm:text-lg">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{description}</p>
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
