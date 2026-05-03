'use client';

import type { ReactNode } from 'react';

type UploadResultInfo = {
  secure_url?: string;
};

export type CloudinaryUploadWidgetResults = {
  info?: UploadResultInfo;
};

type WidgetRenderArgs = {
  open: () => void;
};

type WidgetProps = {
  uploadPreset?: string;
  options?: unknown;
  onSuccess?: (result: CloudinaryUploadWidgetResults) => void;
  children: (args: WidgetRenderArgs) => ReactNode;
};

export function CldUploadWidget({ onSuccess, children }: WidgetProps) {
  const open = () => {
    const url = window.prompt('Paste uploaded file URL (https://...)');
    if (!url) return;
    onSuccess?.({ info: { secure_url: url } });
  };

  return <>{children({ open })}</>;
}
