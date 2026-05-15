import { Tool } from "../classes/tool";

export class ToolState {
  selectedTool: string = "pen";
  size: number = 10;
  opacity: number = 100;

  selectedColor: string = "#000000";

  tools: Tool[] = [];
  previousTool: string = "";
  isMoving: boolean = false;

  get drawingTool(): boolean {
    return false;
  }

  setTool(tool: string) {
    this.selectedTool = tool;
  }
  setToolHotkey(tool: string) {
    if (this.selectedTool !== tool) {
      let toolSelected = this.tools.find(t => t.name == this.selectedTool);

      if (toolSelected && toolSelected.drawingTool) {
        this.previousTool = this.selectedTool;
      }
    }
    this.selectedTool = tool;
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
