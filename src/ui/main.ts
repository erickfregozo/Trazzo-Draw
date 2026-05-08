import { createApp } from "vue";
import mainApp from "./views/main.vue"
import { getCurrentWindow } from '@tauri-apps/api/window'

// imports CSS
import "./assets/css/themes.css";
import "./assets/css/components.css";
import "./assets/css/classes.css";
import 'vue-color/style.css';

// import PLUGINS
import { createI18nInstance as i18n } from "./locales";
import { createPinia } from "pinia";
import router from "./routes";

// create app
export default async function main() {
  const app = createApp(mainApp);
  app.use(createPinia());
  app.use(router);
  app.use(await i18n());
  await app.mount("#app");

  await getCurrentWindow().show();
  await getCurrentWindow().setFocus();
}
