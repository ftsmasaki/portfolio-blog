"use client";

import { Copy } from "lucide-react";
import { buildMarkdownLink } from "@/infrastructure/utils/share";
import type { ShareCoreProps, ShareDoneHandler } from "./common";
import { BUTTON_BASE, writeClipboard } from "./common";

interface CopyMarkdownButtonProps extends ShareCoreProps {
  onDone?: ShareDoneHandler;
  className?: string;
}

export function CopyMarkdownButton(props: CopyMarkdownButtonProps) {
  const { url, title, onDone, className } = props;
  const onClick = () => {
    const md = buildMarkdownLink({ title, url });
    void writeClipboard(md, onDone);
  };
  return (
    <button
      onClick={onClick}
      className={`${BUTTON_BASE} ${className ?? ""}`}
      aria-label="Markdownをコピー"
    >
      <Copy className="h-4 w-4" />
      <span>Markdownをコピー</span>
    </button>
  );
}
