"use client";

import { useEffect, useRef, useState } from "react";

export interface UseIntersectionOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

/**
 * IntersectionObserverを使用した要素の可視性監視フック
 * スクロール監視や lazy loading に使用
 */
export const useIntersection = (
  options?: UseIntersectionOptions
): [React.RefObject<HTMLElement | null>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options?.threshold, options?.root, options?.rootMargin]);

  return [ref, isIntersecting];
};
