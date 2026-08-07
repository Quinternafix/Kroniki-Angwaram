import { renderNavbar } from "./components/navbar.js";
import { renderSidebar } from "./components/sidebar.js";
import { renderFooter } from "./components/footer.js";

import { router } from "./router.js";
import { initSearch } from "./core/search.js";
import { initI18n } from "./core/i18n.js";

async function renderApp() {

    try {

        renderNavbar();
        renderSidebar();
        renderFooter();

        await router();

    } catch (error) {

        console.error(error);

        document.getElementById("app").innerHTML = `

            <section class="error-page">

                <h1>⚠ Wystąpił błąd</h1>

                <pre>${error.stack}</pre>

            </section>

        `;

    }

}

function startApp() {

    initI18n();

    renderNavbar();
    renderSidebar();
    renderFooter();

    initSearch();

    renderApp();

}

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        startApp,
        { once: true }
    );

} else {

    startApp();

}

window.addEventListener(
    "hashchange",
    renderApp
);

window.addEventListener(
    "languagechange",
    renderApp
);
