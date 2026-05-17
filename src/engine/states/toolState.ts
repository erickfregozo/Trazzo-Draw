import { Tool } from "../classes/tool";

export class ToolState {
  selectedTool: string = "pen";
  size: number = 10;
  opacity: number = 100;
  drawingTool: boolean = true;

  selectedColor: string = "#000000";
  tools: Map<string, Tool> = new Map();
  previousTool: string = "";

  setTool(toolName: string) {
    let toolSelected = this.tools.get(toolName);
    debugger;
    if (toolSelected) {
      this.size = toolSelected.size;
      this.opacity = toolSelected.opacity;
      this.drawingTool = toolSelected.drawingTool;
      this.previousTool = "";
      this.selectedTool = toolName;
    }
  }
  setToolHotkey(toolName: string, isReversible = false) {
    let previousTool = this.selectedTool;
    this.setTool(toolName);
    if (isReversible) {
      this.previousTool = previousTool;
    }
  }
  restoreTool() {
    if (this.previousTool) {
      this.selectedTool = this.previousTool;
      this.previousTool = "";
    }
  }
  setSize(size: number) {
    this.size = size;
  }
  setOpacity(opacity: number) {
    this.opacity = opacity;
  }
  setSelectedColor(hexColor: string) {
    this.selectedColor = hexColor;
  }
}
