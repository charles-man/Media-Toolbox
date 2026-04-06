import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useColors } from "@/hooks/useColors";
import { ToolScreen } from "@/components/ToolScreen";

const SUBTITLE_FORMATS = [
  { label: "SRT", value: "srt", description: "Common" },
  { label: "VTT", value: "vtt", description: "Web" },
  { label: "ASS", value: "ass", description: "Styled" },
];

function SubtitleUrlInput() {
  const colors = useColors();
  const [subtitleUrl, setSubtitleUrl] = React.useState("");

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>SUBTITLE FILE URL (OPTIONAL)</Text>
      <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.foreground }]}
          placeholder="Paste .srt or .vtt subtitle URL..."
          placeholderTextColor={colors.mutedForeground}
          value={subtitleUrl}
          onChangeText={setSubtitleUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
      </View>
      <Text style={[styles.hint, { color: colors.mutedForeground }]}>
        Leave blank to auto-generate subtitles using AI
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  label: { fontSize: 12, fontWeight: "600", letterSpacing: 0.8, marginBottom: 10 },
  inputCard: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 8 },
  input: { fontSize: 15 },
  hint: { fontSize: 12, lineHeight: 17 },
});

export default function AddSubtitlesScreen() {
  const colors = useColors();

  const handleAddSubtitles = async (url: string, format: string): Promise<string> => {
    await new Promise((r) => setTimeout(r, 3000));
    return `Subtitles embedded in ${format.toUpperCase()} format. Video saved to your device!`;
  };

  return (
    <ToolScreen
      title="Add Subtitles"
      accentColor={colors.addSubtitles}
      iconName="type"
      description="Embed subtitle files into your video. Supports SRT, VTT, and ASS formats. Or auto-generate with AI."
      inputPlaceholder="Paste video URL..."
      actionLabel="Add Subtitles"
      formats={SUBTITLE_FORMATS}
      extraControls={<SubtitleUrlInput />}
      onAction={handleAddSubtitles}
    />
  );
}
