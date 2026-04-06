import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Platform {
  id: string;
  label: string;
  symbol: string;
  bg: string;
  fg: string;
  shape: "circle" | "rounded";
}

const PLATFORMS: Platform[] = [
  { id: "youtube", label: "YouTube", symbol: "▶", bg: "#FF0000", fg: "#FFFFFF", shape: "rounded" },
  { id: "tiktok", label: "TikTok", symbol: "♪", bg: "#000000", fg: "#FFFFFF", shape: "rounded" },
  { id: "instagram", label: "Instagram", symbol: "◉", bg: "#E1306C", fg: "#FFFFFF", shape: "rounded" },
  { id: "twitter", label: "Twitter", symbol: "𝕏", bg: "#000000", fg: "#FFFFFF", shape: "circle" },
  { id: "facebook", label: "Facebook", symbol: "f", bg: "#1877F2", fg: "#FFFFFF", shape: "circle" },
  { id: "pinterest", label: "Pinterest", symbol: "P", bg: "#E60023", fg: "#FFFFFF", shape: "circle" },
  { id: "telegram", label: "Telegram", symbol: "✈", bg: "#2AABEE", fg: "#FFFFFF", shape: "circle" },
  { id: "whatsapp", label: "WhatsApp", symbol: "✆", bg: "#25D366", fg: "#FFFFFF", shape: "circle" },
];

interface PlatformLogosProps {
  onSelect?: (platform: string) => void;
  selectedPlatform?: string;
  title?: string;
}

export function PlatformLogos({ onSelect, selectedPlatform, title = "SUPPORTED PLATFORMS" }: PlatformLogosProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {title ? (
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{title}</Text>
      ) : null}
      <View style={styles.grid}>
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatform === platform.id;
          return (
            <TouchableOpacity
              key={platform.id}
              style={styles.platformItem}
              onPress={() => onSelect?.(platform.id)}
              activeOpacity={onSelect ? 0.7 : 1}
            >
              <View
                style={[
                  styles.logoCircle,
                  {
                    backgroundColor: platform.bg,
                    borderRadius: platform.shape === "circle" ? 22 : 14,
                    borderWidth: isSelected ? 2.5 : 0,
                    borderColor: isSelected ? colors.primary : "transparent",
                  },
                ]}
              >
                <Text style={[styles.logoSymbol, { color: platform.fg }]}>{platform.symbol}</Text>
              </View>
              <Text style={[styles.platformLabel, { color: colors.mutedForeground }]}>{platform.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  platformItem: {
    width: "22%",
    alignItems: "center",
    gap: 5,
  },
  logoCircle: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  logoSymbol: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22,
  },
  platformLabel: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
});
