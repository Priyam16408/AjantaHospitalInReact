import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '../locales/en/translation.json';
import translationTR from '../locales/tr/translation.json';
import translationGR from '../locales/gr/translation.json';
import translationES from '../locales/es/translation.json';
import translationFR from '../locales/fr/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  tr: {
    translation: translationTR,
  },
  es: {
    translation: translationES,
  },
  fr: {
    translation: translationFR,
  },
  de: {
    translation: translationGR,
  },
};

i18n
  .use(initReactI18next ) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug:false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    react: {
      wait: true,
    },
  } );

export default i18n;
