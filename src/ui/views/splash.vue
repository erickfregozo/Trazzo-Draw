<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getName } from '@tauri-apps/api/app';
import { LogicalSize } from '@tauri-apps/api/dpi';
import splash from "@/ui/assets/img/splash.png";
import { Engine } from "@/engine/core/engine";
import { useEngineStore } from "@/ui/stores/engine";
const engineStore = useEngineStore();
const router = useRouter();
const win = getCurrentWebviewWindow();

onMounted(async () => {
    win.show();
    win.setFocus();
    
    engineStore.setEngine(Engine.getInstance());
    await engineStore.getInstance.init();
});
watch(() => engineStore.isLoading, async () => {
    if (!engineStore.isLoading) {
        await OpenMainWindow();
    }
});

const OpenMainWindow = async () => {
    try {
        // Change to main window
        await win.setTitle(await getName());
        await win.setDecorations(true);
        await win.setSize(new LogicalSize(1000, 700));
        await win.setResizable(true);
        await win.maximize();

        router.replace("/draw");
    } catch (e) {
        console.error("OpenMainWindow error:", e);
    }
};
</script>
<template>
    <div id="splash">
        <img :src="splash" alt="Splash Screen" width="100%" height="100%" />
    </div>
</template>
