import { Link2 } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 border-t border-border py-10 text-muted">
      <Link2 size={32} aria-hidden />
      <span className="text-xs uppercase tracking-wide">Ainda não existem links cadastrados</span>
    </div>
  );
}
