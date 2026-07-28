import { router } from "./router.js";
import { initSearch } from "./core/search.js";
import { initI18n } from "./core/i18n.js";

async function renderApp() {
    try {
        await router();
    } catch (error) {
        console.error(error);

        document.getElementById("app").innerHTML = `
            <p>Nie udało się uruchomić strony. Otwórz konsolę przeglądarki, aby sprawdzić błąd.</p>
        `;
    }
}

function startApp() {
    initI18n();
    initSearch();
    renderApp();
}

// 🔥 Kluczowe — router musi wystartować dopiero po załadowaniu DOM
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp, { once: true });
} else {
    startApp();
}

// 🔥 Re-render przy zmianie hash i języka
window.addEventListener("hashchange", renderApp);
window.addEventListener("languagechange", renderApp);
