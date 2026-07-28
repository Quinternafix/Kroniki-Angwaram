import { getData } from "../core/api.js";
import { getFavorites } from "../core/storage.js";
import { localize, t } from "../core/i18n.js";
import { state } from "../state.js";

function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getPortraitTitle(portrait) {

    if (typeof portrait.title === "string") {
        return portrait.title;
    }

    return (
        portrait.title?.[state.language] ||
        portrait.title?.pl ||
        portrait.title?.en ||
        ""
    );
}

function renderPortraitGallery(character) {

    const portraits = character.portraits?.length
        ? character.portraits
        : [
            {
                title: {
                    pl: "Obecnie",
                    en: "Present",
                    es: "Actualidad"
                },
                image: character.image
            }
        ];

    return `

<div class="portrait-panel">

    <img
        id="portraitImage"
        src="${portraits[0].image}"
        alt="${character.name}"
        class="profile-image">

    <div id="portraitTitle" class="portrait-title">

        ${getPortraitTitle(portraits[0])}

    </div>

    <div class="portrait-gallery">

        ${portraits.map((portrait, index) => `

<button
    class="portrait-thumb ${index === 0 ? "active" : ""}"
    data-image="${portrait.image}"
    data-title="${getPortraitTitle(portrait)}">

    ${getPortraitTitle(portrait)}

</button>

        `).join("")}

    </div>

</div>

`;

}

export async function profileView(id) {

    const characters = await getData("characters");

    const character = characters.find(item => item.id === id);

    if (!character) {
        return `
            <h1>${t("profile.notFound")}</h1>
            <p>${t("profile.notFoundDescription")}</p>
        `;
    }

    const favorites = getFavorites();
    const isFavorite = favorites.includes(character.id);

    const friends = Array.isArray(character.friends)
        ? character.friends
        : [];

    const enemies = Array.isArray(character.enemies)
        ? character.enemies
        : [];

    const home = localize(character, "home");
    const faction = localize(character, "faction");

    return `

<section class="profile">

<nav class="breadcrumbs">

<a href="#/">${t("common.home")}</a>

&gt;

<a href="#/characters">${t("characters.title")}</a>

&gt;

<span>${character.name}</span>

</nav>

<div class="profile-header">

${renderPortraitGallery(character)}

<div class="profile-text">

<h1>${character.name}</h1>

<h2>${localize(character, "title")}</h2>

<p>${localize(character, "description")}</p>

<button
class="favorite-button"
data-id="${character.id}">

${t(isFavorite ? "favorite.remove" : "favorite.add")}

</button>

</div>

</div>

<section class="info-box">

<h2>${t("profile.info")}</h2>

<table class="infobox">

<tr>
<th>${t("profile.race")}</th>
<td>${localize(character, "race")}</td>
</tr>

<tr>
<th>${t("profile.nation")}</th>
<td>${localize(character, "nation")}</td>
</tr>

<tr>
<th>${t("profile.faction")}</th>
<td>${faction}</td>
</tr>

<tr>
<th>${t("profile.rank")}</th>
<td>${localize(character, "rank")}</td>
</tr>

<tr>
<th>${t("profile.status")}</th>
<td>${localize(character, "status")}</td>
</tr>

<tr>
<th>${t("profile.birth")}</th>
<td>${localize(character, "birth")}</td>
</tr>

</table>

</section>

<section class="relations">

<h2>${t("profile.friends")}</h2>

${friends.length
? `<ul>${friends.map(friend=>`
<li>
<a href="#/characters/${slugify(friend)}">${friend}</a>
</li>
`).join("")}</ul>`
: `<p>${t("common.none")}</p>`}

<h2>${t("profile.enemies")}</h2>

${enemies.length
? `<ul>${enemies.map(enemy=>`
<li>
<a href="#/characters/${slugify(enemy)}">${enemy}</a>
</li>
`).join("")}</ul>`
: `<p>${t("common.none")}</p>`}

</section>

<section class="related">

<h2>${t("profile.related")}</h2>

<ul>

${home
? `<li><a href="#/places/${character.homeId || slugify(character.home)}">${home}</a></li>`
: ""}

${faction
? `<li><a href="#/factions/${character.factionId || slugify(character.faction)}">${faction}</a></li>`
: ""}

</ul>

</section>

</section>

`;

}
