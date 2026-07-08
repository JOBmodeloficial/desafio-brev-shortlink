import { useParams } from 'react-router-dom';

/**
 * Stub do Redirect (`/:shortUrl`). Onda 5 resolve o slug e redireciona (FE-05).
 */
export function RedirectPage() {
  const { shortUrl } = useParams<{ shortUrl: string }>();

  return (
    <main>
      <h1>Redirect</h1>
      <p>{shortUrl}</p>
    </main>
  );
}
