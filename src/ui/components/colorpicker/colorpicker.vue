<script setup lang="ts">
import { ref, watch } from "vue";
import { Settings2, Palette, SwatchBook } from "lucide-vue-next";
import { useEngineStore } from "@/ui/stores/engine";
import { ChromePicker } from 'vue-color'
import { RGBSliders, HSVSliders, HSLSliders } from 'vue-color'
import { SwatchesPicker, } from 'vue-color'

const engine = useEngineStore();
const toolStore = engine.tool;
const selectedColor = ref<string>(toolStore?.selectedColor || "")

const colorMode = ref<"rgb" | "hsl" | "hsv">("hsv")
const optionView = ref<"chrome" | "sliders" | "swatches">("chrome")

const changeColorMode = () => {
    const modes: Array<"rgb" | "hsl" | "hsv"> = ["rgb", "hsl", "hsv"]

    const index = modes.indexOf(colorMode.value)
    //limit value to array
    const nextIndex = (index + 1) % modes.length

    colorMode.value = modes[nextIndex]
}
watch(selectedColor, (newColor: string) => {
    toolStore?.setSelectedColor(newColor);
});

</script>
<template>
    <div class="color-picker ">
        <div class="toolbar-options">
            <button @click="optionView = 'chrome'" :class="{ active: optionView === 'chrome' }">
                <Palette />
            </button>
            <button @click="optionView = 'sliders'" :class="{ active: optionView === 'sliders' }">
                <Settings2 />
            </button>
            <button @click="optionView = 'swatches'" :class="{ active: optionView === 'swatches' }">
                <SwatchBook />
            </button>
        </div>

        <div v-if="optionView == 'chrome'">
            <ChromePicker v-model="selectedColor" class="w-full! h-full! border-r-4" disableFields disableAlpha />
        </div>
        <div v-if="optionView == 'sliders'">
            <HSVSliders v-if="colorMode == 'hsv'" v-model="selectedColor" class="w-full! p-2" disableFields
                disableAlpha />
            <RGBSliders v-if="colorMode == 'rgb'" v-model="selectedColor" class="w-full! p-2" disableFields
                disableAlpha />
            <HSLSliders v-if="colorMode == 'hsl'" v-model="selectedColor" class="w-full! p-2" disableFields
                disableAlpha />
            <button class="float-end mr-2! border-none! text-sm" @click="changeColorMode">
                {{ colorMode }}
            </button>
        </div>
        <div v-if="optionView == 'swatches'">
            <SwatchesPicker v-model="selectedColor" class="w-full! h-52.5!" disableFields disableAlpha />
        </div>
    </div>
</template>
