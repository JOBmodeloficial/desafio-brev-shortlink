import { Link } from 'react-router-dom';

import { cn } from '../lib/cn';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
}

/** Logo oficial brev.ly (ícone azul + wordmark), clicável (volta para `/`). */
export function Logo({ variant = 'full', className }: LogoProps) {
  return (
    <Link to="/" aria-label="brev.ly" className="inline-flex items-center gap-2">
      <img
        src="/brev.ly-icon.svg"
        alt="brev.ly"
        className={cn(variant === 'icon' ? 'h-12 w-auto' : 'h-6 w-auto', className)}
      />
      {variant === 'full' && (
        <span aria-hidden className="text-lg font-bold leading-none text-purple">
          brev.ly
        </span>
      )}
    </Link>
  );
}
