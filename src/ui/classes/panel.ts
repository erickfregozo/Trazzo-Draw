import { Layer } from "./layer";

export class Panel {
  name: string;
  height: number;
  width: number;
  DPI: number; // Pixel density (DPI: pixels per inch)
  location: string = "";
  selectedLayer: Layer | null = null;

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  layers: Layer[] = [];
  dirty: boolean = true;

  constructor(name: string, height: number, width: number, dpi: number) {
    // properties
    this.name = name;
    this.height = height;
    this.width = width;
    this.DPI = dpi;

    // canvas
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d")!;
    // base resolution * DPI = final canvas resolution
    this.canvas.width = this.width * this.DPI;
    this.canvas.height = this.height * this.DPI;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
  }

  setLocation(location: string) {
    this.location = location;
  }
}
