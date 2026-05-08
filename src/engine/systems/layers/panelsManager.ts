import { EngineState } from "@/engine/states/engineState";
import { InputManager } from "@/engine/systems/input/inputManager";
import { Layer } from "../../classes/layer";
import { LayerManager } from "@/engine/systems/layers/layerManager";
import { Panel } from "@/engine/classes/panel";

export class PanelsManager {
  private state: EngineState;
  name: string="";
  panels: Panel[] = [];

  constructor(state: EngineState) {
    this.state = state;
  }
  async init(width: number, height: number) {
    let newPanel = new Panel("New panel", width, height, 300);
    const paper = new Layer("paper", width, height);
    // Pintar el canvas del layer de blanco
    paper.context.fillStyle = "#ffffff";
    paper.context.fillRect(0, 0, paper.canvas.width, paper.canvas.height);
    newPanel.layers.push(paper);
    newPanel.selectedLayer = paper;

    this.addPanel(newPanel);
    this.setActivePanel(newPanel)
  }
  addPanel(panel: Panel) {
    this.panels.push(panel);
  }
  removePanel(panel: Panel) {
    const index = this.panels.indexOf(panel);
    if (index !== -1) {
      this.panels.splice(index, 1);
    }
  }
  setActivePanel(panel: Panel | null) {
    this.state.activePanel = panel;
  }

}
