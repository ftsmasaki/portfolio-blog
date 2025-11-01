"use client";

import * as React from "react";
import type { ShareCoreProps } from "./share/common";
import { TwitterShareButton } from "./share/twitter-button";
import { CopyLinkButton } from "./share/copy-link-button";
import { CopyMarkdownButton } from "./share/copy-markdown-button";

export type ShareButtonsProps = ShareCoreProps;

export function ShareButtons(props: ShareButtonsProps) {
  const { url, title, site } = props;

  const [message, setMessage] = React.useState<string>("");
  const announce = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2000);
  };

  return (
    <section aria-label="共有" className="mt-6 flex flex-wrap gap-3">
      <TwitterShareButton
        url={url}
        title={title}
        site={site}
        onDone={(_, m) => announce(m)}
      />
      <CopyLinkButton
        url={url}
        title={title}
        site={site}
        onDone={(_, m) => announce(m)}
      />
      <CopyMarkdownButton
        url={url}
        title={title}
        site={site}
        onDone={(_, m) => announce(m)}
      />
      <p aria-live="polite" className="sr-only">
        {message}
      </p>
    </section>
  );
}
