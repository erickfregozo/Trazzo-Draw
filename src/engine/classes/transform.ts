export class Transform {
    x: number;
    y: number;
    rotation: number;
    zoom: number;
    //callback for notify changes to panel.dirty property
    onChange?: () => void;

    constructor(x: number = 0, y: number = 0, rotation: number = 0, scale: number = 1) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.zoom = scale;
    }

    position(x: number, y: number) {
        this.x += x;
        this.y += y;
        this.onChange?.();
    }
    rotate(rotation: number) {
        this.rotation += rotation;
        this.onChange?.();
    }
    scale(scale: number) {
        this.zoom *= scale;
        this.onChange?.();
    }
    getPosition() {
        return { x: this.x, y: this.y };
    }
    reset() {
        this.x = 0; this.y = 0;
        this.rotation = 0; this.zoom = 1;
        this.onChange?.();
    }
    //# region Canvas 2D
    screenToLayer(
        screenX: number, screenY: number,
        canvasWidth: number, canvasHeight: number,
        layerWidth: number, layerHeight: number
    ): { x: number; y: number } {
        // 1. Quitar translación del viewport
        const tx = screenX - (canvasWidth / 2 + this.x);
        const ty = screenY - (canvasHeight / 2 + this.y);

        // 2. Invertir rotación y escala
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);

        return {
            x: (tx * cos + ty * sin) / this.zoom + layerWidth / 2,
            y: (-tx * sin + ty * cos) / this.zoom + layerHeight / 2,
        };
    }
    applyToContext(ctx: CanvasRenderingContext2D) {
        const { width, height } = ctx.canvas;
        ctx.setTransform(new DOMMatrix()
            .translate(width / 2 + this.x, height / 2 + this.y)
            .rotate(this.rotation * (180 / Math.PI))
            .scale(this.zoom));
    }
    //# endregion
}