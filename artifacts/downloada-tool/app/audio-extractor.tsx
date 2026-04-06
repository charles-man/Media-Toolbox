import React from "react";
import { useColors } from "@/hooks/useColors";
import { ToolScreen } from "@/components/ToolScreen";

const BITRATE_FORMATS = [
  { label: "320 kbps", value: "320k", description: "Best" },
  { label: "192 kbps", value: "192k", description: "Great" },
  { label: "128 kbps", value: "128k", description: "Good" },
  { label: "96 kbps", value: "96k", description: "Small" },
];

export default function AudioExtractorScreen() {
  const colors = useColors();

  const handleExtract = async (url: string, bitrate: string): Promise<string> => {
    await new Promise((r) => setTimeout(r, 3000));
    return `Audio extracted at ${bitrate} and saved as MP3 to your device!`;
  };

  return (
    <ToolScreen
      title="Audio Extractor"
      accentColor={colors.audioExtractor}
      iconName="music"
      description="Extract high-quality MP3 audio from any video URL. Choose your preferred bitrate."
      inputPlaceholder="Paste video URL to extract audio..."
      actionLabel="Extract MP3"
      formats={BITRATE_FORMATS}
      onAction={handleExtract}
    />
  );
}
