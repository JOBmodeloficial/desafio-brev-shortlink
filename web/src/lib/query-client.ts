import { QueryClient } from '@tanstack/react-query';

/** QueryClient com defaults conservadores para uma SPA de dados simples. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30,
    },
  },
});
