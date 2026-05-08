<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useEngineStore } from "@/ui/stores/engine";
import { Engine } from "@/engine/core/engine";
import NavBar from "../components/navbar";
import ToolBox from "../components/toolbox";
import ToolBar from "../components/toolbar";
import LayerPanel from "../components/layerpanel";
const engineStore = useEngineStore();
const canvas = ref<HTMLDivElement | null>(null);

onMounted(async () => {
    if (canvas.value) {
        engineStore.instance?.attachEvents(canvas.value);
        engineStore.instance?.start(800, 600);
    }
});

watch(
    () => engineStore.isLoading,
    () => {},
);
</script>

<template>
    <NavBar />
    <div id="app-container">
        <ToolBox />
        <ToolBar />
        <div id="drawing-canvas" ref="canvas"></div>
        <LayerPanel />
    </div>
</template>
