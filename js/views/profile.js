import { getData } from "../core/api.js";
import { getFavorites } from "../core/storage.js";
import { localize, t } from "../core/i18n.js";

function slugify(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function profileView(id) {
  const characters = await getData("characters");
  const character = characters.find(item => item.id === id);
  if (!character) return `<h1>${t("profile.notFound")}</h1><p>${t("profile.notFoundDescription")}</p>`;

  const favorites = getFavorites();
  const isFavorite = favorites.includes(character.id);
  const friends = Array.isArray(character.friends) ? character.friends : [];
  const enemies = Array.isArray(character.enemies) ? character.enemies : [];
  const home = localize(character, "home");
  const faction = localize(character, "faction");

  return `<section class="profile">
    <nav class="breadcrumbs"><a href="#/">${t("common.home")}</a> &gt; <a href="#/characters">${t("characters.title")}</a> &gt; <span>${character.name}</span></nav>
    <div class="profile-header"><img src="${character.image}" alt="${character.name}" class="profile-image"><div>
      <h1>${character.name}</h1><h2>${localize(character, "title")}</h2><p>${localize(character, "description")}</p>
      <button class="favorite-button" data-id="${character.id}">${t(isFavorite ? "favorite.remove" : "favorite.add")}</button>
    </div></div>
    <section class="info-box"><h2>${t("profile.info")}</h2><ul>
      <li><strong>${t("profile.race")}:</strong> ${localize(character, "race")}</li>
      <li><strong>${t("profile.nation")}:</strong> ${localize(character, "nation")}</li>
      <li><strong>${t("profile.faction")}:</strong> ${faction}</li>
      <li><strong>${t("profile.rank")}:</strong> ${localize(character, "rank")}</li>
      <li><strong>${t("profile.status")}:</strong> ${localize(character, "status")}</li>
      <li><strong>${t("profile.birth")}:</strong> ${localize(character, "birth")}</li>
    </ul></section>
    <section class="relations"><h2>${t("profile.friends")}</h2>${friends.length ? `<ul>${friends.map(friend => `<li><a href="#/characters/${slugify(friend)}">${friend}</a></li>`).join("")}</ul>` : `<p>${t("common.none")}</p>`}
      <h2>${t("profile.enemies")}</h2>${enemies.length ? `<ul>${enemies.map(enemy => `<li><a href="#/characters/${slugify(enemy)}">${enemy}</a></li>`).join("")}</ul>` : `<p>${t("common.none")}</p>`}
    </section>
    <section class="related"><h2>${t("profile.related")}</h2><ul>
      ${home ? `<li><a href="#/places/${character.homeId || slugify(character.home)}">${home}</a></li>` : ""}
      ${faction ? `<li><a href="#/factions/${character.factionId || slugify(character.faction)}">${faction}</a></li>` : ""}
    </ul></section>
  </section>`;
}
