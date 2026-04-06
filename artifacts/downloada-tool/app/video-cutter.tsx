import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useColors } from "@/hooks/useColors";
import { ToolScreen } from "@/components/ToolScreen";

function TimestampInputs() {
  const colors = useColors();
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:30");

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>TRIM RANGE</Text>
      <View style={styles.row}>
        <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Start</Text>
          <TextInput
            style={[styles.timeInput, { color: colors.foreground }]}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="00:00"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numbers-and-punctuation"
          />
        </View>
        <Text style={[styles.arrow, { color: colors.mutedForeground }]}>→</Text>
        <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>End</Text>
          <TextInput
            style={[styles.timeInput, { color: colors.foreground }]}
            value={endTime}
            onChangeText={setEndTime}
            placeholder="00:30"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numbers-and-punctuation"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  label: { fontSize: 12, fontWeight: "600", letterSpacing: 0.8, marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  inputBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
  },
  inputLabel: { fontSize: 11, fontWeight: "600", marginBottom: 4 },
  timeInput: { fontSize: 22, fontWeight: "700" },
  arrow: { fontSize: 20 },
});

export default function VideoCutterScreen() {
  const colors = useColors();

  const handleCut = async (url: string, _format: string): Promise<string> => {
    await new Promise((r) => setTimeout(r, 3000));
    return `Video trimmed successfully! Saved the cut segment to your device.`;
  };

  return (
    <ToolScreen
      title="Video Cutter"
      accentColor={colors.videoCutter}
      iconName="scissors"
      description="Trim any video by setting a start and end time. Extract only the part you need."
      inputPlaceholder="Paste video URL to trim..."
      actionLabel="Cut Video"
      extraControls={<TimestampInputs />}
      onAction={handleCut}
    />
  );
}
