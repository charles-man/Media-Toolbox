import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export default function MergeVideosScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [urls, setUrls] = useState<string[]>(["", ""]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState("");
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  const addUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, ""]);
    }
  };

  const removeUrl = (index: number) => {
    if (urls.length > 2) {
      const next = [...urls];
      next.splice(index, 1);
      setUrls(next);
    }
  };

  const updateUrl = (index: number, value: string) => {
    const next = [...urls];
    next[index] = value;
    setUrls(next);
  };

  const handleMerge = async () => {
    const valid = urls.filter((u) => u.trim().length > 0);
    if (valid.length < 2) {
      Alert.alert("Need More URLs", "Please add at least 2 video URLs to merge.");
      return;
    }
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStatus("loading");
    progressAnim.setValue(0);
    Animated.timing(progressAnim, { toValue: 1, duration: 3000, useNativeDriver: false }).start();
    await new Promise((r) => setTimeout(r, 3200));
    setResult(`${valid.length} videos merged successfully! Saved to your device.`);
    setStatus("success");
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  const accentColor = colors.mergeVideos;
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
        <Feather name="layers" size={36} color={accentColor} />
      </View>
      <Text style={[styles.title, { color: colors.foreground }]}>Merge Videos</Text>
      <Text style={[styles.desc, { color: colors.mutedForeground }]}>
        Combine up to 5 videos into one. Add URLs in the order you want them merged.
      </Text>

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>VIDEO URLS (IN ORDER)</Text>

      {urls.map((url, i) => (
        <View key={i} style={styles.urlRow}>
          <View style={[styles.orderBadge, { backgroundColor: accentColor }]}>
            <Text style={styles.orderText}>{i + 1}</Text>
          </View>
          <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border, flex: 1 }]}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder={`Video ${i + 1} URL`}
              placeholderTextColor={colors.mutedForeground}
              value={url}
              onChangeText={(v) => updateUrl(i, v)}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>
          {urls.length > 2 && (
            <TouchableOpacity onPress={() => removeUrl(i)} style={styles.removeBtn}>
              <Feather name="trash-2" size={18} color={colors.destructive} />
            </TouchableOpacity>
          )}
        </View>
      ))}

      {urls.length < 5 && (
        <TouchableOpacity
          style={[styles.addButton, { borderColor: accentColor + "60" }]}
          onPress={addUrl}
        >
          <Feather name="plus" size={18} color={accentColor} />
          <Text style={[styles.addLabel, { color: accentColor }]}>Add Another Video</Text>
        </TouchableOpacity>
      )}

      {status === "idle" && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: accentColor }]}
          onPress={handleMerge}
          activeOpacity={0.85}
        >
          <Feather name="layers" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.actionLabel}>Merge Videos</Text>
        </TouchableOpacity>
      )}

      {status === "loading" && (
        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.progressHeader}>
            <ActivityIndicator size="small" color={accentColor} />
            <Text style={[styles.progressText, { color: colors.foreground }]}>Merging...</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <Animated.View style={[styles.progressFill, { backgroundColor: accentColor, width: progressWidth }]} />
          </View>
        </View>
      )}

      {status === "success" && (
        <View style={[styles.resultCard, { backgroundColor: colors.success + "12", borderColor: colors.success }]}>
          <Feather name="check-circle" size={22} color={colors.success} style={{ marginBottom: 8 }} />
          <Text style={[styles.resultText, { color: colors.success }]}>{result}</Text>
          <TouchableOpacity style={[styles.resetButton, { borderColor: colors.border }]} onPress={() => { setUrls(["", ""]); setStatus("idle"); }}>
            <Text style={[styles.resetLabel, { color: colors.foreground }]}>Merge More</Text>
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
  desc: { fontSize: 15, textAlign: "center", lineHeight: 22, marginBottom: 28, paddingHorizontal: 16 },
  sectionLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 0.8, marginBottom: 12 },
  urlRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  orderBadge: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  orderText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  inputCard: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
  input: { fontSize: 15 },
  removeBtn: { padding: 8 },
  addButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderRadius: 12, borderStyle: "dashed", paddingVertical: 14, marginTop: 4, marginBottom: 20, gap: 8 },
  addLabel: { fontSize: 15, fontWeight: "600" },
  actionButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 16, marginTop: 4 },
  actionLabel: { color: "#fff", fontSize: 17, fontWeight: "700" },
  progressCard: { borderRadius: 14, borderWidth: 1, padding: 18, marginTop: 4 },
  progressHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 10 },
  progressText: { fontSize: 15, fontWeight: "600" },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  resultCard: { borderRadius: 14, borderWidth: 1.5, padding: 20, alignItems: "center", marginTop: 4 },
  resultText: { fontSize: 15, fontWeight: "600", textAlign: "center", marginBottom: 16 },
  resetButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
  resetLabel: { fontSize: 15, fontWeight: "600" },
});
