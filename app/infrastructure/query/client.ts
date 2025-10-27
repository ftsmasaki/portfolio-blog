import { QueryClient } from "@tanstack/react-query";

/**
 * React Queryのクライアント設定
 * キャッシュ戦略、リトライ設定、ステールタイムなどを設定
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分
      gcTime: 10 * 60 * 1000, // 10分（旧cacheTime）
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
