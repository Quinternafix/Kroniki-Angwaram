console.log("1 - app.js załadowany");

import { renderNavbar } from "./components/navbar.js";
import { renderSidebar } from "./components/sidebar.js";
import { renderFooter } from "./components/footer.js";

import { router } from "./router.js";
import { initSearch } from "./core/search.js";
import { initI18n } from "./core/i18n.js";

console.log("2 - importy OK");

async function renderApp() {

    try {

        renderNavbar();
        renderSidebar();
        renderFooter();

        await router();

    } catch (error) {

        console.error(error);

        document.getElementById("app").innerHTML = `
            <p>Nie udało się uruchomić strony.</p>
            <pre>${error.stack}</pre>
        `;

    }

}

function startApp() {

    console.log("3 - startApp");

    initI18n();
    console.log("4 - initI18n");

    renderNavbar();
    console.log("5 - navbar");

    renderSidebar();
    console.log("6 - sidebar");

    renderFooter();
    console.log("7 - footer");

    initSearch();
    console.log("8 - search");

    renderApp();
    console.log("9 - router");
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
