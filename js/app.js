import { router } from "./router.js";
import { initSearch } from "./core/search.js";
import { initI18n } from "./core/i18n.js";

window.addEventListener("load", () => {
    initI18n();
    initSearch();
    router();
});

window.addEventListener("hashchange", router);
window.addEventListener("languagechange", router);
