import { ConfigManager } from "@/engine/systems/config/configManager";
import { LoopSystem } from "@/engine/systems/loop/loopSystem";
import { EngineState } from "@/engine/states/engineState";
import { InputManager } from "./inputManager";
import { Hotkey } from "@/engine/classes/hotkey";

export class HotkeySystem implements LoopSystem {
  table: Hotkey[] = [];
  private actions: Record<string, Function> = {};
  private config: ConfigManager = new ConfigManager();

  async init(state: EngineState, systems: any[]) {
    //declare hoykeys
    let ini = (await this.config.getConfig("hotkey")) as string;
    this.parseIniHotkeys(ini);
    //declare hoykeys actions
    const map = new Map<string, any>();
    systems.forEach(s => map.set(s.constructor.name, s));
    // const layers = map.get("LayersSystem") as LayerManager;
    // this.actions["AddLayer"] = () => layers.addLayer();
    // this.actions["RemoveLayer"] = () => layers.removeLayer(state.selectedLayer as Layer);
  }

  update(dt: number, state: EngineState, input: InputManager) {
    if (!input.keys.size) return;

    this.table.forEach((hotkey) => {
      if (!hotkey.keys.every((k) => input.keys.has(k))) return;
      const action = this.actions[hotkey.action];
      if (!action) return;
      action();
    });
  }

  parseIniHotkeys(ini: string) {
    let table: Hotkey[] = [];
    let currentSection = "";
    const lines = ini.replace(/\r/g, "").split("\n").map((l) => l.trim()).filter(Boolean);

    for (const line of lines) {
      if (line.startsWith("[") && line.endsWith("]")) {
        currentSection = line.slice(1, -1);
      }

      const [action, combo] = line.split("=");
      if (!action || !combo || !currentSection) continue;

      const keys = combo.split("+").map((k) => k.trim());

      table.push({
        section: currentSection,
        action: action.trim(),
        keys,
      } as Hotkey);
    }

    this.table = table;
  }
}
