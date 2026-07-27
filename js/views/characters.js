import { getData } from "../core/api.js";
import { state } from "../state.js";
import { localize, t } from "../core/i18n.js";

export async function charactersView() {
  const characters = await getData("characters");
  const query = (state.search || "").toLowerCase();
  const filtered = characters.filter(character => character.name.toLowerCase().includes(query) || localize(character, "title").toLowerCase().includes(query));
  return `<h1>${t("characters.title")}</h1><div class="character-list">${filtered.map(character => `<article class="character-card">
    <img src="${character.image}" alt="${character.name}" class="character-image">
    <h2>${character.name}</h2><p>${localize(character, "title")}</p>
    <a href="#/characters/${character.id}" class="character-button">${t("common.open")}</a>
  </article>`).join("")}</div>`;
}
