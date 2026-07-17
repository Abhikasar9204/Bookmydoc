'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(
          'inline-flex items-center justify-center font-semibold tracking-[-0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 ripple-container',
          // Variants
          {
            'bg-gradient-to-b from-[#0F8B8D] to-[#0A7577] text-white shadow-inner-glow hover:from-[#0A7577] hover:to-[#085E60]': variant === 'primary',
            'bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 border border-primary-200/60 dark:border-primary-800/40': variant === 'secondary',
            'border-[1.5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs': variant === 'outline',
            'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200': variant === 'ghost',
            'bg-gradient-to-b from-red-500 to-red-600 text-white shadow-inner-glow hover:from-red-600 hover:to-red-700': variant === 'danger',
          },
          // Sizes — minimum 44px touch targets
          {
            'h-10 px-4 text-sm rounded-xl gap-1.5': size === 'sm',
            'h-12 px-6 text-[15px] rounded-2xl gap-2': size === 'md',
            'h-14 px-8 text-base rounded-2xl gap-2': size === 'lg',
            'h-11 w-11 p-2.5 rounded-xl': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
