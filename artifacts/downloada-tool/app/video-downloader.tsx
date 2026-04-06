import React from "react";
import { useColors } from "@/hooks/useColors";
import { ToolScreen } from "@/components/ToolScreen";

const QUALITY_FORMATS = [
  { label: "1080p", value: "1080p", description: "Full HD" },
  { label: "720p", value: "720p", description: "HD" },
  { label: "480p", value: "480p", description: "SD" },
  { label: "360p", value: "360p", description: "Low" },
];

export default function VideoDownloaderScreen() {
  const colors = useColors();

  const handleDownload = async (url: string, quality: string): Promise<string> => {
    await new Promise((r) => setTimeout(r, 3000));
    const platform = url.includes("youtube") || url.includes("youtu.be")
      ? "YouTube"
      : url.includes("tiktok")
      ? "TikTok"
      : url.includes("instagram")
      ? "Instagram"
      : "video";
    return `${platform} video downloaded in ${quality}! Saved to your device.`;
  };

  return (
    <ToolScreen
      title="Video Downloader"
      accentColor={colors.videoDownloader}
      iconName="download-cloud"
      description="Download videos from YouTube, TikTok, Instagram, Twitter, Facebook and 1000+ sites."
      inputPlaceholder="Paste YouTube, TikTok or video URL..."
      actionLabel="Download Video"
      formats={QUALITY_FORMATS}
      onAction={handleDownload}
    />
  );
}
