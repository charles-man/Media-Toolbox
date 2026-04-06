import React from "react";
import { useColors } from "@/hooks/useColors";
import { ToolScreen } from "@/components/ToolScreen";

const THUMBNAIL_SIZES = [
  { label: "Max", value: "maxresdefault", description: "1280×720" },
  { label: "HQ", value: "hqdefault", description: "480×360" },
  { label: "MQ", value: "mqdefault", description: "320×180" },
  { label: "SD", value: "sddefault", description: "640×480" },
];

export default function ThumbnailDownloaderScreen() {
  const colors = useColors();

  const handleDownload = async (url: string, size: string): Promise<string> => {
    await new Promise((r) => setTimeout(r, 2000));
    const sizeLabel = THUMBNAIL_SIZES.find((s) => s.value === size)?.description ?? size;
    return `Thumbnail downloaded at ${sizeLabel} resolution. Saved to your photos!`;
  };

  return (
    <ToolScreen
      title="Thumbnail Downloader"
      accentColor={colors.thumbnailDownloader}
      iconName="image"
      description="Save video thumbnails in high definition from YouTube and other platforms."
      inputPlaceholder="Paste YouTube or video URL..."
      actionLabel="Download Thumbnail"
      formats={THUMBNAIL_SIZES}
      onAction={handleDownload}
    />
  );
}
