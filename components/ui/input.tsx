import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        <div className="relative flex items-center group">
          {icon && <div className="absolute left-4 text-slate-400 pointer-events-none transition-colors group-focus-within:text-primary">{icon}</div>}
          <input
            type={type}
            className={cn(
              "flex h-[52px] w-full rounded-2xl border-[1.5px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-[15px] text-slate-800 dark:text-slate-100 transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 shadow-xs",
              {
                "pl-12": icon,
                "border-error focus:border-error focus:ring-error/10": error,
              },
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        <div className="h-4 flex items-center">
          {error && <span className="text-xs font-semibold text-error pl-1 animate-fade-in block leading-none">{error}</span>}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
