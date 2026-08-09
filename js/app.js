import { renderNavbar } from "./components/navbar.js";
import { renderSidebar } from "./components/sidebar.js";
import { renderFooter } from "./components/footer.js";

import { router } from "./router.js";
import { initSearch } from "./core/search.js";
import { initI18n } from "./core/i18n.js";


async function renderApp() {

    try {

        await router();

    } catch (error) {

        console.error(
            "Błąd aplikacji:",
            error
        );

        const app =
            document.getElementById("app");

        if (app) {

            app.innerHTML = `

                <section class="error-page">

                    <h1>
                        ⚠ Wystąpił błąd
                    </h1>

                    <p>
                        Nie udało się wyświetlić strony.
                    </p>

                    <pre>
${error.stack || error.message}
                    </pre>

                </section>

            `;

        }

    }

}


function renderLayout() {

    renderNavbar();
    renderSidebar();
    renderFooter();

}


function startApp() {

    initI18n();

    // Najpierw tworzymy menu i pozostałe elementy layoutu
    renderLayout();

    // Dopiero teraz search znajdzie #searchInput
    initSearch();

    // Następnie uruchamiamy router
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


// Zmiana strony
window.addEventListener(
    "hashchange",
    renderApp
);


// Zmiana języka
window.addEventListener(
    "languagechange",
    () => {

        renderLayout();

        renderApp();

    }
);
