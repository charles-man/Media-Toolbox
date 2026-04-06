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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

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
  onAction: (url: string, selectedFormat: string) => Promise<string>;
}

export function ToolScreen({
  title,
  accentColor,
  iconName,
  description,
  inputPlaceholder = "Paste URL here...",
  actionLabel,
  formats,
  extraControls,
  onAction,
}: ToolScreenProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [url, setUrl] = useState("");
  const [selectedFormat, setSelectedFormat] = useState(formats?.[0]?.value ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resultMessage, setResultMessage] = useState("");
  const progressAnim = useRef(new Animated.Value(0)).current;

  const simulateProgress = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2800,
      useNativeDriver: false,
    }).start();
  };

  const handleAction = async () => {
    if (!url.trim()) {
      Alert.alert("Missing URL", "Please paste a valid URL to continue.");
      return;
    }
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setStatus("loading");
    simulateProgress();
    try {
      const result = await onAction(url.trim(), selectedFormat);
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
    >
      <View style={[styles.headerIcon, { backgroundColor: accentColor + "18" }]}>
        <Feather name={iconName as any} size={36} color={accentColor} />
      </View>

      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]}>{description}</Text>

      <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="link" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: colors.foreground }]}
          placeholder={inputPlaceholder}
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

      {formats && formats.length > 0 && (
        <View style={styles.formatsContainer}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>FORMAT</Text>
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
                <Text
                  style={[
                    styles.formatLabel,
                    { color: selectedFormat === fmt.value ? "#fff" : colors.foreground },
                  ]}
                >
                  {fmt.label}
                </Text>
                {fmt.description && (
                  <Text
                    style={[
                      styles.formatDesc,
                      { color: selectedFormat === fmt.value ? "rgba(255,255,255,0.75)" : colors.mutedForeground },
                    ]}
                  >
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
            <Text style={[styles.progressText, { color: colors.foreground }]}>Processing...</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <Animated.View
              style={[styles.progressFill, { backgroundColor: accentColor, width: progressWidth }]}
            />
          </View>
          <Text style={[styles.progressHint, { color: colors.mutedForeground }]}>
            This is a demo — real downloads require backend integration
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
          <TouchableOpacity
            style={[styles.resetButton, { borderColor: colors.border }]}
            onPress={handleReset}
          >
            <Text style={[styles.resetLabel, { color: colors.foreground }]}>Try Again</Text>
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
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 20,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  formatsContainer: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  formatsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  formatChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
  },
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
  progressCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  progressText: { fontSize: 15, fontWeight: "600" },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: { height: "100%", borderRadius: 3 },
  progressHint: { fontSize: 12, textAlign: "center" },
  resultCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 20,
    alignItems: "center",
    marginTop: 4,
  },
  resultText: { fontSize: 15, fontWeight: "600", textAlign: "center", marginBottom: 16 },
  resetButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  resetLabel: { fontSize: 15, fontWeight: "600" },
});
