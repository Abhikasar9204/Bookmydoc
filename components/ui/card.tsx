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
            'bg-card-custom border border-custom shadow-md dark:shadow-sm': variant === 'default',
            'bg-card-custom border border-custom shadow-premium dark:shadow-md': variant === 'elevated',
            'bg-card-custom border-2 border-custom shadow-xs dark:shadow-none': variant === 'outlined',
            'gradient-card-accent border border-custom shadow-md dark:shadow-sm': variant === 'gradient',
            'glass-morphic shadow-md dark:shadow-xs': variant === 'glass' || glass,
            // Hover
            'hover:shadow-premium-hover hover:-translate-y-0.5 cursor-pointer dark:hover:shadow-none': hoverable,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
