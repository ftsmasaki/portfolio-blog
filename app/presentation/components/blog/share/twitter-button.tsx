"use client";

import { XIcon } from "@/presentation/components/ui/icons/x";
import { buildTwitterIntent } from "@/infrastructure/utils/share";
import type {
  ShareCoreProps,
  ShareDoneHandler,
} from "@/presentation/components/blog/share/common";
import {
  BUTTON_BASE,
  makeUtm,
} from "@/presentation/components/blog/share/common";

interface TwitterShareButtonProps extends ShareCoreProps {
  onDone?: ShareDoneHandler;
  className?: string;
}

export function TwitterShareButton(props: TwitterShareButtonProps) {
  const { url, title, site, onDone, className } = props;
  const onClick = () => {
    const intent = buildTwitterIntent({
      url,
      title,
      site,
      utm: makeUtm("twitter"),
    });
    window.open(intent, "_blank", "noopener,noreferrer");
    onDone?.("success", "Xの投稿画面を開きました");
  };
  return (
    <button
      onClick={onClick}
      className={`${BUTTON_BASE} ${className ?? ""}`}
      aria-label="Xで共有"
    >
      <XIcon className="h-4 w-4" />
      <span>Xで共有</span>
    </button>
  );
}
