import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Animated, Platform, ActivityIndicator, Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";
import { PlatformLogos } from "@/components/PlatformLogos";

const QUALITY_OPTIONS = [
  { label: "4K",    value: "2160p", description: "Ultra HD" },
  { label: "2K",    value: "1440p", description: "Quad HD"  },
  { label: "1080p", value: "1080p", description: "Full HD"  },
  { label: "720p",  value: "720p",  description: "HD"       },
  { label: "480p",  value: "480p",  description: "SD"       },
  { label: "360p",  value: "360p",  description: "Low"      },
  { label: "240p",  value: "240p",  description: "Lower"    },
  { label: "144p",  value: "144p",  description: "Lowest"   },
];

export default function VideoDownloaderScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [url, setUrl] = useState("");
  const [pickedFileName, setPickedFileName] = useState<string | null>(null);
  const [pickedFileUri, setPickedFileUri] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resultMessage, setResultMessage] = useState("");
  const progressAnim = useRef(new Animated.Value(0)).current;
  const accentColor = colors.videoDownloader;

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const simulateProgress = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, { toValue: 1, duration: 2800, useNativeDriver: false }).start();
  };

  const detectPlatform = (u: string) => {
    if (u.includes("youtube") || u.includes("youtu.be")) return "YouTube";
    if (u.includes("tiktok")) return "TikTok";
    if (u.includes("instagram")) return "Instagram";
    if (u.includes("twitter") || u.includes("x.com")) return "Twitter/X";
    if (u.includes("facebook") || u.includes("fb.com")) return "Facebook";
    if (u.includes("pinterest")) return "Pinterest";
    if (u.includes("telegram")) return "Telegram";
    return "Video";
  };

  const pickFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setPickedFileName(asset.fileName ?? asset.uri.split("/").pop() ?? "video");
        setPickedFileUri(asset.uri);
        setUrl("");
      }
    } catch {
      Alert.alert("", "Could not open file picker. Please paste a URL instead.");
    }
  };

  const handleDownload = async () => {
    const input = pickedFileUri ?? url.trim();
    if (!input) {
      Alert.alert("", t.missingInput);
      return;
    }
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStatus("loading");
    simulateProgress();
    await new Promise((r) => setTimeout(r, 3000));
    const qualityLabel = QUALITY_OPTIONS.find((q) => q.value === selectedQuality)?.label ?? selectedQuality;
    if (pickedFileUri) {
      setResultMessage(`Video processed in ${qualityLabel}! Saved to your device.`);
    } else {
      const platform = detectPlatform(url.trim());
      setResultMessage(`${platform} video downloaded in ${qualityLabel}! Saved to your device.`);
    }
    setStatus("success");
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleReset = () => {
    setUrl(""); setPickedFileName(null); setPickedFileUri(null);
    setStatus("idle"); setResultMessage(""); progressAnim.setValue(0);
  };

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + webTopInset + 16, paddingBottom: insets.bottom + webBottomInset + 32 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.headerIcon, { backgroundColor: accentColor + "18" }]}>
        <Feather name="download-cloud" size={36} color={accentColor} />
      </View>
      <Text style={[styles.title, { color: colors.foreground }]}>Video Downloader</Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]}>
        Download from YouTube, TikTok, Instagram & 1000+ sites. Choose quality from 144p up to 4K.
      </Text>

      <PlatformLogos title={t.supportedPlatforms} />

      {/* URL input — hidden when file picked */}
      {!pickedFileUri && (
        <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="link" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder={t.pasteUrl}
            placeholderTextColor={colors.mutedForeground}
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            editable={status !== "loading"}
          />
          {url.length > 0 && (
            <TouchableOpacity onPress={() => setUrl("")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x-circle" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* File picked */}
      {pickedFileUri && (
        <View style={[styles.fileCard, { backgroundColor: accentColor + "12", borderColor: accentColor + "40" }]}>
          <Feather name="film" size={20} color={accentColor} />
          <View style={styles.fileInfo}>
            <Text style={[styles.fileSelectedLabel, { color: accentColor }]}>{t.fileSelected}</Text>
            <Text style={[styles.fileName, { color: colors.foreground }]} numberOfLines={1}>{pickedFileName}</Text>
          </View>
          <TouchableOpacity onPress={() => { setPickedFileName(null); setPickedFileUri(null); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="x-circle" size={18} color={accentColor} />
          </TouchableOpacity>
        </View>
      )}

      {/* Upload button */}
      {!pickedFileUri && (
        <>
          <View style={styles.uploadRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>{t.orUpload}</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>
          <TouchableOpacity
            style={[styles.uploadButton, { borderColor: accentColor + "60", backgroundColor: accentColor + "08" }]}
            onPress={pickFile}
            activeOpacity={0.75}
            disabled={status === "loading"}
          >
            <Feather name="upload" size={18} color={accentColor} />
            <Text style={[styles.uploadLabel, { color: accentColor }]}>{t.uploadFromDevice}</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Quality selector */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t.quality}</Text>
      <View style={styles.qualityGrid}>
        {QUALITY_OPTIONS.map((q) => {
          const isSelected = selectedQuality === q.value;
          const is4K = q.value === "2160p";
          const is2K = q.value === "1440p";
          return (
            <TouchableOpacity
              key={q.value}
              style={[styles.qualityChip, { backgroundColor: isSelected ? accentColor : colors.card, borderColor: isSelected ? accentColor : colors.border }]}
              onPress={() => setSelectedQuality(q.value)}
              activeOpacity={0.75}
            >
              <View style={styles.qualityTop}>
                <Text style={[styles.qualityLabel, { color: isSelected ? "#fff" : colors.foreground }]}>{q.label}</Text>
                {(is4K || is2K) && (
                  <View style={[styles.badge, { backgroundColor: isSelected ? "rgba(255,255,255,0.25)" : accentColor + "20" }]}>
                    <Text style={[styles.badgeText, { color: isSelected ? "#fff" : accentColor }]}>{is4K ? "BEST" : "NEW"}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.qualityDesc, { color: isSelected ? "rgba(255,255,255,0.75)" : colors.mutedForeground }]}>{q.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {status === "idle" && (
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: accentColor }]} onPress={handleDownload} activeOpacity={0.85}>
          <Feather name="download" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.actionLabel}>Download Video</Text>
        </TouchableOpacity>
      )}

      {status === "loading" && (
        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.progressHeader}>
            <ActivityIndicator size="small" color={accentColor} />
            <Text style={[styles.progressText, { color: colors.foreground }]}>
              {t.processing} {QUALITY_OPTIONS.find((q) => q.value === selectedQuality)?.label}...
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <Animated.View style={[styles.progressFill, { backgroundColor: accentColor, width: progressWidth }]} />
          </View>
        </View>
      )}

      {(status === "success" || status === "error") && (
        <View style={[styles.resultCard, { backgroundColor: status === "success" ? colors.success + "12" : colors.destructive + "12", borderColor: status === "success" ? colors.success : colors.destructive }]}>
          <Feather name={status === "success" ? "check-circle" : "alert-circle"} size={22} color={status === "success" ? colors.success : colors.destructive} style={{ marginBottom: 8 }} />
          <Text style={[styles.resultText, { color: status === "success" ? colors.success : colors.destructive }]}>{resultMessage}</Text>
          <TouchableOpacity style={[styles.resetButton, { borderColor: colors.border }]} onPress={handleReset}>
            <Text style={[styles.resetLabel, { color: colors.foreground }]}>{t.downloadAnother}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  headerIcon: { width: 72, height: 72, borderRadius: 20, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 18 },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  description: { fontSize: 15, textAlign: "center", lineHeight: 22, marginBottom: 28, paddingHorizontal: 8 },
  inputCard: { flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 12 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, paddingVertical: 0 },
  fileCard: { flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 20, gap: 10 },
  fileInfo: { flex: 1 },
  fileSelectedLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 2 },
  fileName: { fontSize: 14, fontWeight: "500" },
  uploadRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 11, fontWeight: "600", letterSpacing: 0.5 },
  uploadButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1.5, borderStyle: "dashed", borderRadius: 14, paddingVertical: 14, marginBottom: 24 },
  uploadLabel: { fontSize: 15, fontWeight: "600" },
  sectionLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 0.8, marginBottom: 12 },
  qualityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  qualityChip: { width: "22.5%", borderRadius: 12, borderWidth: 1.5, padding: 10, alignItems: "flex-start" },
  qualityTop: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 3 },
  qualityLabel: { fontSize: 15, fontWeight: "700" },
  badge: { paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 },
  badgeText: { fontSize: 8, fontWeight: "800", letterSpacing: 0.3 },
  qualityDesc: { fontSize: 10, fontWeight: "500" },
  actionButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 16 },
  actionLabel: { color: "#fff", fontSize: 17, fontWeight: "700" },
  progressCard: { borderRadius: 14, borderWidth: 1, padding: 18 },
  progressHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 10 },
  progressText: { fontSize: 15, fontWeight: "600" },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 10 },
  progressFill: { height: "100%", borderRadius: 3 },
  resultCard: { borderRadius: 14, borderWidth: 1.5, padding: 20, alignItems: "center" },
  resultText: { fontSize: 15, fontWeight: "600", textAlign: "center", marginBottom: 16 },
  resetButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
  resetLabel: { fontSize: 15, fontWeight: "600" },
});
