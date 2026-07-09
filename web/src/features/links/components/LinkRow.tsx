import { useState } from 'react';

import { Copy, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { IconButton } from '../../../components/IconButton';
import { copyToClipboard } from '../../../lib/clipboard';
import { useDeleteLink } from '../hooks';
import type { LinkItem } from '../schemas';

const frontendUrl = (import.meta.env.VITE_FRONTEND_URL ?? '').replace(/\/+$/, '');

function shortLabel(shortUrl: string): string {
  const host = frontendUrl.replace(/^https?:\/\//, '') || 'brev.ly';
  return `${host}/${shortUrl}`;
}

export function LinkRow({ link }: { link: LinkItem }) {
  const deleteLink = useDeleteLink();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(`${frontendUrl}/${link.shortUrl}`);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border py-4">
      <div className="flex min-w-0 flex-col gap-1">
        <Link
          to={`/${link.shortUrl}`}
          className="truncate text-md font-semibold text-purple hover:underline"
        >
          {shortLabel(link.shortUrl)}
        </Link>
        <span className="truncate text-sm text-muted">{link.originalUrl}</span>
      </div>

      <div className="flex flex-shrink-0 items-center gap-4">
        <span className="whitespace-nowrap text-sm text-subtle">{link.accessCount} acessos</span>
        <div className="flex gap-2">
          <IconButton label={copied ? 'Copiado!' : 'Copiar link'} onClick={handleCopy}>
            <Copy size={16} aria-hidden />
          </IconButton>
          <IconButton
            label="Deletar link"
            onClick={() => deleteLink.mutate(link.id)}
            disabled={deleteLink.isPending}
          >
            <Trash2 size={16} aria-hidden />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
