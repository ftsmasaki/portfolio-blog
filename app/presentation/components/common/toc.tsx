"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/presentation/utils/cn";
import type { TocEntry } from "@/infrastructure/utils/extract-toc";

interface TocProps {
  entries: TocEntry[];
  className?: string;
}

export const Toc = ({ entries, className }: TocProps) => {
  const [activeId, setActiveId] = useState<string>("");

  // フラットなIDリストを用意（監視効率化）
  const headingIds = useMemo(() => {
    const ids: string[] = [];
    const walk = (items: TocEntry[]) => {
      for (const item of items) {
        ids.push(item.id);
        if (item.children && item.children.length > 0) walk(item.children);
      }
    };
    walk(entries);
    return ids;
  }, [entries]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      observerEntries => {
        // 最上部に近い見出しをactiveに
        const visible = observerEntries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const id = visible[0].target.getAttribute("id") || "";
          setActiveId(id);
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );

    const targets = headingIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    targets.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [headingIds]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const y = element.getBoundingClientRect().top + window.scrollY - 64; // 64px=ヘッダー高さ
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (entries.length === 0) return null;

  const renderItems = (items: TocEntry[], depthBase = 2) => {
    return (
      <ul className={cn("space-y-1", depthBase > 2 && "ml-4 mt-1")}> 
        {items.map(item => (
          <li key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "flex items-start gap-2 text-sm text-left w-full py-1 px-2 rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                activeId === item.id &&
                  "bg-accent text-accent-foreground font-medium"
              )}
              aria-current={activeId === item.id ? "location" : undefined}
              aria-label={`${item.text} へ移動`}
            >
              <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="line-clamp-2">{item.text}</span>
            </button>
            {item.children &&
              item.children.length > 0 &&
              renderItems(item.children, depthBase + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <nav
      className={cn(
        "sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto",
        className
      )}
      aria-label="目次"
    >
      <h2 className="font-semibold text-sm mb-4">目次</h2>
      {renderItems(entries)}
    </nav>
  );
};
