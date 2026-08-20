import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'info' | 'emergency';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
}

const sizeMap = {
  xs: 'px-2 py-0.5 text-[10px]',
  sm: 'px-2.5 py-0.5 text-[11px]',
  md: 'px-3 py-1 text-xs',
};

const dotColorMap: Record<string, string> = {
  primary: 'bg-primary-500 dark:bg-primary-400',
  secondary: 'bg-teal-500 dark:bg-teal-400',
  success: 'bg-emerald-500 dark:bg-emerald-400',
  warning: 'bg-amber-500 dark:bg-amber-400',
  error: 'bg-red-500 dark:bg-red-400',
  neutral: 'bg-slate-400 dark:bg-slate-500',
  info: 'bg-blue-500 dark:bg-blue-400',
  emergency: 'bg-orange-500 dark:bg-orange-400',
};

export const Badge = ({ className, variant = 'neutral', size = 'md', dot = false, ...props }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide transition-colors theme-transition',
        sizeMap[size],
        {
          'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/50': variant === 'primary',
          'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/50': variant === 'secondary',
          'bg-success-subtle text-success border border-emerald-500/20 dark:border-emerald-500/40': variant === 'success',
          'bg-warning-subtle text-warning border border-amber-500/20 dark:border-amber-500/40': variant === 'warning',
          'bg-danger-subtle text-danger border border-red-500/20 dark:border-red-500/40': variant === 'error',
          'bg-info-subtle text-info border border-blue-500/20 dark:border-blue-500/40': variant === 'info',
          'bg-emergency-subtle text-emergency border border-orange-500/20 dark:border-orange-500/40': variant === 'emergency',
          'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700': variant === 'neutral',
        },
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColorMap[variant] || dotColorMap.neutral)} />
      )}
      {props.children}
    </span>
  );
};
