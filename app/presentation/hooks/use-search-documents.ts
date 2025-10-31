import { useEffect, useRef, useState } from "react";
import * as E from "fp-ts/Either";
import { httpClient } from "@/infrastructure/http/client";
import type { SearchableDocument } from "@/infrastructure/search/search-index";

/**
 * 検索ドキュメントを必要時に一度だけ取得するフック
 * @param enabled 取得を開始するトリガ（例: モーダルopen）
 */
export function useSearchDocuments(enabled: boolean) {
  const [documents, setDocuments] = useState<SearchableDocument[]>([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      const result = await httpClient.get<SearchableDocument[]>(
        "/api/search-documents",
        { cache: "force-cache" }
      );
      if (E.isRight(result)) {
        setDocuments(result.right.data);
      }
    };

    if (enabled && !loadedRef.current) {
      loadedRef.current = true;
      void fetchDocuments();
    }
  }, [enabled]);

  return { documents };
}
