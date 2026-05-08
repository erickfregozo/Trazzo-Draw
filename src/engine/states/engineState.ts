import { Panel } from "@/engine/classes/panel";

export class EngineState {
  activePanel: Panel | null = null;

  zoom: number = 1;
  rotation: number = 0;
  
  setZoom(zoom:number) {
    this.zoom = zoom;
  }
  setRotation(rotation:number) {
    this.rotation = rotation;
  }
}
