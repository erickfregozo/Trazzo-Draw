<script setup lang="ts">
import { computed } from "vue";
import { useEngineStore } from "@/ui/stores/engine";
import { ILayer } from "@/engine/types";
import LayerItem from "./layeritem.vue";
import { FilePlusCorner, Folder, Trash } from "lucide-vue-next";
const engineStore = useEngineStore();

const layersStore = engineStore.layers;
// reverse for rendering in correct order
const layers = computed<ILayer[]>(() => [...layersStore?.layers ?? []].reverse());
const selected = computed<ILayer | null>(() => layersStore?.selectedLayer || null);

</script>

<template>
    <div class="toolbar">
        <div class="toolbar-options">
            <button @click="layersStore?.addLayer()">
                <FilePlusCorner />
            </button>
            <button @click="layersStore?.addLayerGroup()">
                <Folder />
            </button>
            <button @click="layersStore?.removeLayer(selected!)" :disabled="!selected">
                <Trash />
            </button>
        </div>
        <div class="size-panel">
            <LayerItem v-for="item in layers" :layer="item" :level="1" />
        </div>
    </div>
</template>
