"use client";

import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/presentation/utils";

/**
 * ヘッダーコンポーネント
 * グラスモーフィズムスタイルとナビゲーションを含む
 */
export function Header() {
  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <a href="/" className="text-xl font-bold">
            Portfolio Blog
          </a>
        </div>

        <nav className="flex items-center gap-4">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
