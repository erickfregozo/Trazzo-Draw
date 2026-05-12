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
    this.parseJsonHotkeys(ini);
    //declare hoykeys actions
    const map = new Map<string, any>();
    systems.forEach(s => map.set(s.constructor.name, s));

    this.declareActions(state, map);
  }
  declareActions(state: EngineState, systems: Map<string, any>) {
    // view
    // zoom factor in percent (0.01 = 1%) 
    // this.actions["ZoomIn"] = () => state.activePanel?.transform.scale(1.005);
    // this.actions["ZoomOut"] = () => state.activePanel?.transform.scale(0.995);
    // this.actions["ZoomReset"] = () => state.activePanel?.transform.reset();
    // layers
    // this.actions["AddLayer"] = () => systems.get("LayerSystem").addLayer();
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

  parseJsonHotkeys(str: string) {
    let table: Hotkey[] = [];
    // remove trailing commas
    const clean = str.replace(/,\s*([}\]])/g, '$1');
    const root = JSON.parse(clean);
    // reed the configuration in json file
    for (const section in root) {
      const sectionActions = root[section];
      for (const action in sectionActions) {
        const combo = sectionActions[action] as string;
        // replace double plus(\+\+) with a null(\0) 
        // example: "Ctrl+shift++" => ["Ctrl","shift","+"]
        const keys = combo.replace(/\+\+/g, '\+\0').split('+').map(k => k.replace(/\0/g, '+'));
        table.push({
          section: section,
          action: action,
          keys: keys,
        } as Hotkey);
      }
    }

    console.log("parsed: ", table);
    this.table = table;
  }
}
