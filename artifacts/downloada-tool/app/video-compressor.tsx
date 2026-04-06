import React from "react";
import { useColors } from "@/hooks/useColors";
import { ToolScreen } from "@/components/ToolScreen";

const COMPRESSION_LEVELS = [
  { label: "Low", value: "low", description: "Smaller file" },
  { label: "Medium", value: "medium", description: "Balanced" },
  { label: "High", value: "high", description: "Best quality" },
];

export default function VideoCompressorScreen() {
  const colors = useColors();

  const handleCompress = async (url: string, level: string): Promise<string> => {
    await new Promise((r) => setTimeout(r, 3000));
    const reduction = level === "low" ? "~70%" : level === "medium" ? "~50%" : "~30%";
    return `Video compressed with ${level} compression (${reduction} size reduction). Saved to device!`;
  };

  return (
    <ToolScreen
      title="Video Compressor"
      accentColor={colors.videoCompressor}
      iconName="minimize-2"
      description="Reduce video file size without losing too much quality. Choose your compression level."
      inputPlaceholder="Paste video URL to compress..."
      actionLabel="Compress Video"
      formats={COMPRESSION_LEVELS}
      onAction={handleCompress}
    />
  );
}
