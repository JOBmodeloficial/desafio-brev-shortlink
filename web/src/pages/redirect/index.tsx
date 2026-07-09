import { useEffect } from 'react';

import { Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Logo } from '../../components/Logo';
import { useResolve } from '../../features/links/hooks';
import { redirectTo } from '../../lib/redirect';
import { NotFoundPage } from '../not-found';

/** Página de redirecionamento (`/:shortUrl`): resolve o slug e redireciona (FE-05/FE-07). */
export function RedirectPage() {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const { data, isError } = useResolve(shortUrl ?? '');

  useEffect(() => {
    if (data) {
      redirectTo(data.originalUrl);
    }
  }, [data]);

  if (isError) {
    return <NotFoundPage />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <section className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded border border-border bg-surface px-6 py-16 text-center md:px-12">
        <Logo variant="icon" />

        <div className="flex items-center gap-3">
          <Loader2 size={20} className="animate-spin text-purple" aria-hidden />
          <h1 className="text-xl font-bold text-fg">Redirecionando...</h1>
        </div>

        <p className="max-w-[420px] text-md text-subtle">
          O link será aberto automaticamente em alguns instantes.
          <br />
          Não foi redirecionado?{' '}
          {data ? (
            <a href={data.originalUrl} className="font-semibold text-cyan hover:underline">
              Acesse aqui
            </a>
          ) : (
            'Acesse aqui'
          )}
          .
        </p>
      </section>
    </main>
  );
}
