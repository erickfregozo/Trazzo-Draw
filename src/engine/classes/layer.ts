import { BlendMode } from "@/engine/constants/blendmodes";

export class Layer {
  type: "layer" | "group" = "layer";
  name: string;

  visible: boolean = true;
  blendMode: BlendMode = BlendMode.Normal;
  opacity: number = 1;
  locked: boolean = false;

  parent: Layer | null = null;
  childrens: Layer[] = [];
  canvas: HTMLCanvasElement = document.createElement("canvas");
  context: CanvasRenderingContext2D = this.canvas.getContext("2d")!;

  constructor(name: string, width: number, height: number, type: "layer" | "group" = "layer") {
    this.type = type;
    this.name = name;
    this.canvas.width = width;
    this.canvas.height = height;
  }
  changeOpacity(opacityPorcent: number) {
    this.opacity = opacityPorcent / 100;
    this.context.globalAlpha = opacityPorcent / 100;
  }
  changeBlendMode(newBlendMode: BlendMode) {
    this.blendMode = newBlendMode;
    this.context.globalCompositeOperation = newBlendMode;
  }

  // #region IMAGE
  updateImage(newImageData: ImageData) {
    this.context.putImageData(newImageData, 0, 0);
  }
  getImage() {
    return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height,);
  }
  // #endregion
}
