<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEngineStore } from '@/ui/stores/engine';
import { useLocale } from '@/ui/locales/useLocale';
const locale = useLocale();
const { t } = locale;

const engineStore = useEngineStore();
const toolStore = engineStore.tool;
const size = ref<number>(toolStore?.size || 0)
const opacity = ref<number>(toolStore?.opacity || 0)


watch(size, (newSize: number) => {
    toolStore?.setSize(newSize);
});

watch(opacity, (newOpacity: number) => {
    toolStore?.setOpacity(newOpacity);
});
</script>

<template>
    <div class="flex-column flex-1 min-h-0">
        <div class="tool-options-grid">
            <label class="px-3">{{ t("toolbar.options.size") }}</label>
            <div class="w-full flex items-center gap-3 p-1">
                <input type="range" min="10" max="100" step="1" v-model="size" class="input-range" />
                <input type="number" v-model="size" name="size" class="input-number" />
            </div>
            <label class="px-3">{{ t("toolbar.options.opacity") }}</label>
            <div class="w-full flex items-center gap-3 p-1">
                <input type="range" min="10" max="100" step="1" v-model="opacity" class="input-range" />
                <input type="number" v-model="opacity" name="opacity" class="input-number" />
            </div>
        </div>
    </div>
</template>
