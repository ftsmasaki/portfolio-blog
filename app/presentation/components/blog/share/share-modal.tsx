"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import type { ShareCoreProps } from "./common";
import { TwitterShareButton } from "./twitter-button";
import { CopyLinkButton } from "./copy-link-button";
import { CopyMarkdownButton } from "./copy-markdown-button";

export interface ShareModalProps extends ShareCoreProps {
  triggerLabel?: string;
}

export function ShareModal(props: ShareModalProps) {
  const { url, title, site, triggerLabel = "共有" } = props;
  const [message, setMessage] = React.useState<string>("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="共有モーダルを開く"
        >
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-md w-[calc(100%-2rem)] max-w-md overflow-hidden bottom-16 translate-y-0">
        <DialogHeader>
          <DialogTitle>この記事を共有</DialogTitle>
        </DialogHeader>
        <div className="w-full flex justify-center">
          <div className="mt-2 flex flex-col gap-4">
            <TwitterShareButton
              url={url}
              title={title}
              site={site}
              onDone={(_, m) => setMessage(m)}
            />
            <CopyLinkButton
              url={url}
              title={title}
              site={site}
              onDone={(_, m) => setMessage(m)}
            />
            <CopyMarkdownButton
              url={url}
              title={title}
              site={site}
              onDone={(_, m) => setMessage(m)}
            />
          </div>
        </div>
        <p aria-live="polite" className="sr-only">
          {message}
        </p>
      </DialogContent>
    </Dialog>
  );
}
