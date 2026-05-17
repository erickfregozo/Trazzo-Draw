import { EngineState } from "@/engine/states/engineState";
import { Layer } from "../../classes/layer";
import { Panel } from "@/engine/classes/panel";

export class LayerManager {
  private state: EngineState;

  constructor(state: EngineState) {
    this.state = state;
  }
  public get panel() {
    return this.state.activePanel;
  }
  public set panel(panel: Panel | null) {
    this.state.activePanel = panel;
  }
  public get layers() {
    return this.state.activePanel?.layers || [];
  }
  public set layers(layers: Layer[]) {
    this.state.activePanel!.layers = layers;
  }
  public get selectedLayer() {
    return this.state.activePanel?.selectedLayer || null;
  }
  public set selectedLayer(layer: Layer | null) {
    this.state.activePanel!.selectedLayer = layer;
  }

  init() {
    if (!this.panel) return console.error("Panel is null");

    const paper = new Layer(
      "paper",
      this.panel?.width || 200,
      this.panel?.height || 200,
    );

    // Pintar el canvas del layer de blanco
    paper.context.fillStyle = "#ffffff";
    paper.context.fillRect(0, 0, paper.canvas.width, paper.canvas.height);

    this.panel.layers.push(paper);
    this.panel.selectedLayer = paper;
  }

  selectLayer(layer: Layer) {
    this.panel!.selectedLayer = layer;
  }
  addLayerGroup() {
    const layer = new Layer("New group", this.panel!.width, this.panel!.height, "group");
    this.panel!.layers.push(layer);
    this.panel!.selectedLayer = layer;
    this.panel!.dirty = true;
    return layer;
  }
  addLayer() {
    if (this.selectedLayer && this.selectedLayer?.type === "group") {
      this.addLayerChild(this.selectedLayer);
    } else {
      this.addLayerSingle();
    }
    this.panel!.dirty = true;
  }
  addLayerSingle() {
    const layer = new Layer("New layer", this.panel!.width, this.panel!.height);
    this.panel!.layers.push(layer);
    this.panel!.selectedLayer = layer;
    return layer;
  }
  addLayerChild(parent: Layer) {
    const layer = new Layer("New layer", this.panel!.width, this.panel!.height);
    layer.parent = parent;
    parent.childrens.push(layer);
    this.panel!.selectedLayer = layer;
    return layer;
  }
  removeLayer(layer: Layer | null) {
    if (!layer || layer.locked) return;

    const parent = layer.parent;
    if (parent) {
      const index = parent.childrens.indexOf(layer);
      if (index !== -1) {
        parent.childrens.splice(index, 1);
      }
    }
    const index = this.panel?.layers.indexOf(layer) || -1;
    if (index !== -1) {
      this.panel!.layers.splice(index, 1);
    }
    if (this.panel!.selectedLayer === layer) {
      this.panel!.selectedLayer = null;
    }
    this.panel!.dirty = true;
  }
  toggleLayer(layer: Layer) {
    layer.visible = !layer.visible;
    this.panel!.dirty = true;
  }
  clearLayer() {
    const layer = this.selectedLayer;
    if (!layer || layer.locked) return;
    layer.context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
    this.panel!.dirty = true;
  }
}
