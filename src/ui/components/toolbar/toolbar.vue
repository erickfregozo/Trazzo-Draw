<script setup lang="ts">
import { ref } from "vue";
import { SlidersHorizontal, Brush } from "lucide-vue-next";
import Colorpicker from "@/ui/components/colorpicker/";
import SelecterSize from "@/ui/components/toolbar/selectersize.vue";
import ToolOptions from "@/ui/components/toolbar/tooloptions.vue";

const optionSelected = ref<"size" | "options">("size");
</script>

<template>
    <div class="toolbar">
        <Colorpicker />
        <div class="toolbar-options">
            <button @click="optionSelected = 'size'" :class="{ active: optionSelected === 'size' }">
                <Brush />
            </button>
            <button @click="optionSelected = 'options'" :class="{ active: optionSelected === 'options' }">
                <SlidersHorizontal />
            </button>
        </div>
        <SelecterSize v-if="optionSelected === 'size'" />
        <ToolOptions v-if="optionSelected === 'options'" />
    </div>
</template>
