import { Logo } from '../../components/Logo';

/** Página de recurso não encontrado (`*` ou slug inexistente). */
export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <section className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded border border-border bg-surface px-6 py-16 text-center md:px-12">
        <Logo />
        <div className="text-[56px] font-bold leading-none text-purple">404</div>
        <h1 className="text-xl font-bold text-fg">Link não encontrado</h1>
        <p className="max-w-[420px] text-md text-subtle">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.
          Saiba mais em{' '}
          <a href="/" className="font-semibold text-cyan hover:underline">
            brev.ly
          </a>
          .
        </p>
      </section>
    </main>
  );
}
