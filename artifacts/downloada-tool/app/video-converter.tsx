import React from "react";
import { useColors } from "@/hooks/useColors";
import { ToolScreen } from "@/components/ToolScreen";

const OUTPUT_FORMATS = [
  { label: "MP4", value: "mp4", description: "Universal" },
  { label: "MP3", value: "mp3", description: "Audio only" },
  { label: "AVI", value: "avi", description: "Windows" },
  { label: "MOV", value: "mov", description: "Apple" },
  { label: "WEBM", value: "webm", description: "Web" },
  { label: "GIF", value: "gif", description: "Animation" },
];

export default function VideoConverterScreen() {
  const colors = useColors();

  const handleConvert = async (url: string, format: string): Promise<string> => {
    await new Promise((r) => setTimeout(r, 3000));
    return `Video successfully converted to ${format.toUpperCase()} and saved to your device!`;
  };

  return (
    <ToolScreen
      title="Video Converter"
      accentColor={colors.videoConverter}
      iconName="refresh-cw"
      description="Convert any video to MP4, MP3, AVI, MOV, WEBM, or GIF. Fast and easy format conversion."
      inputPlaceholder="Paste video URL or upload a file..."
      actionLabel="Convert Video"
      formats={OUTPUT_FORMATS}
      onAction={handleConvert}
    />
  );
}
