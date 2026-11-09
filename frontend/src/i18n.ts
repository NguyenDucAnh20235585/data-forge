import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLanguage = localStorage.getItem("data-forge-language");

const initialLanguage =
  savedLanguage === "vi" || savedLanguage === "ja" ? savedLanguage : "en";

import en from "./locales/en.json";
import vi from "./locales/vi.json";
import ja from "./locales/ja.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
    ja: { translation: ja },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: ["en", "vi", "ja"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
