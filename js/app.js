import { router } from "./router.js";
import { initSearch } from "./core/search.js";

window.addEventListener("load", () => {
    initSearch();
    router();
});

window.addEventListener("hashchange", router);