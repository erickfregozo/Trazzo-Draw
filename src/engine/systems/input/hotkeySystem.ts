import { ConfigManager } from "@/engine/systems/config/configManager";
import { LoopSystem } from "@/engine/systems/loop/loopSystem";
import { EngineState } from "@/engine/states/engineState";
import { InputManager } from "./inputManager";
import { Hotkey } from "@/engine/classes/hotkey";
import { LayerManager } from "../layers/layerManager";
import { ToolState } from "@/engine/states/toolState";

export class HotkeySystem implements LoopSystem {
  table: Hotkey[] = [];
  private actions: Record<string, Function> = {};
  private config: ConfigManager = new ConfigManager();
  private inputSize: number = 0;
  private inputManager!: InputManager;
  private toolState!: ToolState;

  async init(state: EngineState, systems: any[]) {
    //declare hoykeys
    let ini = await this.config.getConfig("hotkey");
    this.parseJsonHotkeys(ini);
    //declare hoykeys actions
    const map = new Map<string, any>();
    systems.forEach(s => map.set(s.constructor.name, s));

    this.declareActions(state, map);
  }
  declareActions(state: EngineState, systems: Map<string, any>) {
    const inputManager: InputManager = systems.get("InputManager");
    const layerManager: LayerManager = systems.get("LayerManager");
    const toolState: ToolState = systems.get("ToolState");
    this.inputManager = inputManager;
    this.toolState = toolState;
    // #region View
    // zoom factor in percent (0.01 = 1%) 
    this.actions["ZoomIn"] = () => state.activePanel?.transform.scale(1.05);
    this.actions["ZoomOut"] = () => state.activePanel?.transform.scale(0.95);
    this.actions["ZoomReset"] = () => state.activePanel?.transform.reset();
    // #endregion

    // #region Tools

    //#region Move tool
    const keysMove: string[] = [...(this.table.find(h => h.action == "MoveView")?.keys ?? [])];
    this.declareTools("moveView", keysMove, true);
    //#endregion

    //#region Zoom tool
    const keysZoom: string[] = [...(this.table.find(h => h.action == "ZoomView")?.keys ?? [])];
    this.declareTools("zoomView", keysZoom, true);
    //#endregion

    //#endregion

    //#region Layers
    this.actions["AddLayer"] = () => layerManager.addLayer();
    this.actions["RemoveLayer"] = () => layerManager.removeLayer(layerManager.selectedLayer);
    this.actions["ClearLayer"] = () => layerManager.clearLayer();
    //#endregion
  }

  update(dt: number, state: EngineState, input: InputManager) {
    if (input.keys.size == this.inputSize) return;
    this.inputSize = input.keys.size;

    if (!this.inputSize) return;
    this.table.forEach((hotkey) => {
      if (!hotkey.keys.every((k) => input.keys.has(k))) return;
      const action = this.actions[hotkey.action];
      if (!action) return;
      action();
    });
  }

  parseJsonHotkeys(jsonString: string) {
    let table: Hotkey[] = [];
    // remove trailing commas
    const clean = jsonString.replace(/,\s*([}\]])/g, '$1');
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

    this.table = table;
  }
  private declareTools(tool: string, keysMove: string[], isReversible = true) {
    this.inputManager.onKeyDownRegister((keys, e) => {
      if (keysMove.length == keys.size && keysMove.every((k) => keys.has(k))) {
        this.toolState.setToolHotkey(tool, isReversible);
      }
    });
    this.inputManager.onKeyUpRegister((keys, e) => {
      if (keysMove.length != keys.size || !keysMove.every((k) => keys.has(k))) {
        this.toolState.restoreTool();
      }
    });
  }
}
