import { t } from "../core/i18n.js";

export function renderSidebar() {

    const sidebar = document.getElementById("sidebar");

    if (!sidebar) {
        return;
    }

    sidebar.innerHTML = `

        <nav class="sidebar-menu">

            <a href="#/">
                🏠 ${t("nav.home")}
            </a>

            <a href="#/characters">
                👤 ${t("nav.characters")}
            </a>

            <a href="#/factions">
                ⚔ ${t("nav.factions")}
            </a>

            <a href="#/places">
                🏰 ${t("nav.places")}
            </a>

            <a href="#/timeline">
                📜 ${t("nav.timeline")}
            </a>

            <a href="#/library">
                📚 ${t("nav.library")}
            </a>

        </nav>

    `;

}
