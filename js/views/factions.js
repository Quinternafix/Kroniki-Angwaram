import { getData } from "../core/api.js";
import { localize, t } from "../core/i18n.js";

export async function factionsView() {
  const factions = await getData("factions");
  return `<h1>${t("factions.title")}</h1><div class="cards-grid">${factions.map(faction => `<article class="card">
    <img src="${faction.image}" alt="${localize(faction, "name")}" class="card-image">
    <h2>${localize(faction, "name")}</h2><p>${localize(faction, "description")}</p>
    <a href="#/factions/${faction.id}" class="card-button">${t("common.open")}</a>
  </article>`).join("")}</div>`;
}
