export function renderSidebar() {

    console.log("renderSidebar");

    const sidebar = document.getElementById("sidebar");
    ...
}
export function renderSidebar() {

document.getElementById("sidebar").innerHTML = `

<a href="#/">🏠 ${t("nav.home")}</a>
<a href="#/characters">👤 ${t("nav.characters")}</a>
<a href="#/factions">⚔ ${t("nav.factions")}</a>
<a href="#/places">🏰 ${t("nav.places")}</a>
<a href="#/timeline">📜 ${t("nav.timeline")}</a>

`;

}
