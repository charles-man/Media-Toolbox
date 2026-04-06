import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";

interface Format {
  label: string;
  value: string;
  description?: string;
}

interface ToolScreenProps {
  title: string;
  accentColor: string;
  iconName: string;
  description: string;
  inputPlaceholder?: string;
  actionLabel: string;
  formats?: Format[];
  extraControls?: React.ReactNode;
  onAction: (input: string, selectedFormat: string) => Promise<string>;
}

export function ToolScreen({
  title,
  accentColor,
  iconName,
  description,
  inputPlaceholder,
  actionLabel,
  formats,
  extraControls,
  onAction,
}: ToolScreenProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  const [url, setUrl] = useState("");
  const [pickedFileName, setPickedFileName] = useState<string | null>(null);
  const [pickedFileUri, setPickedFileUri] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState(formats?.[0]?.value ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resultMessage, setResultMessage] = useState("");
  const progressAnim = useRef(new Animated.Value(0)).current;

  const resolvedPlaceholder = inputPlaceholder ?? t.pasteUrl;

  const simulateProgress = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2800,
      useNativeDriver: false,
    }).start();
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
        const name = asset.fileName ?? asset.uri.split("/").pop() ?? "video file";
        setPickedFileName(name);
        setPickedFileUri(asset.uri);
        setUrl("");
      }
    } catch {
      Alert.alert("Upload failed", "Could not open the file picker. Please try pasting a URL instead.");
    }
  };

  const clearFile = () => {
    setPickedFileName(null);
    setPickedFileUri(null);
  };

  const handleAction = async () => {
    const input = pickedFileUri ?? url.trim();
    if (!input) {
      Alert.alert("", t.missingInput);
      return;
    }
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setStatus("loading");
    simulateProgress();
    try {
      const result = await onAction(input, selectedFormat);
      setResultMessage(result);
      setStatus("success");
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err: any) {
      setResultMessage(err?.message ?? "Something went wrong. Please try again.");
      setStatus("error");
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const handleReset = () => {
    setUrl("");
    setPickedFileName(null);
    setPickedFileUri(null);
    setStatus("idle");
    setResultMessage("");
    progressAnim.setValue(0);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + webTopInset + 16,
          paddingBottom: insets.bottom + webBottomInset + 32,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.headerIcon, { backgroundColor: accentColor + "18" }]}>
        <Feather name={iconName as any} size={36} color={accentColor} />
      </View>

      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]}>{description}</Text>

      {/* URL input — hidden when a file is picked */}
      {!pickedFileUri && (
        <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="link" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder={resolvedPlaceholder}
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

      {/* File picked display */}
      {pickedFileUri && (
        <View style={[styles.fileCard, { backgroundColor: accentColor + "12", borderColor: accentColor + "40" }]}>
          <Feather name="film" size={20} color={accentColor} />
          <View style={styles.fileInfo}>
            <Text style={[styles.fileSelectedLabel, { color: accentColor }]}>{t.fileSelected}</Text>
            <Text style={[styles.fileName, { color: colors.foreground }]} numberOfLines={1}>
              {pickedFileName}
            </Text>
          </View>
          <TouchableOpacity onPress={clearFile} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="x-circle" size={18} color={accentColor} />
          </TouchableOpacity>
        </View>
      )}

      {/* Divider + upload button */}
      {!pickedFileUri && (
        <View style={styles.uploadRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>{t.orUpload}</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>
      )}

      {!pickedFileUri && (
        <TouchableOpacity
          style={[styles.uploadButton, { borderColor: accentColor + "60", backgroundColor: accentColor + "08" }]}
          onPress={pickFile}
          activeOpacity={0.75}
          disabled={status === "loading"}
        >
          <Feather name="upload" size={18} color={accentColor} />
          <Text style={[styles.uploadLabel, { color: accentColor }]}>{t.uploadFromDevice}</Text>
        </TouchableOpacity>
      )}

      {/* Formats */}
      {formats && formats.length > 0 && (
        <View style={styles.formatsContainer}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t.format}</Text>
          <View style={styles.formatsRow}>
            {formats.map((fmt) => (
              <TouchableOpacity
                key={fmt.value}
                style={[
                  styles.formatChip,
                  {
                    backgroundColor: selectedFormat === fmt.value ? accentColor : colors.card,
                    borderColor: selectedFormat === fmt.value ? accentColor : colors.border,
                  },
                ]}
                onPress={() => setSelectedFormat(fmt.value)}
              >
                <Text style={[styles.formatLabel, { color: selectedFormat === fmt.value ? "#fff" : colors.foreground }]}>
                  {fmt.label}
                </Text>
                {fmt.description && (
                  <Text style={[styles.formatDesc, { color: selectedFormat === fmt.value ? "rgba(255,255,255,0.75)" : colors.mutedForeground }]}>
                    {fmt.description}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {extraControls}

      {status === "idle" && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: accentColor }]}
          onPress={handleAction}
          activeOpacity={0.85}
        >
          <Feather name="download" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      )}

      {status === "loading" && (
        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.progressHeader}>
            <ActivityIndicator size="small" color={accentColor} />
            <Text style={[styles.progressText, { color: colors.foreground }]}>{t.processing}</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <Animated.View style={[styles.progressFill, { backgroundColor: accentColor, width: progressWidth }]} />
          </View>
          <Text style={[styles.progressHint, { color: colors.mutedForeground }]}>
            This is a demo — real processing requires backend integration
          </Text>
        </View>
      )}

      {(status === "success" || status === "error") && (
        <View
          style={[
            styles.resultCard,
            {
              backgroundColor: status === "success" ? colors.success + "12" : colors.destructive + "12",
              borderColor: status === "success" ? colors.success : colors.destructive,
            },
          ]}
        >
          <Feather
            name={status === "success" ? "check-circle" : "alert-circle"}
            size={22}
            color={status === "success" ? colors.success : colors.destructive}
            style={{ marginBottom: 8 }}
          />
          <Text style={[styles.resultText, { color: status === "success" ? colors.success : colors.destructive }]}>
            {resultMessage}
          </Text>
          <TouchableOpacity style={[styles.resetButton, { borderColor: colors.border }]} onPress={handleReset}>
            <Text style={[styles.resetLabel, { color: colors.foreground }]}>{t.tryAgain}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18,
  },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  description: { fontSize: 15, textAlign: "center", lineHeight: 22, marginBottom: 28, paddingHorizontal: 16 },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, paddingVertical: 0 },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 20,
    gap: 10,
  },
  fileInfo: { flex: 1 },
  fileSelectedLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 2 },
  fileName: { fontSize: 14, fontWeight: "500" },
  uploadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 11, fontWeight: "600", letterSpacing: 0.5 },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 24,
  },
  uploadLabel: { fontSize: 15, fontWeight: "600" },
  formatsContainer: { marginBottom: 24 },
  sectionLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 0.8, marginBottom: 10 },
  formatsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  formatChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, alignItems: "center" },
  formatLabel: { fontSize: 14, fontWeight: "600" },
  formatDesc: { fontSize: 11, marginTop: 1 },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 4,
  },
  actionLabel: { color: "#fff", fontSize: 17, fontWeight: "700" },
  progressCard: { borderRadius: 14, borderWidth: 1, padding: 18, marginTop: 4 },
  progressHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 10 },
  progressText: { fontSize: 15, fontWeight: "600" },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 10 },
  progressFill: { height: "100%", borderRadius: 3 },
  progressHint: { fontSize: 12, textAlign: "center" },
  resultCard: { borderRadius: 14, borderWidth: 1.5, padding: 20, alignItems: "center", marginTop: 4 },
  resultText: { fontSize: 15, fontWeight: "600", textAlign: "center", marginBottom: 16 },
  resetButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
  resetLabel: { fontSize: 15, fontWeight: "600" },
});
