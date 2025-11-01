"use client";

import * as React from "react";
import { Link as LinkIcon, Check } from "lucide-react";
import type {
  ShareCoreProps,
  ShareDoneHandler,
} from "@/presentation/components/blog/share/common";
import { BUTTON_BASE, writeClipboard } from "./common";

interface CopyLinkButtonProps extends ShareCoreProps {
  onDone?: ShareDoneHandler;
  className?: string;
}

export function CopyLinkButton(props: CopyLinkButtonProps) {
  const { url, onDone, className } = props;
  const [isChecked, setIsChecked] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  const onClick = () => {
    const text = url;
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
    void writeClipboard(text, wrappedOnDone);
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
      aria-label="リンクをコピー"
    >
      {isChecked ? (
        <Check className="h-4 w-4" />
      ) : (
        <LinkIcon className="h-4 w-4" />
      )}
      <span>リンクをコピー</span>
    </button>
  );
}
