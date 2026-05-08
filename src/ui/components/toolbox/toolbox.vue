<script setup lang="ts">
import { ref, watch } from "vue";
import { Pen, Eraser, Brush } from "lucide-vue-next";
import { useEngineStore } from "@/ui/stores/engine";
const engine = useEngineStore();
const tool = engine.tool;

const selectedTool = ref<string>(tool?.selectedTool || 'pen');

watch(selectedTool, (newTool: string) => {
    tool?.setTool(newTool);
});
</script>

<template>
    <div class="toolbox">
        <button :class="{ active: selectedTool == 'pen' }" @click="selectedTool = 'pen'">
            <Pen name="pen" />
        </button>
        <button :class="{ active: selectedTool == 'eraser' }" @click="selectedTool = 'eraser'">
            <Eraser name="eraser" />
        </button>
        <button :class="{ active: selectedTool == 'brush' }" @click="selectedTool = 'brush'">
            <Brush name="brush" />
        </button>
    </div>
</template>
