import { EngineState } from "@/engine/states/engineState";
import { InputManager } from "@/engine/systems/input/inputManager";
import { HotkeySystem } from "@/engine/systems/input/hotkeySystem";
import { ToolSystem } from "@/engine/systems/tools/toolSystem";
import { LoopSystem } from "@/engine/systems/loop/loopSystem";
import { LayerManager } from "@/engine/systems/layers/layerManager";
import { RenderSystem } from "@/engine/systems/render/renderSystem";
import { ConfigManager } from "@/engine/systems/config/configManager";
import { PanelsManager } from "@/engine/systems/layers/panelsManager";
import { ToolState } from "@/engine/states/toolState";

export class Engine {
  public loading = false;
  public running = false;
  public state = new EngineState();
  public tool = new ToolState();
  private static _instance: Engine;

  private lastTime = 0;
  private configManager = new ConfigManager();
  private inputManager = new InputManager();
  private hotkeySystem = new HotkeySystem();
  private panelManager = new PanelsManager(this.state);
  private layerManager = new LayerManager(this.state);
  private renderSystem = new RenderSystem(this.state);
  private toolSystem = new ToolSystem(this.tool);
  private systemsLoop: LoopSystem[] = [];

  public static getInstance(): Engine {
    const g = globalThis as any;

    if (!g.__ENGINE__) {
      g.__ENGINE__ = new Engine();
    }
    return g.__ENGINE__ as Engine;
  }

  public async init() {
    this.loading = true;
    await this.configManager.init();
    let HotkeyConsumer: any[] = [
      this.panelManager,
      this.layerManager,
      this.toolSystem,
      this.inputManager,
      this.tool
    ];
    this.hotkeySystem.init(this.state, HotkeyConsumer);

    this.systemsLoop.push(this.hotkeySystem);
    this.systemsLoop.push(this.toolSystem);
    this.systemsLoop.push(this.renderSystem);

    this.loading = false;
  }
  public get panel() {
    return this.panelManager;
  }
  public get layers() {
    return this.layerManager;
  }

  // #region FUNCTIONS
  start(width: number, height: number) {
    if (this.running) return;
    this.running = true;

    this.panelManager.init(width, height);
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }
  attachEvents(element: HTMLDivElement) {
    this.renderSystem.attachElement(element);
    this.inputManager.attachEvents(element);
  }
  stop() {
    if (!this.running) return;
    this.running = false;
  }

  private loop = (time: number) => {
    if (!this.running) return;
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;
    this.update(dt);
    this.render();
    requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    this.systemsLoop.forEach((script) =>
      script.begin?.(dt, this.state, this.inputManager),
    );
    this.systemsLoop.forEach((script) =>
      script.update?.(dt, this.state, this.inputManager),
    );
    this.systemsLoop.forEach((script) =>
      script.lateUpdate?.(dt, this.state, this.inputManager),
    );
  }
  private render() {
    this.systemsLoop.forEach((script) => script.render?.(this.state));
    this.systemsLoop.forEach((script) => script.end?.(this.state));
  }
}
