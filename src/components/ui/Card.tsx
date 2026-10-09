import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200';

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantStyles = {
    default:
      'bg-white dark:bg-[#0D121F]/90 border border-slate-200/80 dark:border-slate-800/80 shadow-card dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] dark:backdrop-blur-md',
    elevated:
      'bg-white dark:bg-[#0F1626] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)]',
    glass:
      'bg-white/80 dark:bg-[#0D121F]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-card dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
    interactive:
      'bg-white dark:bg-[#0D121F]/90 border border-slate-200/80 dark:border-slate-800/80 shadow-card hover:shadow-card-hover dark:hover:shadow-[0_12px_36px_rgba(99,102,241,0.2)] hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:-translate-y-0.5 cursor-pointer dark:backdrop-blur-md',
    flat:
      'bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60',
  };

  return (
    <div
      className={cn(baseStyles, paddingStyles[padding], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};
