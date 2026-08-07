console.log("app.js działa");
import { renderNavbar } from "./components/navbar.js";
import { renderSidebar } from "./components/sidebar.js";
import { renderFooter } from "./components/footer.js";
import { initI18n } from "./core/i18n.js";
import { router } from "./router.js";

renderNavbar();
renderSidebar();
renderFooter();

initI18n();

window.addEventListener("hashchange", router);

router();
