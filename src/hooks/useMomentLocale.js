import { useTranslation } from 'react-i18next';

// Don't forget to import the required locales if you haven't already 
// in your app's main entry file (e.g., index.js or App.js).
// import 'moment/locale/ca'; 
// import 'moment/locale/es';
// import 'moment/locale/fr'; 

export const useMomentLocale = () => {
    const { i18n } = useTranslation();
    const i18nCode = i18n.language;

    const mapI18nToMomentLocale = (code) => {
        switch (code) {
            case 'cat':
                return 'ca'; // Map i18n 'cat' to Moment's 'ca'
            case 'en':
                return 'en';
            case 'fr':
                return 'fr';
            case 'es':
                return 'es';
            default:
                return 'en'; // Fallback
        }
    };

    return mapI18nToMomentLocale(i18nCode);
};