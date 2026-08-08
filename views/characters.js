import { getData } from "../core/api.js";
import { t, localize } from "../core/i18n.js";

export async function charactersView() {

    const characters = await getData("characters");

    return `

        <section class="characters-page">

            <h1 data-i18n="characters.title">
                ${t("characters.title")}
            </h1>

            <div class="character-list">

                ${characters.map(character => {

                    const name = localize(character, "name");
                    const title = localize(character, "title");

                    return `

                        <article class="character-card">

                            <img
                                src="${character.image || ""}"
                                alt="${name}"
                                class="character-image"
                            >

                            <h2>${name}</h2>

                            <p>${title}</p>

                            <a
                                href="#/characters/${encodeURIComponent(character.id)}"
                                class="character-button"
                                data-i18n="common.open"
                            >
                                ${t("common.open")}
                            </a>

                        </article>

                    `;

                }).join("")}

            </div>

        </section>

    `;
}
