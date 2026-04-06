import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useLanguage, LANGUAGE_META, LangCode } from "@/contexts/LanguageContext";

export function LanguagePicker() {
  const colors = useColors();
  const { lang, t, setLang } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{t.language}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {LANGUAGE_META.map((item) => {
          const isSelected = lang === item.code;
          return (
            <TouchableOpacity
              key={item.code}
              style={[
                styles.pill,
                {
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setLang(item.code as LangCode)}
              activeOpacity={0.75}
            >
              <Text style={[styles.flag, { color: isSelected ? "#fff" : colors.mutedForeground }]}>
                {item.flag}
              </Text>
              <Text style={[styles.pillLabel, { color: isSelected ? "#fff" : colors.foreground }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 2,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  flag: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
});
