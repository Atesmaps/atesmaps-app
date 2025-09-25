import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import cat from './cat.json';

// Define the resources (translation files)
const resources = {
  // en: {
  //   translation: en,
  // },
  // es: {
  //   translation: es,
  // },
  cat: {
    translation: cat,
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'cat', // default language
    fallbackLng: 'cat', // fallback language if translation is not found
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;