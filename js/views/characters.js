import { getData } from "../core/api.js";
import { state } from "../state.js";
import { localize, t } from "../core/i18n.js";

export async function charactersView() {

    const characters = await getData("characters");

    const query = (state.search || "").toLowerCase();

    const filtered = characters.filter(character => {

        return (
            character.name.toLowerCase().includes(query) ||
            localize(character, "title").toLowerCase().includes(query)
        );

    });

    return `

<section class="page">

    <header class="page-header">

        <h1>${t("characters.title")}</h1>

        <p>

            ${filtered.length}
            postaci

        </p>

    </header>

    <div class="character-grid">

        ${filtered.map(character => {

            const portrait = character.portraits?.[0]?.image || character.image;

            return `

<article class="character-card">

    <img
        src="${portrait}"
        alt="${character.name}"
        class="character-image">

    <div class="character-content">

        <h2>${character.name}</h2>

        <p class="character-title">

            ${localize(character,"title")}

        </p>

        <div class="character-meta">

            <span>${localize(character,"race")}</span>

            <span>${localize(character,"nation")}</span>

        </div>

        <a
            href="#/characters/${character.id}"
            class="character-button">

            ${t("common.open")}

        </a>

    </div>

</article>

`;

        }).join("")}

    </div>

</section>

`;

}
