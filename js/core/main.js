import { router } from "./router.js";
import { initI18n } from "./core/i18n.js";
import { initSearch } from "./core/search.js";

window.addEventListener("DOMContentLoaded", () => {
    initI18n();
    initSearch();
    router();
});

window.addEventListener("hashchange", router);
window.addEventListener("languagechange", router);
