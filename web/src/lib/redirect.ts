/** Redireciona o navegador para a URL original (isolado para ser mockável em teste). */
export function redirectTo(url: string): void {
  window.location.href = url;
}
