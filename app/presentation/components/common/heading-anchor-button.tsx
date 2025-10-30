"use client";

import { Link as LinkIcon, Check as CheckIcon } from "lucide-react";
import { cn } from "@/presentation/utils/cn";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface HeadingAnchorButtonProps {
  id?: string;
  className?: string;
}

export function HeadingAnchorButton({
  id,
  className,
}: HeadingAnchorButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const onCopy = () => {
    try {
      const hash = id ? `#${id}` : "";
      const url = `${window.location.origin}${pathname}${hash}`;
      void navigator.clipboard.writeText(url);
      // ページ内の対象見出しへ遷移（履歴は置換）
      router.replace(`${pathname}${hash}`);
      // コピー完了フィードバック
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        "absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100",
        "transition-opacity focus:opacity-100 focus-visible:opacity-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        copied
          ? "text-emerald-500"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      aria-label="見出しリンクをコピー"
    >
      {copied ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <LinkIcon className="h-4 w-4" />
      )}
      {/* スクリーンリーダー向けコピー完了通知 */}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "リンクをコピーしました" : ""}
      </span>
    </button>
  );
}
