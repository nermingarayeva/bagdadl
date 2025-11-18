import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationRU from './locales/ru/translation.json';
import translationAZ from './locales/az/translation.json';

// i18next konfiqurasiyası
i18n
  .use(initReactI18next) // React ilə inteqrasiya
  .init({
    resources: {
      en: { translation: translationEN }, // İngilis dili
      ru: { translation: translationRU }, // Rus dili
      az: { translation: translationAZ }, // Azərbaycan dili
    },
    lng: 'az', // default language (Azərbaycan)
    fallbackLng: 'az', // fallback dili
    interpolation: {
      escapeValue: false, // React təhlükəsizlik səbəbindən bu `false` qalmalıdır
    },
  });

export default i18n;
