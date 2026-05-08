<script setup lang="ts">
import { computed, ref } from "vue";
import { ILayer } from "@/engine/types";
import { useEngineStore } from "@/ui/stores/engine";
import LayerItem from "./layeritem.vue";
import { Eye, EyeClosed,  Folder,File} from "lucide-vue-next";

const engineStore = useEngineStore();

const props = defineProps<{
    layer: ILayer;
    level: number;
}>();
const layersStore = engineStore.layers;
// reverse for rendering in correct order
const childrens = computed(() => [...props.layer.childrens].reverse());

const editName = ref<boolean>(false);
const activateEdit = () => (editName.value = true);

</script>

<template>
    <!-- Prevent selecting the layer when clicking on it or its children -->
    <div id="layerItem" class="w-full" :class="{ 'active': layersStore?.selectedLayer == layer }" @click.stop="layersStore?.selectLayer(layer)">
        <!-- Layer Controls -->
        
        <div class="flex">
            <div class="flex">
                <EyeClosed v-if="!layer.visible" @click.stop="layersStore?.toggleLayer(layer)"/>
                <Eye v-else @click.stop="layersStore?.toggleLayer(layer)"/>

                <Folder v-if="layer.type == 'group'"/>
                <File v-else/>
            </div>
            <div class="flex-wrap w-full">
                <div :style="{ 'padding-left': `${level * 10}px` }">
                    <span v-if="!editName" @dblclick="activateEdit">{{ layer.name }}</span>
                    <input v-if="editName" @blur="editName = false" @keyup.enter="editName = false" v-model="layer.name" />
                </div>
            </div>
        </div>

        <LayerItem v-if="layer.type == 'group'" v-for="item in childrens" :layer="item" :level="level + 1" 
        :class="{ 'pointer-events-auto opacity-50': !layer.visible }"/>
    </div>
</template>
