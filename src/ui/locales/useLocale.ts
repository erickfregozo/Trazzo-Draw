import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePreferencesStore } from '@/ui/stores/preferences';

export interface LocaleOption {
  code: string;
  name: string;
  nativeName: string;
}

export function useLocale() {
  const { locale, t } = useI18n();
  const preferencesStore = usePreferencesStore();

  // Opciones de idioma disponibles
  const availableLocales: LocaleOption[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' }
  ];

  // Estado reactivo del idioma actual
  const currentLocale = computed(() => locale.value);

  // Verificar si un idioma está soportado
  const isLocaleSupported = (lang: string): boolean => {
    return availableLocales.some(locale => locale.code === lang);
  };

  // Cambiar idioma (función principal)
  const setLocale = (newLocale: string): void => {
    if (!isLocaleSupported(newLocale)) {
      return;
    }


    // Actualizar Vue I18n
    locale.value = newLocale;

    // Actualizar y persistir en store
    preferencesStore.setLanguage(newLocale);
  };

  // Alternar entre idiomas disponibles
  const toggleLocale = (): void => {
    const currentIndex = availableLocales.findIndex(l => l.code === currentLocale.value);
    const nextIndex = (currentIndex + 1) % availableLocales.length;
    setLocale(availableLocales[nextIndex].code);
  };

  // Obtener información del idioma actual
  const getCurrentLocaleInfo = (): LocaleOption | undefined => {
    return availableLocales.find(l => l.code === currentLocale.value);
  };

  // Obtener nombre localizado del idioma
  const getLocalizedLanguageName = (langCode: string): string => {
    const locale = availableLocales.find(l => l.code === langCode);
    return locale ? locale.nativeName : langCode.toUpperCase();
  };

  // Initialize locale from saved preferences
  const initializeLocale = (): void => {
    const savedLanguage = preferencesStore.language;

    if (savedLanguage && isLocaleSupported(savedLanguage)) {
      locale.value = savedLanguage;
    }
  };

  const translate = (key: string): string => {
    return t(key);
  };

  // Auto-initialize
  initializeLocale();

  return {
    currentLocale, // Return computed ref instead of value
    availableLocales,

    setLocale,
    toggleLocale,
    initializeLocale,

    getCurrentLocaleInfo,
    getLocalizedLanguageName,
    isLocaleSupported,

    t: translate
  };
}
