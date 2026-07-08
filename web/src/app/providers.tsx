import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { queryClient } from '../lib/query-client';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Root providers. Ponto de extensão para outros providers (W4-T7 refina o QueryClient).
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
