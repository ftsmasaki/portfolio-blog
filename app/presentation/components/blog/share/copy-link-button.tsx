"use client";

import { Link as LinkIcon } from "lucide-react";
import { buildPlainText } from "@/infrastructure/utils/share";
import type { ShareCoreProps, ShareDoneHandler } from "./common";
import { BUTTON_BASE, writeClipboard } from "./common";

interface CopyLinkButtonProps extends ShareCoreProps {
  onDone?: ShareDoneHandler;
  className?: string;
}

export function CopyLinkButton(props: CopyLinkButtonProps) {
  const { url, title, site, onDone, className } = props;
  const onClick = () => {
    const text = buildPlainText({ title, site, url });
    void writeClipboard(text, onDone);
  };
  return (
    <button
      onClick={onClick}
      className={`${BUTTON_BASE} ${className ?? ""}`}
      aria-label="リンクをコピー"
    >
      <LinkIcon className="h-4 w-4" />
      <span>リンクをコピー</span>
    </button>
  );
}
