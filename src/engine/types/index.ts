import { Layer } from "../classes/layer";
import { Panel } from "../classes/panel";
import { Engine } from "../core/engine";
import { LayerManager } from "../systems/layers/layerManager";
import { PanelsManager } from "../systems/layers/panelsManager";

export interface IEngine extends Engine {}
export interface ILayer extends Layer {}
export interface IPanel extends Panel {}
export interface IPanelManager extends PanelsManager {}
export interface ILayerManager extends LayerManager {}
