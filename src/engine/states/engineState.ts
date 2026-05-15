import { Panel } from "@/engine/classes/panel";

export class EngineState {
  activePanel: Panel | null = null;
  cameraWidth: number = 0;
  cameraHeight: number = 0;

  updateCameraSize(width: number, height: number) {
    this.cameraWidth = width;
    this.cameraHeight = height;
  }
}
