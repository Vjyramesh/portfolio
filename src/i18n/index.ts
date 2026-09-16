import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import enCommon from './locales/en/common.json'
import enNav from './locales/en/nav.json'
import enAddSkillForm from './locales/en/addSkillForm.json'
import enSidebar from './locales/en/sidebar.json'

export const defaultNS = 'common'

// One namespace per component/concern; one file per namespace per language.
// To add a component's strings: create `locales/<lng>/<component>.json` for
// every language and register it here.
export const resources = {
  en: {
    common: enCommon,
    nav: enNav,
    addSkillForm: enAddSkillForm,
    sidebar: enSidebar,
  },
} as const

export const ns = ['common', 'nav', 'addSkillForm', 'sidebar'] as const
export const supportedLngs = Object.keys(resources)

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns,
    defaultNS,
    fallbackLng: 'en',
    supportedLngs,
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lng',
      caches: ['localStorage'],
    },
  })

export default i18n
