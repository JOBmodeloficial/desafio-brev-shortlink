import { Download, Loader2 } from 'lucide-react';

import { Button } from '../../../components/Button';
import { downloadFromUrl } from '../../../lib/download';
import { useExport, useLinks } from '../hooks';
import { EmptyState } from './EmptyState';
import { LinkRow } from './LinkRow';

export function LinkList() {
  const { data, isLoading, isError } = useLinks();
  const exportLinks = useExport();

  const links = data?.links ?? [];
  const isEmpty = !isLoading && !isError && links.length === 0;

  async function handleExport() {
    const { url } = await exportLinks.mutateAsync();
    downloadFromUrl(url);
  }

  return (
    <section
      className="flex flex-col rounded border border-border bg-surface p-6"
      aria-label="Meus links"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Meus links</h2>
        <Button
          variant="secondary"
          onClick={handleExport}
          disabled={isEmpty || links.length === 0}
          loading={exportLinks.isPending}
        >
          <Download size={16} aria-hidden />
          Baixar CSV
        </Button>
      </div>

      <hr className="border-border" />

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-6 text-muted">
          <Loader2 size={18} className="animate-spin" aria-hidden />
          <span className="text-sm">Carregando links…</span>
        </div>
      )}

      {isError && (
        <div className="py-6 text-center text-sm text-red">Não foi possível carregar os links.</div>
      )}

      {isEmpty && <EmptyState />}

      {!isLoading && !isError && links.map((link) => <LinkRow key={link.id} link={link} />)}
    </section>
  );
}
