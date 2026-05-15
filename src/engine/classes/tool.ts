export class Tool {
    public name: string = "";
    public size: number = 10;
    public opacity: number = 100;
    public drawingTool: boolean = false;

    constructor(name: string, drawingTool: boolean) {
        this.name = name;
        this.drawingTool = drawingTool;
    }
}