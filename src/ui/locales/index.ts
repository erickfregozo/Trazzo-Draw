import { createI18n } from "vue-i18n";
import loadCsvTranslations from "./utils/csvToJson";

export async function createI18nInstance() {
  const messages = await loadCsvTranslations();

  return createI18n({
    legacy: false,
    defaultLocale: "en",
    fallbackLocale: "en",
    messages,
  });
}
