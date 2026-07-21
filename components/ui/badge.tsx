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
  primary: 'bg-primary-500',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-danger',
  neutral: 'bg-slate-400 dark:bg-slate-500',
  info: 'bg-info',
  emergency: 'bg-emergency',
};

export const Badge = ({ className, variant = 'neutral', size = 'md', dot = false, ...props }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide transition-colors theme-transition',
        sizeMap[size],
        {
          'bg-primary-50 text-primary-700 border border-primary-200/40': variant === 'primary',
          'bg-teal-50 text-teal-700 border border-teal-200/40': variant === 'secondary',
          'bg-success-subtle text-success border border-success/15': variant === 'success',
          'bg-warning-subtle text-warning border border-warning/15': variant === 'warning',
          'bg-danger-subtle text-danger border border-danger/15': variant === 'error',
          'bg-info-subtle text-info border border-info/15': variant === 'info',
          'bg-emergency-subtle text-emergency border border-emergency/15': variant === 'emergency',
          'bg-slate-100 dark:bg-slate-800 text-secondary border border-custom': variant === 'neutral',
        },
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColorMap[variant])} />
      )}
      {props.children}
    </span>
  );
};
