import { invoke } from "@tauri-apps/api/core";

export class ConfigManager {
  //list of config.ini
  listConfigurations: string[] = [];

  async init() {
    await invoke("init_config");
  }
  async getConfig(name: string): Promise<string> {
    const iniConfig = await invoke("read_config", { config: name });
    return iniConfig as string;
  }
  async getSectionConfig(name: string, seccion: string) {}
}

