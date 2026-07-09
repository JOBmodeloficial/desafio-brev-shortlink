/** Dispara o download/abertura de uma URL (o CSV vive na CDN — D10). */
export function downloadFromUrl(url: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.rel = 'noopener';
  anchor.target = '_blank';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
