import { Link } from 'react-router-dom';

import { cn } from '../lib/cn';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
}

/** Logo oficial brev.ly, clicável (volta para `/`). */
export function Logo({ variant = 'full', className }: LogoProps) {
  const src = variant === 'icon' ? '/brev.ly-logo-alone.png' : '/brev.ly-logo.png';

  return (
    <Link to="/" aria-label="brev.ly" className="inline-flex">
      <img src={src} alt="brev.ly" className={cn(variant === 'icon' ? 'h-16' : 'h-6', className)} />
    </Link>
  );
}
