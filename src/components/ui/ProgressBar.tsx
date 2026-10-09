import React from 'react';
import { cn } from '../../utils/cn';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'gold' | 'emerald';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  variant = 'primary',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeHeights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantGradients = {
    primary: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    secondary: 'bg-gradient-to-r from-purple-500 to-violet-600',
    gold: 'bg-gradient-to-r from-amber-400 to-amber-500',
    emerald: 'bg-gradient-to-r from-teal-400 to-emerald-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm font-medium text-slate-700">
          {label && <span>{label}</span>}
          {showValue && <span className="text-slate-500 font-semibold">{percentage}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden', sizeHeights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', variantGradients[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
