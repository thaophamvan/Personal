import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { reactI18nextModule } from 'react-i18next'
/*eslint-disable */
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: {
      'en-US': ['en'],
      'vi-VN': ['vn'],
      default: ['en'],
    },
    preload: ['en'],
    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    getAsync: false,
    react: {
      defaultTransParent: 'span', // needed for preact
      wait: true,
    },
  })


export default i18n
