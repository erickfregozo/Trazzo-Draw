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
  private transparencyPattern: CanvasPattern | null = null;
  private transparencyCanvas: HTMLCanvasElement | null = null;


  constructor(state: EngineState,) {
    this.state = state;
    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }
  attachElement(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.state.updateCameraSize(rect.width, rect.height);
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    element.appendChild(this.canvas);

    // resize canvas to element
    const resize = () => {
      const rect = element.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      this.state.updateCameraSize(rect.width, rect.height);
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
    if (!this.state.activePanel || !this.state.activePanel.dirty) return this.canvas;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.state.activePanel.dirty = false;

    this.context.save();

    const panel = this.state.activePanel;
    if (!panel) return this.canvas;
    this.state.activePanel.transform.applyToContext(this.context);
    // render background transparency
    this.renderTransparencyBackground(panel);
    // apply transform and render layers
    this.renderLayers(panel.layers);

    this.context.restore();
    return this.canvas;
  }
  renderTransparencyBackground(panel: Panel) {
    // if not transparency pattern layer, create one
    if (!this.transparencyCanvas) {
      const pattern = this.getTransparencyPattern();
      if (!pattern) return;

      let w = panel.width;
      let h = panel.height;
      if (panel.layers.length > 0) {
        let layer = panel.layers[0];
        w = layer.canvas.width;
        h = layer.canvas.height;
      }
      const layer = new Layer("background", w, h);
      console.log("background layer: ", layer);
      layer.context.fillStyle = pattern;
      layer.context.fillRect(0, 0, layer.canvas.width, layer.canvas.height);

      this.transparencyCanvas = layer.canvas;
      console.log("background canvas: ", this.transparencyCanvas);
    }
    this.context.save()
    const pxWidth = this.transparencyCanvas!.width;
    const pxHeight = this.transparencyCanvas!.height;
    this.context.drawImage(this.transparencyCanvas!, -pxWidth / 2, -pxHeight / 2);
    this.context.restore()
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
        // center layer in canvas
        this.context.drawImage(layer.canvas, -layer.canvas.width / 2, -layer.canvas.height / 2);

        this.context.restore()
      }
    }
  }
  getTransparencyPattern(): CanvasPattern {
    if (this.transparencyPattern) return this.transparencyPattern;
    // temporal canvas 16x16px
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 16;
    tempCanvas.height = 16;
    const tempContext = tempCanvas.getContext('2d')!;
    tempContext.fillStyle = '#ffffff'; // white color (base panel)
    tempContext.fillRect(0, 0, 16, 16);
    tempContext.fillStyle = '#e0e0e0'; // gray color (panel pattern)
    // make a pattern with 2 squares
    tempContext.fillRect(0, 0, 8, 8);
    tempContext.fillRect(8, 8, 8, 8);
    // cache and return the pattern
    this.transparencyPattern = this.context.createPattern(tempCanvas, 'repeat')!;
    return this.transparencyPattern;
  }

  end(state?: EngineState): void {
  }


}
