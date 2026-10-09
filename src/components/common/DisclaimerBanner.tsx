import React from 'react';
import { Info } from 'lucide-react';
import { APP_CONFIG } from '../../config/constants';
import { cn } from '../../utils/cn';

export interface DisclaimerBannerProps {
  className?: string;
  variant?: 'subtle' | 'card' | 'inline';
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  className,
  variant = 'subtle',
}) => {
  if (variant === 'inline') {
    return (
      <p className={cn('text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5', className)}>
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>For entertainment and self-reflection.</span>
      </p>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5',
        className
      )}
    >
      <Info className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
      <div className="leading-relaxed">
        <span className="font-semibold text-slate-700 dark:text-slate-200">Self-Reflection Notice: </span>
        {APP_CONFIG.DISCLAIMER}
      </div>
    </div>
  );
};
