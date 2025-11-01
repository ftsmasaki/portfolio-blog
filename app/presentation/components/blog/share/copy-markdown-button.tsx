"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { buildMarkdownLink } from "@/infrastructure/utils/share";
import type {
  ShareCoreProps,
  ShareDoneHandler,
} from "@/presentation/components/blog/share/common";
import {
  BUTTON_BASE,
  writeClipboard,
} from "@/presentation/components/blog/share/common";

interface CopyMarkdownButtonProps extends ShareCoreProps {
  onDone?: ShareDoneHandler;
  className?: string;
}

export function CopyMarkdownButton(props: CopyMarkdownButtonProps) {
  const { url, title, onDone, className } = props;
  const [isChecked, setIsChecked] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  const onClick = () => {
    const md = buildMarkdownLink({ title, url });
    const wrappedOnDone: ShareDoneHandler = (status, message) => {
      if (status === "success") {
        setIsChecked(true);
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          setIsChecked(false);
          timeoutRef.current = null;
        }, 1500);
      }
      onDone?.(status, message);
    };
    void writeClipboard(md, wrappedOnDone);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return (
    <button
      onClick={onClick}
      className={`${BUTTON_BASE} ${className ?? ""}`}
      aria-label="Markdownをコピー"
    >
      {isChecked ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span>Markdownをコピー</span>
    </button>
  );
}
