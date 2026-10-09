import React from 'react';
import { cn } from '../../utils/cn';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 p-4', className)}>
      <div
        className={cn(
          'rounded-full border-indigo-600 border-t-transparent animate-spin',
          sizeClasses[size]
        )}
        role="status"
        aria-label={label || 'Loading...'}
      />
      {label && <p className="text-xs sm:text-sm font-medium text-slate-600">{label}</p>}
    </div>
  );
};
