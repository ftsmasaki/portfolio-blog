"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * React Query プロバイダーコンポーネント
 * クライアントコンポーネントとしてQueryClientProviderをラップ
 */
export const QueryProvider = ({ children }: QueryProviderProps) => {
  // useStateを使用して、各レンダリングで新しいQueryClientインスタンスを作成するのを防ぐ
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5分
            gcTime: 10 * 60 * 1000, // 10分
            retry: 3,
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
