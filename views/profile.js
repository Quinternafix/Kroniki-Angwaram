import { getData } from "../core/api.js";
import { getFavorites, saveFavorites } from "../core/storage.js";
import { localize, t, getLanguage } from "../core/i18n.js";

function slugify(value) {
return String(value || "")
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");
}

function getPortraitTitle(portrait) {
if (!portrait) {
return "";
}

```
const language = getLanguage();

// Format:
// "title": {
//     "pl": "...",
//     "en": "...",
//     "es": "..."
// }
if (portrait.title && typeof portrait.title === "object") {
    return (
        portrait.title?.[language] ||
        portrait.title?.pl ||
        portrait.title?.en ||
        ""
    );
}

// Format:
// "title": "Młodość",
// "translations": {
//     "en": { "title": "Youth" },
//     "es": { "title": "Juventud" }
// }
if (portrait.translations) {
    return (
        portrait.translations?.[language]?.title ||
        portrait.translations?.pl?.title ||
        portrait.title ||
        ""
    );
}

return portrait.title || "";
```

}

function renderPortraitGallery(character) {
const portraits = Array.isArray(character.portraits) && character.portraits.length
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

```
const firstPortrait = portraits[0];
const firstTitle = getPortraitTitle(firstPortrait);

return `
    <div class="portrait-panel">

        <img
            id="portraitImage"
            src="${firstPortrait.image}"
            alt="${character.name}"
            class="profile-image">

        <div
            id="portraitTitle"
            class="portrait-title">

            ${firstTitle}

        </div>

        <div class="portrait-gallery">

            ${portraits.map((portrait, index) => {

                const title = getPortraitTitle(portrait);

                return `
                    <button
                        type="button"
                        class="portrait-thumb ${index === 0 ? "active" : ""}"
                        data-image="${portrait.image}"
                        data-title="${title}">

                        ${title}

                    </button>
                `;

            }).join("")}

        </div>

    </div>
`;
```

}

function renderInfoBox(character) {
const faction = localize(character, "faction");
const home = localize(character, "home");

```
return `
    <aside class="wiki-infobox">

        <div class="wiki-header">

            <h2>
                ${character.name}
            </h2>

            <p>
                ${localize(character, "title")}
            </p>

        </div>

        <table class="wiki-table">

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
                <td>
                    ${
                        faction
                            ? `
                                <a href="#/factions/${character.factionId || slugify(character.faction)}">
                                    ${faction}
                                </a>
                            `
                            : t("common.noData")
                    }
                </td>
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

            <tr>
                <th>${t("profile.home")}</th>
                <td>
                    ${
                        home
                            ? `
                                <a href="#/places/${character.homeId || slugify(character.home)}">
                                    ${home}
                                </a>
                            `
                            : t("common.noData")
                    }
                </td>
            </tr>

        </table>

    </aside>
`;
```

}

function renderRelations(title, list) {
const relations = Array.isArray(list) ? list : [];

```
return `
    <section class="relations">

        <h2>
            ${title}
        </h2>

        ${
            relations.length
                ? `
                    <ul>

                        ${relations.map(item => `
                            <li>
                                <a href="#/characters/${slugify(item)}">
                                    ${item}
                                </a>
                            </li>
                        `).join("")}

                    </ul>
                `
                : `
                    <p>
                        ${t("common.noData")}
                    </p>
                `
        }

    </section>
`;
```

}

export async function profileView(id) {
const characters = await getData("characters");

```
const character = characters.find(characterItem => characterItem.id === id);

if (!character) {
    return `
        <section class="profile">

            <h1>
                ${t("profile.notFound")}
            </h1>

            <p>
                ${t("profile.notFoundDescription")}
            </p>

        </section>
    `;
}

const favorites = getFavorites();
const isFavorite = favorites.includes(character.id);

return `
    <section class="profile">

        <nav class="breadcrumbs">

            <a href="#/">
                ${t("common.home")}
            </a>

            <span aria-hidden="true">
                &gt;
            </span>

            <a href="#/characters">
                ${t("characters.title")}
            </a>

            <span aria-hidden="true">
                &gt;
            </span>

            <span>
                ${character.name}
            </span>

        </nav>

        <div class="profile-layout">

            ${renderPortraitGallery(character)}

            <main class="profile-main">

                <header>

                    <h1>
                        ${character.name}
                    </h1>

                    <h2>
                        ${localize(character, "title")}
                    </h2>

                    <p>
                        ${localize(character, "description")}
                    </p>

                    <button
                        type="button"
                        id="favoriteButton"
                        data-id="${character.id}">

                        ${
                            isFavorite
                                ? t("favorite.remove")
                                : t("favorite.add")
                        }

                    </button>

                </header>

                ${renderInfoBox(character)}

                ${renderRelations(
                    t("profile.friends"),
                    character.friends
                )}

                ${renderRelations(
                    t("profile.enemies"),
                    character.enemies
                )}

                ${
                    Array.isArray(character.parents) && character.parents.length
                        ? renderRelations(
                            t("profile.parents"),
                            character.parents
                        )
                        : ""
                }

                ${
                    Array.isArray(character.siblings) && character.siblings.length
                        ? renderRelations(
                            t("profile.siblings"),
                            character.siblings
                        )
                        : ""
                }

                ${
                    Array.isArray(character.quotes) && character.quotes.length
                        ? `
                            <section class="quotes">

                                <h2>
                                    ${t("profile.quotes")}
                                </h2>

                                <ul>

                                    ${character.quotes.map(quote => {
                                        let quoteText = quote;

                                        if (
                                            character.translations?.[getLanguage()]?.quotes &&
                                            Array.isArray(character.translations[getLanguage()].quotes)
                                        ) {
                                            const translatedIndex =
                                                character.quotes.indexOf(quote);

                                            quoteText =
                                                character.translations[getLanguage()].quotes[translatedIndex] ||
                                                quote;
                                        }

                                        return `
                                            <li>
                                                <blockquote>
                                                    ${quoteText}
                                                </blockquote>
                                            </li>
                                        `;
                                    }).join("")}

                                </ul>

                            </section>
                        `
                        : ""
                }

                <section class="related">

                    <h2>
                        ${t("profile.related")}
                    </h2>

                    <ul>

                        ${
                            localize(character, "home")
                                ? `
                                    <li>
                                        <a href="#/places/${character.homeId || slugify(character.home)}">
                                            ${localize(character, "home")}
                                        </a>
                                    </li>
                                `
                                : ""
                        }

                        ${
                            localize(character, "faction")
                                ? `
                                    <li>
                                        <a href="#/factions/${character.factionId || slugify(character.faction)}">
                                            ${localize(character, "faction")}
                                        </a>
                                    </li>
                                `
                                : ""
                        }

                    </ul>

                </section>

            </main>

        </div>

    </section>
`;
```

}

function updateFavoriteButton(button, isFavorite) {
if (!button) {
return;
}

```
button.textContent = isFavorite
    ? t("favorite.remove")
    : t("favorite.add");
```

}

export function initProfilePage() {
const image = document.getElementById("portraitImage");
const title = document.getElementById("portraitTitle");

```
document
    .querySelectorAll(".portrait-thumb")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".portrait-thumb")
                .forEach(item => {
                    item.classList.remove("active");
                });

            button.classList.add("active");

            if (image) {
                image.src = button.dataset.image || "";
            }

            if (title) {
                title.textContent = button.dataset.title || "";
            }

        });

    });

const favoriteButton = document.getElementById("favoriteButton");

if (!favoriteButton) {
    return;
}

favoriteButton.addEventListener("click", () => {

    let favorites = getFavorites();

    const id = favoriteButton.dataset.id;

    if (!id) {
        return;
    }

    if (favorites.includes(id)) {

        favorites = favorites.filter(
            favoriteId => favoriteId !== id
        );

    } else {

        favorites.push(id);

    }

    saveFavorites(favorites);

    updateFavoriteButton(
        favoriteButton,
        favorites.includes(id)
    );

});
```

}
