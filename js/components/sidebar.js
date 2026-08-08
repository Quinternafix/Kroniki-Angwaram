import { t } from "../core/i18n.js";

export function renderSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) {
        return;
    }

    sidebar.innerHTML = `

        <nav class="sidebar-nav">

            <a href="#/">

                🏠

                <span data-i18n="nav.home">
                    ${t("nav.home")}
                </span>

            </a>

            <a href="#/characters">

                👤

                <span data-i18n="nav.characters">
                    ${t("nav.characters")}
                </span>

            </a>

            <a href="#/factions">

                ⚔

                <span data-i18n="nav.factions">
                    ${t("nav.factions")}
                </span>

            </a>

            <a href="#/places">

                🏰

                <span data-i18n="nav.places">
                    ${t("nav.places")}
                </span>

            </a>

            <a href="#/timeline">

                📜

                <span data-i18n="nav.timeline">
                    ${t("nav.timeline")}
                </span>

            </a>

            <a href="#/library">

                📚

                <span data-i18n="nav.library">
                    ${t("nav.library")}
                </span>

            </a>

        </nav>

    `;
}
