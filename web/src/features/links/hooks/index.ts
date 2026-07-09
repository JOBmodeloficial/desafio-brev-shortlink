import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createLink, deleteLink, exportLinks, listLinks, resolveLink } from '../api';

export const linkKeys = {
  all: ['links'] as const,
  resolve: (shortUrl: string) => ['resolve', shortUrl] as const,
};

/** Lista os links (pageSize alto: a listagem do desafio não tem paginação de UI). */
export function useLinks() {
  return useQuery({
    queryKey: linkKeys.all,
    queryFn: () => listLinks({ page: 1, pageSize: 100 }),
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: linkKeys.all }),
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: linkKeys.all }),
  });
}

export function useResolve(shortUrl: string) {
  return useQuery({
    queryKey: linkKeys.resolve(shortUrl),
    queryFn: () => resolveLink(shortUrl),
    enabled: shortUrl.length > 0,
    retry: false,
  });
}

export function useExport() {
  return useMutation({ mutationFn: exportLinks });
}
