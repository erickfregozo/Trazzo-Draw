import { InputManager } from "@/engine/systems/input/inputManager";
import { LoopSystem } from "@/engine/systems/loop/loopSystem";
import { EngineState } from "@/engine/states/engineState";
import { Layer } from "@/engine/classes/layer";
import { Panel } from "@/engine/classes/panel";

export class RenderSystem implements LoopSystem {
  private panel: Panel | null = null;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private state: EngineState;
  private resizeObserver?: ResizeObserver;

  constructor(state: EngineState,) {
    this.state = state;
    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }
  attachElement(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    element.appendChild(this.canvas);

    // resize canvas to element
    const resize = () => {
      const rect = element.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;

      // force re-rendering
      if (this.state.activePanel) {
        this.state.activePanel.dirty = true;
      }
    };
    // Observe element
    this.resizeObserver = new ResizeObserver(() => { resize(); });
    // this.resizeObserver.observe(element);
    this.resizeObserver.observe(document.documentElement);
  }

  begin(dt?: number, state?: EngineState, input?: InputManager) {
  }
  render(state?: EngineState) {
    if (!this.state.activePanel || !this.state.activePanel?.dirty) return this.canvas;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.state.activePanel.dirty = false;

    this.renderLayers(this.state.activePanel.layers);
    return this.canvas;
  }
  renderLayers(layers: Layer[]) {
    for (const layer of layers) {
      if (!layer.visible) continue;

      if (layer.type === "group") {
        this.renderLayers(layer.childrens);
      } else {
        this.context.save()
        this.context.globalAlpha = layer.opacity;
        this.context.globalCompositeOperation = layer.blendMode;

        this.context.drawImage(layer.canvas, 0, 0, layer.canvas.width * this.state.zoom, layer.canvas.height * this.state.zoom);

        this.context.restore()
      }
    }
  }
  end(state?: EngineState): void {
  }


}
