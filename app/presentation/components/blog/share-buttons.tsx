"use client";

import * as React from "react";
import {
  buildMarkdownLink,
  buildPlainText,
  buildTwitterIntent,
} from "@/infrastructure/utils/share";
import type { UTMOptions } from "@/infrastructure/utils/share";
import { Twitter, Link as LinkIcon, ClipboardCheck, Copy } from "lucide-react";

export interface ShareButtonsProps {
  url: string;
  title: string;
  site?: string;
}

const BUTTON_BASE =
  "inline-flex items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors";

export function ShareButtons(props: ShareButtonsProps) {
  const { url, title, site } = props;

  const [message, setMessage] = React.useState<string>("");
  const announce = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2000);
  };

  const makeUtm = (source: string): UTMOptions => ({
    source,
    medium: "social",
    campaign: "share_button",
  });

  const onShareTwitter = () => {
    const intent = buildTwitterIntent({
      url,
      title,
      site,
      utm: makeUtm("twitter"),
    });
    window.open(intent, "_blank", "noopener,noreferrer");
  };

  const writeClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      announce("クリップボードにコピーしました");
    } catch {
      announce("コピーに失敗しました");
    }
  };

  const onCopyLink = () => {
    const text = buildPlainText({ title, site, url });
    void writeClipboard(text);
  };

  const onCopyMarkdown = () => {
    const md = buildMarkdownLink({ title, url });
    void writeClipboard(md);
  };

  return (
    <section aria-label="共有" className="mt-6 flex flex-wrap gap-3">
      <button
        onClick={onShareTwitter}
        className={BUTTON_BASE}
        aria-label="Xで共有"
      >
        <Twitter className="h-4 w-4" />
        <span>Xで共有</span>
      </button>
      <button
        onClick={onCopyLink}
        className={BUTTON_BASE}
        aria-label="リンクをコピー"
      >
        <LinkIcon className="h-4 w-4" />
        <span>リンクをコピー</span>
      </button>
      <button
        onClick={onCopyMarkdown}
        className={BUTTON_BASE}
        aria-label="Markdownをコピー"
      >
        <Copy className="h-4 w-4" />
        <span>Markdownをコピー</span>
      </button>
      <p aria-live="polite" className="sr-only">
        {message}
      </p>
    </section>
  );
}
