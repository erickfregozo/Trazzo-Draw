<script setup lang="ts">
import { useLocale } from "@/ui/locales/useLocale";
const { t, currentLocale, setLocale, availableLocales } = useLocale();

// Function to switch language for testing
const switchLanguage = () => {
  const newLang = currentLocale.value === 'en' ? 'es' : 'en';
  setLocale(newLang);
};
</script>

<template>
    <nav>
        <button>{{ t("nav.file") }}</button>
        <button>{{ t("nav.edit") }}</button>
        <button>{{ t("nav.config") }}</button>
        <button @click="switchLanguage">
            {{ currentLocale === 'en' ? 'ES' : 'EN' }}
        </button>
    </nav>
</template>
