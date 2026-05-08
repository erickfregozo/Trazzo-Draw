import { BlendMode } from "@/engine/constants/blendmodes";

export class Layer {
  type: "layer" | "group" = "layer";
  name: string = "";

  visible: boolean = true;
  blendMode: BlendMode = BlendMode.Normal;
  opacity: number = 1;

  parent: Layer | null = null;
  childrens: Layer[] = [];
}
