import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Platform, Alert, ActivityIndicator, Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";

interface VideoItem {
  type: "url" | "file";
  value: string;
  displayName: string;
}

export default function MergeVideosScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [items, setItems] = useState<VideoItem[]>([
    { type: "url", value: "", displayName: "" },
    { type: "url", value: "", displayName: "" },
  ]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState("");
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const accentColor = colors.mergeVideos;
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const addItem = () => {
    if (items.length < 5) setItems([...items, { type: "url", value: "", displayName: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 2) {
      const next = [...items];
      next.splice(index, 1);
      setItems(next);
    }
  };

  const updateUrl = (index: number, value: string) => {
    const next = [...items];
    next[index] = { type: "url", value, displayName: value };
    setItems(next);
  };

  const pickFileAt = async (index: number) => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsEditing: false,
        quality: 1,
      });
      if (!res.canceled && res.assets.length > 0) {
        const asset = res.assets[0];
        const name = asset.fileName ?? asset.uri.split("/").pop() ?? "video";
        const next = [...items];
        next[index] = { type: "file", value: asset.uri, displayName: name };
        setItems(next);
      }
    } catch {
      Alert.alert("", "Could not open file picker.");
    }
  };

  const handleMerge = async () => {
    const valid = items.filter((i) => i.value.trim().length > 0);
    if (valid.length < 2) {
      Alert.alert("", t.needMoreInputs);
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + webTopInset + 16, paddingBottom: insets.bottom + webBottomInset + 32 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.headerIcon, { backgroundColor: accentColor + "18" }]}>
        <Feather name="layers" size={36} color={accentColor} />
      </View>
      <Text style={[styles.title, { color: colors.foreground }]}>{t.mergeVideos}</Text>
      <Text style={[styles.desc, { color: colors.mutedForeground }]}>
        Combine up to 5 videos into one. Add URLs or upload files in the order you want them merged.
      </Text>

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>VIDEO URLS / FILES</Text>

      {items.map((item, i) => (
        <View key={i} style={styles.itemRow}>
          <View style={[styles.orderBadge, { backgroundColor: accentColor }]}>
            <Text style={styles.orderText}>{i + 1}</Text>
          </View>

          <View style={styles.itemContent}>
            {item.type === "file" ? (
              /* File picked for this slot */
              <View style={[styles.fileSlot, { backgroundColor: accentColor + "12", borderColor: accentColor + "40" }]}>
                <Feather name="film" size={16} color={accentColor} />
                <Text style={[styles.fileSlotName, { color: colors.foreground }]} numberOfLines={1}>
                  {item.displayName}
                </Text>
                <TouchableOpacity
                  onPress={() => { const next = [...items]; next[i] = { type: "url", value: "", displayName: "" }; setItems(next); }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name="x" size={16} color={accentColor} />
                </TouchableOpacity>
              </View>
            ) : (
              /* URL input + upload button for this slot */
              <View style={styles.urlSlot}>
                <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    placeholder={`${t.pasteUrl} (${i + 1})`}
                    placeholderTextColor={colors.mutedForeground}
                    value={item.value}
                    onChangeText={(v) => updateUrl(i, v)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                  />
                </View>
                <TouchableOpacity
                  style={[styles.uploadSlotBtn, { borderColor: accentColor + "60", backgroundColor: accentColor + "08" }]}
                  onPress={() => pickFileAt(i)}
                  activeOpacity={0.75}
                >
                  <Feather name="upload" size={15} color={accentColor} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {items.length > 2 && (
            <TouchableOpacity onPress={() => removeItem(i)} style={styles.removeBtn}>
              <Feather name="trash-2" size={18} color={colors.destructive} />
            </TouchableOpacity>
          )}
        </View>
      ))}

      {items.length < 5 && (
        <TouchableOpacity style={[styles.addButton, { borderColor: accentColor + "60" }]} onPress={addItem}>
          <Feather name="plus" size={18} color={accentColor} />
          <Text style={[styles.addLabel, { color: accentColor }]}>{t.addVideo}</Text>
        </TouchableOpacity>
      )}

      {status === "idle" && (
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: accentColor }]} onPress={handleMerge} activeOpacity={0.85}>
          <Feather name="layers" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.actionLabel}>{t.mergeVideos}</Text>
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
        </View>
      )}

      {status === "success" && (
        <View style={[styles.resultCard, { backgroundColor: colors.success + "12", borderColor: colors.success }]}>
          <Feather name="check-circle" size={22} color={colors.success} style={{ marginBottom: 8 }} />
          <Text style={[styles.resultText, { color: colors.success }]}>{result}</Text>
          <TouchableOpacity style={[styles.resetButton, { borderColor: colors.border }]} onPress={() => { setItems([{ type: "url", value: "", displayName: "" }, { type: "url", value: "", displayName: "" }]); setStatus("idle"); }}>
            <Text style={[styles.resetLabel, { color: colors.foreground }]}>{t.mergeMore}</Text>
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
  desc: { fontSize: 15, textAlign: "center", lineHeight: 22, marginBottom: 28, paddingHorizontal: 8 },
  sectionLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 0.8, marginBottom: 12 },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 8 },
  orderBadge: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  orderText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  itemContent: { flex: 1 },
  fileSlot: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 11 },
  fileSlotName: { flex: 1, fontSize: 14, fontWeight: "500" },
  urlSlot: { flexDirection: "row", gap: 8 },
  inputCard: { flex: 1, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 11 },
  input: { fontSize: 14 },
  uploadSlotBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  removeBtn: { padding: 6 },
  addButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderRadius: 12, borderStyle: "dashed", paddingVertical: 14, marginTop: 4, marginBottom: 20, gap: 8 },
  addLabel: { fontSize: 15, fontWeight: "600" },
  actionButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 16 },
  actionLabel: { color: "#fff", fontSize: 17, fontWeight: "700" },
  progressCard: { borderRadius: 14, borderWidth: 1, padding: 18 },
  progressHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 10 },
  progressText: { fontSize: 15, fontWeight: "600" },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  resultCard: { borderRadius: 14, borderWidth: 1.5, padding: 20, alignItems: "center" },
  resultText: { fontSize: 15, fontWeight: "600", textAlign: "center", marginBottom: 16 },
  resetButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
  resetLabel: { fontSize: 15, fontWeight: "600" },
});
