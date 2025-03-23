import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en.json";
import etTranslation from "./locales/et.json";


const resources = {
    en: { translation: enTranslation },
    et: { translation: etTranslation },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        interpolation: { escapeValue: false },
    });

export default i18n;
