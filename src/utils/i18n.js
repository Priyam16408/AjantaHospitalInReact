import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';

// the translations (you can keep this for fallback in case the API fails)
const resources = {
};
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      wait: true,
    },
  });


const originalT = i18next.t;
i18next.t = function (key, options) {
  if(typeof key === "string"){
    const normalizedKey =  key?.toUpperCase();
    return originalT.call(i18next, normalizedKey, options);
  }
};

export default i18n;
