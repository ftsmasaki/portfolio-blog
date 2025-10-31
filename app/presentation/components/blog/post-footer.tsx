"use client";

import { ShareModal } from "@/presentation/components/blog/share/share-modal";

interface PostFooterProps {
  title: string;
  url: string;
  site?: string;
}

export const PostFooter = ({ title, url, site }: PostFooterProps) => {
  return (
    <footer className="mt-10">
      <hr className="my-8 border-t border-zinc-200 dark:border-zinc-800" />
      <div className="flex justify-end">
        <ShareModal title={title} url={url} site={site} triggerLabel="共有" />
      </div>
    </footer>
  );
};
