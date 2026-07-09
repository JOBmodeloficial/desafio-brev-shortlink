import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { Loader2 } from 'lucide-react';

import { cn } from '../lib/cn';

type Variant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  loading?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'h-12 bg-purple text-white text-md hover:bg-purple-soft disabled:hover:bg-purple',
  secondary:
    'h-8 px-3 border border-transparent bg-surface-2 text-subtle text-sm hover:border-purple hover:text-fg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', fullWidth, loading, disabled, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled ?? loading}
      className={cn(base, variants[variant], fullWidth && 'w-full', className)}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" aria-hidden /> : children}
    </button>
  );
});
