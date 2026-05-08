import { EngineState } from "../../states/engineState";
import { InputManager } from "../input/inputManager";
import { LoopSystem } from "../loop/loopSystem";
import { Layer } from "../../classes/layer";
import { ToolState } from "../../states/toolState";

export class ToolSystem implements LoopSystem {
  private lastX = 0;
  private lastY = 0;
  private wasDown = false;
  private toolState: ToolState;

  constructor(toolState: ToolState) {
    this.toolState = toolState;
  }

  update(dt: number, state: EngineState, input: InputManager) {
    if (input.down && state.activePanel && state.activePanel.selectedLayer) {
      this.draw(state.activePanel.selectedLayer, state, input);
      state.activePanel.dirty = true;
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

  draw(layer: Layer, state: EngineState, input: InputManager) {
    const x = input.x;
    const y = input.y;
    const pressure = input.pointerType === "pen" ? input.pressure : 1; // Default for mouse if 0
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
}
