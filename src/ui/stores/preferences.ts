import { ref,computed } from "vue";
import { defineStore } from "pinia";

export const usePreferencesStore = defineStore("preferences", () => {
  const language = ref<string>("en");

  function setLanguage(lang: string) {
    language.value = lang;
  }

  return {
    language,
    setLanguage,
  };
});
