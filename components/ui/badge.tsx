import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
}

const sizeMap = {
  xs: 'px-2 py-0.5 text-[10px]',
  sm: 'px-2.5 py-0.5 text-[11px]',
  md: 'px-3 py-1 text-xs',
};

const dotColorMap: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-rose-500',
  neutral: 'bg-slate-400',
};

export const Badge = ({ className, variant = 'neutral', size = 'md', dot = false, ...props }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide transition-colors',
        sizeMap[size],
        {
          'bg-primary-50 text-primary-700 border border-primary-200/40': variant === 'primary',
          'bg-teal-50 text-teal-700 border border-teal-200/40': variant === 'secondary',
          'bg-emerald-50 text-emerald-700 border border-emerald-200/40': variant === 'success',
          'bg-amber-50 text-amber-700 border border-amber-200/40': variant === 'warning',
          'bg-rose-50 text-rose-700 border border-rose-200/40': variant === 'error',
          'bg-slate-100 text-slate-600 border border-slate-200/40': variant === 'neutral',
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
