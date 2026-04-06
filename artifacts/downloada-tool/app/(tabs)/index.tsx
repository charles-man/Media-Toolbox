import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { ToolCard } from "@/components/ToolCard";
import { PlatformLogos } from "@/components/PlatformLogos";

const TOOLS = [
  {
    id: "video-downloader",
    title: "Video Downloader",
    subtitle: "YouTube, TikTok, Instagram & more",
    iconName: "download-cloud",
    colorKey: "videoDownloader" as const,
    route: "/video-downloader",
  },
  {
    id: "audio-extractor",
    title: "Audio Extractor",
    subtitle: "Extract MP3 audio from any video",
    iconName: "music",
    colorKey: "audioExtractor" as const,
    route: "/audio-extractor",
  },
  {
    id: "video-converter",
    title: "Video Converter",
    subtitle: "Convert between MP3, MP4 and more",
    iconName: "refresh-cw",
    colorKey: "videoConverter" as const,
    route: "/video-converter",
  },
  {
    id: "video-cutter",
    title: "Video Cutter",
    subtitle: "Trim start and end of your video",
    iconName: "scissors",
    colorKey: "videoCutter" as const,
    route: "/video-cutter",
  },
  {
    id: "video-compressor",
    title: "Video Compressor",
    subtitle: "Reduce video file size easily",
    iconName: "minimize-2",
    colorKey: "videoCompressor" as const,
    route: "/video-compressor",
  },
  {
    id: "merge-videos",
    title: "Merge Videos",
    subtitle: "Combine multiple videos into one",
    iconName: "layers",
    colorKey: "mergeVideos" as const,
    route: "/merge-videos",
  },
  {
    id: "add-subtitles",
    title: "Add Subtitles",
    subtitle: "Embed subtitles into your video",
    iconName: "type",
    colorKey: "addSubtitles" as const,
    route: "/add-subtitles",
  },
  {
    id: "thumbnail-downloader",
    title: "Thumbnail Downloader",
    subtitle: "Save video thumbnails in HD",
    iconName: "image",
    colorKey: "thumbnailDownloader" as const,
    route: "/thumbnail-downloader",
  },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + webTopInset + 12,
          paddingBottom: insets.bottom + webBottomInset + 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.appName, { color: colors.foreground }]}>Downloada Tool</Text>
          <Text style={[styles.appTagline, { color: colors.mutedForeground }]}>
            All-in-one video & audio toolkit
          </Text>
        </View>
        <View style={[styles.logoCircle, { backgroundColor: colors.primary + "18" }]}>
          <Text style={[styles.logoLetter, { color: colors.primary }]}>D</Text>
        </View>
      </View>

      <View style={[styles.banner, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
        <Text style={[styles.bannerTitle, { color: colors.primary }]}>8 Powerful Tools</Text>
        <Text style={[styles.bannerDesc, { color: colors.mutedForeground }]}>
          Download, convert, trim, compress and more — from 144p up to 4K
        </Text>
      </View>

      <PlatformLogos title="DOWNLOAD FROM" />

      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>TOOLS</Text>

      {TOOLS.map((tool) => (
        <ToolCard
          key={tool.id}
          title={tool.title}
          subtitle={tool.subtitle}
          iconName={tool.iconName}
          accentColor={colors[tool.colorKey]}
          onPress={() => router.push(tool.route as any)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 14,
    marginTop: 3,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    fontSize: 26,
    fontWeight: "900",
  },
  banner: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  bannerDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
});
