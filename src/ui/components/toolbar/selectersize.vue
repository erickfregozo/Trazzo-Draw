<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEngineStore } from '@/ui/stores/engine';
import { Circle } from 'lucide-vue-next';

const engineStore = useEngineStore();
const toolStore = engineStore.tool;
const size = ref<number>(toolStore?.size || 0)

const listSize = [1, 2, 5, 7, 10, 15, 20, 25, 30, 40, 50, 60, 100, 200, 300, 400, 500]

watch(size, (newSize: number) => {
    toolStore?.setSize(newSize);
});
</script>

<template>
    <div class="flex-column flex-1 min-h-0">
        <div class="w-full flex items-center gap-3 p-1 container-bg-border">
            <input type="range" min="10" max="100" step="1" v-model="size" class="input-range" />
            <input type="number" v-model="size" name="size" class="input-number" />
        </div>
        <div class="size-grid">
            <button class="size-button relative" v-for="itemSize in listSize" :key="itemSize" @click="size = itemSize">
                <Circle fill="white" :size="Math.min(itemSize, 30)" />
                <span class="text-sm absolute bottom-0.5">{{ itemSize }}</span>
            </button>
        </div>
    </div>
</template>
