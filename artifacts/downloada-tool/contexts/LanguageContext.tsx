import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type LangCode = "en" | "fr" | "es" | "hi" | "ar";

export interface Strings {
  appTagline: string;
  bannerTitle: string;
  bannerDesc: string;
  downloadFrom: string;
  tools: string;
  pasteUrl: string;
  uploadFromDevice: string;
  orUpload: string;
  processing: string;
  tryAgain: string;
  format: string;
  language: string;
  videoUrl: string;
  trimRange: string;
  cutVideo: string;
  mergeVideos: string;
  addVideo: string;
  needMoreInputs: string;
  missingInput: string;
  segment: string;
  cutAnother: string;
  mergeMore: string;
  fileSelected: string;
  quality: string;
  supportedPlatforms: string;
  downloadAnother: string;
}

const TRANSLATIONS: Record<LangCode, Strings> = {
  en: {
    appTagline: "All-in-one video & audio toolkit",
    bannerTitle: "8 Powerful Tools",
    bannerDesc: "Download, convert, trim, compress and more — 144p to 4K",
    downloadFrom: "DOWNLOAD FROM",
    tools: "TOOLS",
    pasteUrl: "Paste URL here...",
    uploadFromDevice: "Upload from device",
    orUpload: "OR UPLOAD FROM DEVICE",
    processing: "Processing...",
    tryAgain: "Try Again",
    format: "FORMAT",
    language: "LANGUAGE",
    videoUrl: "VIDEO URL",
    trimRange: "TRIM RANGE",
    cutVideo: "Cut Video",
    mergeVideos: "Merge Videos",
    addVideo: "Add Another Video",
    needMoreInputs: "Please add at least 2 video URLs or files to merge.",
    missingInput: "Please paste a URL or upload a file to continue.",
    segment: "Segment",
    cutAnother: "Cut Another",
    mergeMore: "Merge More",
    fileSelected: "File selected",
    quality: "DOWNLOAD QUALITY",
    supportedPlatforms: "SUPPORTED PLATFORMS",
    downloadAnother: "Download Another",
  },
  fr: {
    appTagline: "Boîte à outils vidéo & audio tout-en-un",
    bannerTitle: "8 Outils Puissants",
    bannerDesc: "Télécharger, convertir, couper, compresser et plus — 144p à 4K",
    downloadFrom: "TÉLÉCHARGER DEPUIS",
    tools: "OUTILS",
    pasteUrl: "Coller l'URL ici...",
    uploadFromDevice: "Importer depuis l'appareil",
    orUpload: "OU IMPORTER DEPUIS L'APPAREIL",
    processing: "Traitement en cours...",
    tryAgain: "Réessayer",
    format: "FORMAT",
    language: "LANGUE",
    videoUrl: "URL VIDÉO",
    trimRange: "PLAGE DE COUPE",
    cutVideo: "Couper la vidéo",
    mergeVideos: "Fusionner les vidéos",
    addVideo: "Ajouter une autre vidéo",
    needMoreInputs: "Veuillez ajouter au moins 2 URLs ou fichiers vidéo.",
    missingInput: "Veuillez coller une URL ou importer un fichier.",
    segment: "Segment",
    cutAnother: "Couper une autre",
    mergeMore: "Fusionner d'autres",
    fileSelected: "Fichier sélectionné",
    quality: "QUALITÉ DE TÉLÉCHARGEMENT",
    supportedPlatforms: "PLATEFORMES SUPPORTÉES",
    downloadAnother: "Télécharger un autre",
  },
  es: {
    appTagline: "Herramienta todo en uno de video y audio",
    bannerTitle: "8 Herramientas Poderosas",
    bannerDesc: "Descargar, convertir, recortar, comprimir y más — 144p a 4K",
    downloadFrom: "DESCARGAR DESDE",
    tools: "HERRAMIENTAS",
    pasteUrl: "Pegar URL aquí...",
    uploadFromDevice: "Subir desde el dispositivo",
    orUpload: "O SUBIR DESDE EL DISPOSITIVO",
    processing: "Procesando...",
    tryAgain: "Intentar de nuevo",
    format: "FORMATO",
    language: "IDIOMA",
    videoUrl: "URL DE VIDEO",
    trimRange: "RANGO DE CORTE",
    cutVideo: "Cortar video",
    mergeVideos: "Combinar videos",
    addVideo: "Agregar otro video",
    needMoreInputs: "Por favor agrega al menos 2 URLs o archivos de video.",
    missingInput: "Por favor pega una URL o sube un archivo.",
    segment: "Segmento",
    cutAnother: "Cortar otro",
    mergeMore: "Combinar más",
    fileSelected: "Archivo seleccionado",
    quality: "CALIDAD DE DESCARGA",
    supportedPlatforms: "PLATAFORMAS COMPATIBLES",
    downloadAnother: "Descargar otro",
  },
  hi: {
    appTagline: "वीडियो और ऑडियो का ऑल-इन-वन टूलकिट",
    bannerTitle: "8 शक्तिशाली टूल्स",
    bannerDesc: "डाउनलोड, कन्वर्ट, ट्रिम, कंप्रेस और बहुत कुछ — 144p से 4K",
    downloadFrom: "यहाँ से डाउनलोड करें",
    tools: "टूल्स",
    pasteUrl: "URL यहाँ पेस्ट करें...",
    uploadFromDevice: "डिवाइस से अपलोड करें",
    orUpload: "या डिवाइस से अपलोड करें",
    processing: "प्रोसेसिंग...",
    tryAgain: "फिर कोशिश करें",
    format: "फॉर्मेट",
    language: "भाषा",
    videoUrl: "वीडियो URL",
    trimRange: "ट्रिम रेंज",
    cutVideo: "वीडियो काटें",
    mergeVideos: "वीडियो मर्ज करें",
    addVideo: "और वीडियो जोड़ें",
    needMoreInputs: "कृपया कम से कम 2 URLs या फ़ाइलें जोड़ें।",
    missingInput: "कृपया URL पेस्ट करें या फ़ाइल अपलोड करें।",
    segment: "सेगमेंट",
    cutAnother: "और काटें",
    mergeMore: "और मर्ज करें",
    fileSelected: "फ़ाइल चुनी गई",
    quality: "डाउनलोड गुणवत्ता",
    supportedPlatforms: "समर्थित प्लेटफ़ॉर्म",
    downloadAnother: "और डाउनलोड करें",
  },
  ar: {
    appTagline: "مجموعة أدوات الفيديو والصوت الشاملة",
    bannerTitle: "8 أدوات قوية",
    bannerDesc: "تنزيل، تحويل، قص، ضغط والمزيد — من 144p إلى 4K",
    downloadFrom: "التنزيل من",
    tools: "الأدوات",
    pasteUrl: "الصق الرابط هنا...",
    uploadFromDevice: "رفع من الجهاز",
    orUpload: "أو رفع من الجهاز",
    processing: "جارٍ المعالجة...",
    tryAgain: "حاول مجدداً",
    format: "الصيغة",
    language: "اللغة",
    videoUrl: "رابط الفيديو",
    trimRange: "نطاق القص",
    cutVideo: "قص الفيديو",
    mergeVideos: "دمج الفيديوهات",
    addVideo: "إضافة فيديو آخر",
    needMoreInputs: "يرجى إضافة رابطين أو ملفين على الأقل.",
    missingInput: "يرجى لصق رابط أو رفع ملف.",
    segment: "المقطع",
    cutAnother: "قص آخر",
    mergeMore: "دمج المزيد",
    fileSelected: "تم اختيار الملف",
    quality: "جودة التنزيل",
    supportedPlatforms: "المنصات المدعومة",
    downloadAnother: "تنزيل آخر",
  },
};

export const LANGUAGE_META: { code: LangCode; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "EN" },
  { code: "fr", label: "Français", flag: "FR" },
  { code: "es", label: "Español", flag: "ES" },
  { code: "hi", label: "हिंदी", flag: "HI" },
  { code: "ar", label: "العربية", flag: "AR" },
];

interface LanguageContextType {
  lang: LangCode;
  t: Strings;
  setLang: (code: LangCode) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  t: TRANSLATIONS.en,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  const setLang = async (code: LangCode) => {
    setLangState(code);
    try {
      await AsyncStorage.setItem("@lang", code);
    } catch {}
  };

  React.useEffect(() => {
    AsyncStorage.getItem("@lang").then((v) => {
      if (v && TRANSLATIONS[v as LangCode]) setLangState(v as LangCode);
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t: TRANSLATIONS[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
