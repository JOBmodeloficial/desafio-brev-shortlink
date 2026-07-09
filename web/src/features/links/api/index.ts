import { http } from '../../../lib/http';
import type { CreateLinkInput, LinkItem, LinkListResponse } from '../schemas';

/** Camada de I/O do domínio de links — nada de fetch fora daqui (constitution Art.1 R2). */

export function createLink(input: CreateLinkInput): Promise<LinkItem> {
  return http.post<LinkItem>('/links', input);
}

export function listLinks(
  params: { page?: number; pageSize?: number } = {},
): Promise<LinkListResponse> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.pageSize) search.set('pageSize', String(params.pageSize));
  const qs = search.toString();
  return http.get<LinkListResponse>(`/links${qs ? `?${qs}` : ''}`);
}

export function deleteLink(id: string): Promise<void> {
  return http.delete<void>(`/links/${id}`);
}

export function resolveLink(shortUrl: string): Promise<LinkItem> {
  return http.get<LinkItem>(`/links/${encodeURIComponent(shortUrl)}`);
}

export function exportLinks(): Promise<{ url: string }> {
  return http.post<{ url: string }>('/links/exports');
}
