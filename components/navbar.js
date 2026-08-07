import { t } from "../core/i18n.js";

console.log("navbar.js załadowany");

export function renderNavbar() {

    console.log("renderNavbar wywołany");

    const navbar = document.getElementById("navbar");

    if (!navbar) {
        console.log("#navbar nie znaleziony");
        return;
    }
}
    navbar.innerHTML = `

        <nav class="navbar">

            <div class="navbar-logo">

                <a href="#/">
                    🔥 <span data-i18n="site.title">${t("site.title")}</span>
                </a>

            </div>

            <ul class="navbar-menu">

                <li>
                    <a href="#/" data-i18n="nav.home">
                        ${t("nav.home")}
                    </a>
                </li>

                <li>
                    <a href="#/characters" data-i18n="nav.characters">
                        ${t("nav.characters")}
                    </a>
                </li>

                <li>
                    <a href="#/factions" data-i18n="nav.factions">
                        ${t("nav.factions")}
                    </a>
                </li>

                <li>
                    <a href="#/places" data-i18n="nav.places">
                        ${t("nav.places")}
                    </a>
                </li>

                <li>
                    <a href="#/timeline" data-i18n="nav.timeline">
                        ${t("nav.timeline")}
                    </a>
                </li>

                <li>
                    <a href="#/library" data-i18n="nav.library">
                        ${t("nav.library")}
                    </a>
                </li>

            </ul>

            <div class="navbar-tools">

                <input
                    id="searchInput"
                    type="search"
                    data-i18n-placeholder="nav.searchPlaceholder"
                    placeholder="${t("nav.searchPlaceholder")}"
                    autocomplete="off"
                >

                <div class="language-switcher">

                    <button
                        type="button"
                        data-language="pl"
                        title="Polski"
                        aria-label="Polski">
                        🇵🇱
                    </button>

                    <button
                        type="button"
                        data-language="en"
                        title="English"
                        aria-label="English">
                        🇬🇧
                    </button>

                    <button
                        type="button"
                        data-language="es"
                        title="Español"
                        aria-label="Español">
                        🇪🇸
                    </button>

                </div>

            </div>

        </nav>

    `;

    highlightCurrentPage();
}

export function highlightCurrentPage() {

    const current = location.hash || "#/";

    document
        .querySelectorAll(".navbar-menu a")
        .forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === current) {
                link.classList.add("active");
            }

        });

}

window.addEventListener(
    "hashchange",
    highlightCurrentPage
);
