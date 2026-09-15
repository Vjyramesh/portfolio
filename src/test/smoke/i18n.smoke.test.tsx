import { describe, expect, it } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next'
import appI18n from '../../i18n'

function Sample() {
  const { t } = useTranslation()
  return <span>{t('actions.submit')}</span>
}

describe('test harness: react-i18next', () => {
  it("loads the app's i18n config and renders the English translation", () => {
    render(
      <I18nextProvider i18n={appI18n}>
        <Sample />
      </I18nextProvider>,
    )

    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('switches translated text when the language changes at runtime', async () => {
    const testI18n = createInstance()
    await testI18n.use(initReactI18next).init({
      lng: 'en',
      fallbackLng: 'en',
      defaultNS: 'common',
      interpolation: { escapeValue: false },
      resources: {
        en: { common: { actions: { submit: 'Submit' } } },
        fr: { common: { actions: { submit: 'Envoyer' } } },
      },
    })

    render(
      <I18nextProvider i18n={testI18n}>
        <Sample />
      </I18nextProvider>,
    )

    expect(screen.getByText('Submit')).toBeInTheDocument()

    await act(async () => {
      await testI18n.changeLanguage('fr')
    })

    expect(screen.getByText('Envoyer')).toBeInTheDocument()
  })
})
