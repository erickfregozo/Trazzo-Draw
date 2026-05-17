import { EngineState } from "../../states/engineState";
import { InputManager } from "../input/inputManager";
import { LoopSystem } from "../loop/loopSystem";
import { Layer } from "../../classes/layer";
import { ToolState } from "../../states/toolState";
import { ConfigManager } from "../config/configManager";
import { Tool } from "@/engine/classes/tool";
import { transform } from "typescript";

export class ToolSystem implements LoopSystem {
  private lastX = 0;
  private lastY = 0;
  private wasDown = false;
  private toolState: ToolState;
  private config: ConfigManager = new ConfigManager();

  constructor(toolState: ToolState) {
    this.toolState = toolState;
  }
  async init() {
    let toolsJson: string = await this.config.getConfig("tools");
    let tools = this.parseJsonTools(toolsJson);
    this.toolState.tools = tools;
  }

  update(dt: number, state: EngineState, input: InputManager) {
    switch (this.toolState.selectedTool) {
      case "move": case "moveView":
        if (input.down && state.activePanel) {
          this.move(state, input);
        }
        break;
      case "zoom": case "zoomView":
        if (input.down && state.activePanel) {
          this.zoom(state, input);
        }
        break;
      case "eraser":
        break;
      case "pen":
        if (input.down && state.activePanel && state.activePanel.selectedLayer) {
          this.draw(state.activePanel.selectedLayer, state, input);
          state.activePanel.dirty = true;
        }
        break;
      default:
        break;
    }
    this.wasDown = input.down;
  }
  end(state?: EngineState): void {
    if (!this.wasDown) {
      // End of stroke
      this.lastX = 0;
      this.lastY = 0;
    }
  }

  move(state: EngineState, input: InputManager) {
    if (!state.activePanel) return;
    const x = input.x;
    const y = input.y;
    if (!this.wasDown) {
      this.lastX = x;
      this.lastY = y;
    }

    state.activePanel.transform.position(x - this.lastX, y - this.lastY);
    state.activePanel.dirty = true;

    this.lastX = x;
    this.lastY = y;
  }
  zoom(state: EngineState, input: InputManager) {
    if (!state.activePanel) return;
    const x = input.x;
    const y = input.y;
    if (!this.wasDown) {
      this.lastX = x; 1
      this.lastY = y;
    }
    // get distance between last and current position
    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const delta = (Math.abs(dx) > Math.abs(dy) ? dx : dy); // eje dominante
    const scaleFactor = 1 + delta / 300;

    state.activePanel.transform.scale(scaleFactor);
    state.activePanel.dirty = true;

    this.lastX = x;
    this.lastY = y;
  }

  draw(layer: Layer, state: EngineState, input: InputManager) {
    // get cursor position in world coordinates from mouse position in screen coordinates
    const transform = state.activePanel!.transform;
    const pos = transform.screenToLayer(
      input.x, input.y,
      state.cameraWidth, state.cameraHeight,
      layer.canvas.width, layer.canvas.height
    );
    const x = pos.x;
    const y = pos.y;
    // Pressure only for pen input (default for mouse is 1)
    const pressure = input.pointerType === "pen" ? input.pressure : 1;
    const { selectedColor, size, opacity } = this.toolState;

    const ctx = layer.context;
    if (!this.wasDown) {
      // Start of stroke
      this.lastX = x;
      this.lastY = y;
    }
    // Continue stroke
    ctx.lineWidth = pressure * size;
    ctx.strokeStyle = selectedColor;
    ctx.globalAlpha = opacity / 100;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    this.lastX = x;
    this.lastY = y;
  }

  private parseJsonTools(jsonString: string): Map<string, Tool> {
    const clean = jsonString.replace(/,\s*([}\]])/g, '$1');
    const raw = JSON.parse(clean) as Record<string, Record<string, string>>;
    return new Map(Object.entries(raw).map(([name, props]) => [name, this.fromJSON(name, props)]));
  }
  private fromJSON(name: string, raw: Record<string, string>): Tool {
    const tool = new Tool(name, raw.drawingTool == "true");
    tool.size = parseInt(raw.size, 10);
    tool.opacity = parseInt(raw.opacity, 10);
    return tool;
  }
}
