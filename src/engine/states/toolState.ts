export class ToolState {
  selectedTool: string = "pen";
  size: number = 10;
  opacity: number = 100;

  selectedColor: string = "#000000";

  setTool(tool: string) {
    this.selectedTool = tool;
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
