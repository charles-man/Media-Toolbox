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
import { useLanguage } from "@/contexts/LanguageContext";
import { ToolCard } from "@/components/ToolCard";
import { PlatformLogos } from "@/components/PlatformLogos";
import { LanguagePicker } from "@/components/LanguagePicker";

const TOOL_DEFS = [
  { id: "video-downloader",    iconName: "download-cloud", colorKey: "videoDownloader" as const, route: "/video-downloader" },
  { id: "audio-extractor",     iconName: "music",          colorKey: "audioExtractor" as const,  route: "/audio-extractor"  },
  { id: "video-converter",     iconName: "refresh-cw",     colorKey: "videoConverter" as const,  route: "/video-converter"  },
  { id: "video-cutter",        iconName: "scissors",       colorKey: "videoCutter" as const,     route: "/video-cutter"     },
  { id: "video-compressor",    iconName: "minimize-2",     colorKey: "videoCompressor" as const, route: "/video-compressor" },
  { id: "merge-videos",        iconName: "layers",         colorKey: "mergeVideos" as const,     route: "/merge-videos"     },
  { id: "add-subtitles",       iconName: "type",           colorKey: "addSubtitles" as const,    route: "/add-subtitles"    },
  { id: "thumbnail-downloader",iconName: "image",          colorKey: "thumbnailDownloader" as const, route: "/thumbnail-downloader" },
];

const TOOL_LABELS: Record<string, { en: string; fr: string; es: string; hi: string; ar: string }> = {
  "video-downloader":     { en: "Video Downloader",    fr: "Téléchargeur Vidéo",  es: "Descargador de Video",  hi: "वीडियो डाउनलोडर",      ar: "تنزيل الفيديو"     },
  "audio-extractor":      { en: "Audio Extractor",     fr: "Extracteur Audio",    es: "Extractor de Audio",    hi: "ऑडियो एक्सट्रैक्टर",   ar: "استخراج الصوت"     },
  "video-converter":      { en: "Video Converter",     fr: "Convertisseur Vidéo", es: "Conversor de Video",    hi: "वीडियो कन्वर्टर",       ar: "تحويل الفيديو"     },
  "video-cutter":         { en: "Video Cutter",        fr: "Coupe-Vidéo",         es: "Cortador de Video",     hi: "वीडियो कटर",           ar: "قص الفيديو"        },
  "video-compressor":     { en: "Video Compressor",    fr: "Compresseur Vidéo",   es: "Compresor de Video",    hi: "वीडियो कंप्रेसर",       ar: "ضغط الفيديو"       },
  "merge-videos":         { en: "Merge Videos",        fr: "Fusionner Vidéos",    es: "Combinar Videos",       hi: "वीडियो मर्ज करें",      ar: "دمج الفيديوهات"    },
  "add-subtitles":        { en: "Add Subtitles",       fr: "Ajouter Sous-titres", es: "Agregar Subtítulos",    hi: "उपशीर्षक जोड़ें",       ar: "إضافة ترجمة"       },
  "thumbnail-downloader": { en: "Thumbnail Downloader",fr: "Télécharger Miniature",es: "Descargar Miniatura",  hi: "थंबनेल डाउनलोडर",      ar: "تنزيل الصورة المصغرة" },
};

const TOOL_SUBS: Record<string, { en: string; fr: string; es: string; hi: string; ar: string }> = {
  "video-downloader":     { en: "YouTube, TikTok, Instagram & more", fr: "YouTube, TikTok, Instagram et plus", es: "YouTube, TikTok, Instagram y más", hi: "YouTube, TikTok, Instagram और अधिक", ar: "يوتيوب وتيك توك وإنستغرام والمزيد" },
  "audio-extractor":      { en: "Extract MP3 audio from any video",  fr: "Extraire l'audio MP3 de n'importe quelle vidéo", es: "Extraer audio MP3 de cualquier video", hi: "किसी भी वीडियो से MP3 ऑडियो निकालें", ar: "استخراج صوت MP3 من أي فيديو" },
  "video-converter":      { en: "Convert between MP3, MP4 and more", fr: "Convertir entre MP3, MP4 et plus", es: "Convertir entre MP3, MP4 y más", hi: "MP3, MP4 के बीच कन्वर्ट करें", ar: "التحويل بين MP3 وMP4 والمزيد" },
  "video-cutter":         { en: "Trim start and end of your video",  fr: "Couper le début et la fin de votre vidéo", es: "Recortar el inicio y el final del video", hi: "वीडियो की शुरुआत और अंत ट्रिम करें", ar: "قص بداية ونهاية الفيديو" },
  "video-compressor":     { en: "Reduce video file size easily",     fr: "Réduire facilement la taille du fichier", es: "Reducir el tamaño del archivo fácilmente", hi: "वीडियो फ़ाइल का आकार आसानी से कम करें", ar: "تقليل حجم ملف الفيديو بسهولة" },
  "merge-videos":         { en: "Combine multiple videos into one",  fr: "Combiner plusieurs vidéos en une seule", es: "Combinar múltiples videos en uno", hi: "कई वीडियो को एक में मिलाएं", ar: "دمج عدة فيديوهات في واحد" },
  "add-subtitles":        { en: "Embed subtitles into your video",   fr: "Intégrer des sous-titres dans votre vidéo", es: "Incrustar subtítulos en tu video", hi: "अपने वीडियो में उपशीर्षक जोड़ें", ar: "تضمين ترجمة في الفيديو" },
  "thumbnail-downloader": { en: "Save video thumbnails in HD",       fr: "Enregistrer les miniatures en HD", es: "Guardar miniaturas en HD", hi: "HD में वीडियो थंबनेल सेव करें", ar: "حفظ الصور المصغرة بجودة عالية" },
};

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lang, t } = useLanguage();

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
          <Text style={[styles.appTagline, { color: colors.mutedForeground }]}>{t.appTagline}</Text>
        </View>
        <View style={[styles.logoCircle, { backgroundColor: colors.primary + "18" }]}>
          <Text style={[styles.logoLetter, { color: colors.primary }]}>D</Text>
        </View>
      </View>

      <LanguagePicker />

      <View style={[styles.banner, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
        <Text style={[styles.bannerTitle, { color: colors.primary }]}>{t.bannerTitle}</Text>
        <Text style={[styles.bannerDesc, { color: colors.mutedForeground }]}>{t.bannerDesc}</Text>
      </View>

      <PlatformLogos title={t.downloadFrom} />

      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{t.tools}</Text>

      {TOOL_DEFS.map((tool) => (
        <ToolCard
          key={tool.id}
          title={TOOL_LABELS[tool.id]?.[lang] ?? TOOL_LABELS[tool.id]?.en ?? tool.id}
          subtitle={TOOL_SUBS[tool.id]?.[lang] ?? TOOL_SUBS[tool.id]?.en ?? ""}
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
    marginBottom: 20,
  },
  appName: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  appTagline: { fontSize: 13, marginTop: 3 },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: { fontSize: 26, fontWeight: "900" },
  banner: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 22 },
  bannerTitle: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  bannerDesc: { fontSize: 13, lineHeight: 19 },
  sectionTitle: { fontSize: 12, fontWeight: "600", letterSpacing: 0.8, marginBottom: 12 },
});
