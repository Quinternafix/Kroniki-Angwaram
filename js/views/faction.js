import { getData } from "../core/api.js";
import { localize, t } from "../core/i18n.js";

export async function factionView(id) {
  const factions = await getData("factions");
  const faction = factions.find(item => item.id === id);
  if (!faction) return `<h1>404</h1><p>${t("notFound")}</p>`;
  const characters = await getData("characters");
  const members = Array.isArray(faction.members) ? faction.members : [];
  return `<section class="profile">
    <nav class="breadcrumbs"><a href="#/">${t("common.home")}</a> &gt; <a href="#/factions">${t("factions.title")}</a> &gt; <span>${localize(faction, "name")}</span></nav>
    <div class="profile-header"><img src="${faction.image}" alt="${localize(faction, "name")}" class="profile-image"><div><h1>${localize(faction, "name")}</h1><p>${localize(faction, "description")}</p></div></div>
    <section class="info-box"><h2>${t("faction.members")}</h2><ul>${members.length ? members.map(memberId => { const character = characters.find(item => item.id === memberId); return `<li><a href="#/characters/${memberId}">${character?.name || memberId}</a></li>`; }).join("") : `<li>${t("common.noData")}</li>`}</ul></section>
  </section>`;
}
