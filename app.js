import { renderNavbar } from "./components/navbar.js";
import { renderSidebar } from "./components/sidebar.js";
import { renderFooter } from "./components/footer.js";
import { router } from "./router.js";

renderNavbar();
renderSidebar();
renderFooter();

window.addEventListener("load", router);
window.addEventListener("hashchange", router);