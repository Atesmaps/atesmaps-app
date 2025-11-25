import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from "react-native-localize";

// Import translation files
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import cat from './cat.json';

// Define the resources (translation files)
const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  ca: {
    translation: cat,
  }
};

const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  
  if (locales && locales.length > 0) {
    // Returns the primary language code (e.g., 'en', 'es', 'fr')
    // console.log(locales)
    console.log(`Phone language is set to: ${locales[0].languageCode}`)
    return locales[0].languageCode; 
  }
  
  return 'en'; // Default fallback if detection fails
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getDeviceLanguage(), // default language
    fallbackLng: 'en', // fallback language if translation is not found
    supportedLngs: ['en', 'es', 'ca', 'fr'],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;