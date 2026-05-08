export class Transform {
    x: number;
    y: number;
    rotation: number;
    scaleFactor: number;

    constructor(x: number = 0, y: number = 0, rotation: number = 0, scale: number = 1) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.scaleFactor = scale;
    }

    translate(x: number, y: number) {
        this.x += x;
        this.y += y;
    }
    rotate(rotation: number) {
        this.rotation += rotation;
    }
    scale(scale: number) {
        this.scaleFactor *= scale;
    }
    getPosition() {
        return { x: this.x, y: this.y };
    }
}