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

export default function VideoCutterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [url, setUrl] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:30");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resultMessage, setResultMessage] = useState("");
  const progressAnim = useRef(new Animated.Value(0)).current;

  const accentColor = colors.videoCutter;
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const simulateProgress = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2800,
      useNativeDriver: false,
    }).start();
  };

  const handleCut = async () => {
    if (!url.trim()) {
      Alert.alert("Missing URL", "Please paste a video URL to trim.");
      return;
    }
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setStatus("loading");
    simulateProgress();
    await new Promise((r) => setTimeout(r, 3000));
    setResultMessage(
      `Video trimmed from ${startTime} to ${endTime} successfully! Saved to your device.`
    );
    setStatus("success");
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleReset = () => {
    setUrl("");
    setStartTime("00:00");
    setEndTime("00:30");
    setStatus("idle");
    setResultMessage("");
    progressAnim.setValue(0);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

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
      {/* Header */}
      <View style={[styles.headerIcon, { backgroundColor: accentColor + "18" }]}>
        <Feather name="scissors" size={36} color={accentColor} />
      </View>
      <Text style={[styles.title, { color: colors.foreground }]}>Video Cutter</Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]}>
        Trim any video by setting a start and end time. Extract only the segment you need.
      </Text>

      {/* URL Input */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>VIDEO URL</Text>
      <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="link" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
        <TextInput
          style={[styles.urlInput, { color: colors.foreground }]}
          placeholder="Paste video URL to trim..."
          placeholderTextColor={colors.mutedForeground}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          editable={status !== "loading"}
        />
        {url.length > 0 && (
          <TouchableOpacity
            onPress={() => setUrl("")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x-circle" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* Trim Range — fixed-height, stable layout */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>TRIM RANGE</Text>
      <View style={styles.trimRow}>
        {/* Start */}
        <View
          style={[
            styles.timeBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.timeBoxLabel, { color: colors.mutedForeground }]}>Start</Text>
          <TextInput
            style={[styles.timeInput, { color: colors.foreground }]}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="00:00"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numbers-and-punctuation"
            maxLength={8}
            textAlign="center"
            editable={status !== "loading"}
          />
          <Text style={[styles.timeFormat, { color: colors.mutedForeground }]}>hh:mm:ss</Text>
        </View>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <View style={[styles.arrowLine, { backgroundColor: accentColor + "40" }]} />
          <View style={[styles.arrowCircle, { backgroundColor: accentColor + "18" }]}>
            <Feather name="arrow-right" size={16} color={accentColor} />
          </View>
          <View style={[styles.arrowLine, { backgroundColor: accentColor + "40" }]} />
        </View>

        {/* End */}
        <View
          style={[
            styles.timeBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.timeBoxLabel, { color: colors.mutedForeground }]}>End</Text>
          <TextInput
            style={[styles.timeInput, { color: colors.foreground }]}
            value={endTime}
            onChangeText={setEndTime}
            placeholder="00:30"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numbers-and-punctuation"
            maxLength={8}
            textAlign="center"
            editable={status !== "loading"}
          />
          <Text style={[styles.timeFormat, { color: colors.mutedForeground }]}>hh:mm:ss</Text>
        </View>
      </View>

      {/* Duration summary */}
      <View style={[styles.durationBar, { backgroundColor: colors.muted }]}>
        <Feather name="clock" size={14} color={colors.mutedForeground} />
        <Text style={[styles.durationText, { color: colors.mutedForeground }]}>
          Segment: {startTime} → {endTime}
        </Text>
      </View>

      {/* Action */}
      {status === "idle" && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: accentColor }]}
          onPress={handleCut}
          activeOpacity={0.85}
        >
          <Feather name="scissors" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.actionLabel}>Cut Video</Text>
        </TouchableOpacity>
      )}

      {status === "loading" && (
        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.progressHeader}>
            <ActivityIndicator size="small" color={accentColor} />
            <Text style={[styles.progressText, { color: colors.foreground }]}>
              Trimming {startTime} → {endTime}...
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <Animated.View
              style={[styles.progressFill, { backgroundColor: accentColor, width: progressWidth }]}
            />
          </View>
          <Text style={[styles.progressHint, { color: colors.mutedForeground }]}>
            This is a demo — real trimming requires backend integration
          </Text>
        </View>
      )}

      {(status === "success" || status === "error") && (
        <View
          style={[
            styles.resultCard,
            {
              backgroundColor:
                status === "success" ? colors.success + "12" : colors.destructive + "12",
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
          <Text
            style={[
              styles.resultText,
              { color: status === "success" ? colors.success : colors.destructive },
            ]}
          >
            {resultMessage}
          </Text>
          <TouchableOpacity
            style={[styles.resetButton, { borderColor: colors.border }]}
            onPress={handleReset}
          >
            <Text style={[styles.resetLabel, { color: colors.foreground }]}>Cut Another</Text>
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
    paddingHorizontal: 8,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 24,
  },
  inputIcon: { marginRight: 10 },
  urlInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },

  /* Trim row — three columns: timeBox | arrowContainer | timeBox */
  trimRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  timeBox: {
    flex: 1,
    height: 96,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  timeBoxLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  timeInput: {
    fontSize: 24,
    fontWeight: "700",
    width: "100%",
    textAlign: "center",
    paddingVertical: 0,
    /* Fixed line-height prevents vertical jump on focus */
    lineHeight: 30,
    height: 30,
  },
  timeFormat: {
    fontSize: 10,
    marginTop: 6,
    letterSpacing: 0.3,
  },

  arrowContainer: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  arrowLine: {
    width: 1,
    height: 16,
    borderRadius: 1,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  durationBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 24,
  },
  durationText: {
    fontSize: 13,
    fontWeight: "500",
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 16,
  },
  actionLabel: { color: "#fff", fontSize: 17, fontWeight: "700" },

  progressCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
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
  },
  resultText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  resetButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  resetLabel: { fontSize: 15, fontWeight: "600" },
});
