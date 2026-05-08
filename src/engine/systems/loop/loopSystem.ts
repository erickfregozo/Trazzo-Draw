import { EngineState } from "@/engine/states/engineState";
import { InputManager } from "@/engine/systems/input/inputManager";

export interface LoopSystem {
    begin?(dt?: number, state?: EngineState, input?: InputManager): void
    update?(dt?: number, state?: EngineState, input?: InputManager): void
    lateUpdate?(dt?: number, state?: EngineState, input?: InputManager): void
    render?(state?: EngineState): void
    end?(state?: EngineState): void
}
