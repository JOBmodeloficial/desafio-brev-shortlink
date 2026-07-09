import { Logo } from '../../components/Logo';
import { LinkForm } from '../../features/links/components/LinkForm';
import { LinkList } from '../../features/links/components/LinkList';

/** Página raiz (`/`): formulário de criação + listagem dos links (FE-01/FE-06). */
export function HomePage() {
  return (
    <main className="mx-auto max-w-[980px] px-3 py-8 md:px-6 md:py-20">
      <div className="mb-6">
        <Logo />
      </div>

      <div className="grid items-start gap-5 md:grid-cols-[380px_1fr]">
        <LinkForm />
        <LinkList />
      </div>
    </main>
  );
}
