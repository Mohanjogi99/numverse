import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm sm:text-base gap-2 shadow-subtle',
    lg: 'px-7 py-3.5 text-base sm:text-lg gap-2.5 font-semibold shadow-card',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white hover:from-purple-500 hover:via-pink-400 hover:to-amber-400 font-bold shadow-md shadow-pink-500/25 hover:shadow-lg active:scale-95 focus:ring-pink-500 border-none',
    secondary:
      'bg-gradient-to-r from-purple-700 to-indigo-700 text-white hover:from-purple-600 hover:to-indigo-600 font-semibold shadow-md shadow-purple-500/20 focus:ring-purple-500 border-none',
    outline:
      'border border-slate-300 dark:border-purple-900/50 bg-white dark:bg-[#131124] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-purple-950/40 hover:border-pink-500/50 focus:ring-pink-500',
    ghost:
      'text-slate-700 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-500/10 focus:ring-pink-500',
    gold:
      'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white hover:from-pink-400 hover:via-rose-400 hover:to-amber-300 font-bold shadow-md shadow-amber-500/25 focus:ring-amber-400 border-none',
    soft:
      'bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300 hover:bg-pink-500/20 dark:hover:bg-pink-500/30 border border-pink-500/30 focus:ring-pink-500',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="inline-flex shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
