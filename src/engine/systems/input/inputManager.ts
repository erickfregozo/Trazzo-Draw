export class InputManager {
  width = 0;
  height = 0;
  x = 0;
  y = 0;
  pressure = 0;
  down = false;
  pointerType: "mouse" | "pen" | "touch" = "mouse";
  keys = new Set<string>();

  isKeyPressed(key: string) {
    return this.keys.has(key);
  }
  isKeysReleased(keys: string[]) {
    return keys.every((key) => !this.keys.has(key));
  }

  attachEvents(canvas: HTMLDivElement) {
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerleave", this.onPointerLeave);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  onPointerDown = (e: PointerEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    this.x = e.clientX - rect.left;
    this.y = e.clientY - rect.top;
    
    this.down = true;
    this.pointerType = e.pointerType as "mouse" | "pen" | "touch";
  };
  onPointerUp = () => {
    this.down = false;
  };
  onPointerMove = (e: PointerEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    this.x = e.clientX - rect.left;
    this.y = e.clientY - rect.top;
    this.pressure = e.pressure;
  };
  onPointerLeave = () => {
    this.down = false;
  };

  // keyboard commands
  onKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.key);
  };
  onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key);
  };
}
