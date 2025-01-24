import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './english.json';

const languageDetector = {
  init: Function.prototype,
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: async callback => {
    const selectLanguage = 'en';
    callback(selectLanguage);
  },
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    debug: true,
    resources: {
      en,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
