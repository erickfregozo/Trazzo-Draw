import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { IEngine } from "@/engine/types";

export const useEngineStore = defineStore("engine", () => {
  const instance = ref<IEngine | null>(null);
  async function setEngine(engine: IEngine) {
    instance.value = engine;
  }
  const getInstance = computed(() => instance.value);
  const isLoading = computed(() => instance.value?.loading ?? true);
  const isReady = computed(() => instance.value?.running ?? false);
  const state = computed(() => instance.value?.state ?? null);
  const panel = computed(() => instance.value?.panel ?? null);
  const tool = computed(() => {
    return instance.value?.tool ?? null;
  });
  const layers = computed(() => instance.value?.layers ?? null);

  return {
    //instance of engine
    instance,
    getInstance,
    //set engine
    setEngine,
    //getters
    isLoading,
    isReady,
    state,
    panel,
    tool,
    layers,
  };
});
