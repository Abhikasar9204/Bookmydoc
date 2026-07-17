import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'glass';
  padding?: 'compact' | 'default' | 'spacious';
  hoverable?: boolean;
  glass?: boolean;
}

const paddingMap = {
  compact: 'p-4',
  default: 'p-6',
  spacious: 'p-8',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'default', hoverable = false, glass = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[28px] transition-all duration-300 ease-out',
          paddingMap[padding],
          {
            // Variants
            'bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800 shadow-md': variant === 'default',
            'bg-white dark:bg-slate-900 border border-slate-100/60 dark:border-slate-800 shadow-premium': variant === 'elevated',
            'bg-white dark:bg-slate-900 border-2 border-slate-200/70 dark:border-slate-800 shadow-xs': variant === 'outlined',
            'gradient-card-accent border border-slate-100/60 dark:border-slate-800 shadow-md': variant === 'gradient',
            'glass-morphic shadow-md': variant === 'glass' || glass,
            // Hover
            'hover:shadow-premium-hover hover:-translate-y-0.5 cursor-pointer': hoverable,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
