"use client";

import type { UTMOptions } from "@/infrastructure/utils/share";

export interface ShareCoreProps {
  url: string;
  title: string;
  site?: string;
}

export type ShareDoneHandler = (
  status: "success" | "error",
  message: string
) => void;

export const BUTTON_BASE =
  "inline-flex items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors";

export const makeUtm = (source: string): UTMOptions => ({
  source,
  medium: "social",
  campaign: "share_button",
});

export async function writeClipboard(text: string, onDone?: ShareDoneHandler) {
  try {
    await navigator.clipboard.writeText(text);
    onDone?.("success", "クリップボードにコピーしました");
  } catch {
    onDone?.("error", "コピーに失敗しました");
  }
}
