import { getData } from "../core/api.js";
import {
    getFavorites,
    saveFavorites
} from "../core/storage.js";

import {
    getLanguage,
    localize,
    localizeValue,
    t
} from "../core/i18n.js";


function slugify(value) {

    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getPortraitTitle(portrait) {

    if (
        !portrait ||
        typeof portrait !== "object"
    ) {
        return "";
    }

    const translatedTitle =
        portrait.translations?.[
            getLanguage()
        ]?.title;

    if (
        translatedTitle !== undefined &&
        translatedTitle !== null &&
        translatedTitle !== ""
    ) {
        return String(translatedTitle);
    }

    const localizedTitle =
        localizeValue(portrait.title);

    if (localizedTitle) {
        return localizedTitle;
    }

    const fallbackTitle =
        portrait.translations?.pl?.title;

    if (
        fallbackTitle !== undefined &&
        fallbackTitle !== null &&
        fallbackTitle !== ""
    ) {
        return String(fallbackTitle);
    }

    return "";
}


function renderPortraitGallery(character) {

    const portraits =
        Array.isArray(character.portraits) &&
        character.portraits.length
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

    const firstPortrait =
        portraits[0];

    const firstTitle =
        getPortraitTitle(
            firstPortrait
        );

    return `

        <div class="portrait-gallery-wrapper">

            <img
                id="portraitImage"
                src="${escapeHtml(
                    firstPortrait?.image ||
                    character.image ||
                    ""
                )}"
                alt="${escapeHtml(
                    character.name
                )}"
                class="profile-image"
            >

            <div
                id="portraitTitle"
                class="portrait-title"
            >
                ${escapeHtml(firstTitle)}
            </div>

            <div class="portrait-gallery">

                ${portraits.map(
                    (portrait, index) => {

                        const portraitTitle =
                            getPortraitTitle(
                                portrait
                            );

                        return `

                            <button
                                type="button"
                                class="portrait-thumb ${
                                    index === 0
                                        ? "active"
                                        : ""
                                }"
                                data-image="${escapeHtml(
                                    portrait?.image ||
                                    ""
                                )}"
                                data-title="${escapeHtml(
                                    portraitTitle
                                )}"
                            >
                                ${escapeHtml(
                                    portraitTitle
                                )}
                            </button>

                        `;
                    }
                ).join("")}

            </div>

        </div>

    `;
}


function renderInfoBox(character) {

    const homeName =
        localize(
            character,
            "home"
        );

    const homeId =
        character.homeId ||
        slugify(character.home);

    return `

        <section class="info-box">

            <div class="wiki-header">

                <h2>
                    ${escapeHtml(
                        character.name
                    )}
                </h2>

                <p>
                    ${escapeHtml(
                        localize(
                            character,
                            "title"
                        )
                    )}
                </p>

            </div>

            <table class="wiki-table">

                <tr>

                    <th>
                        ${escapeHtml(
                            t("profile.race")
                        )}
                    </th>

                    <td>
                        ${escapeHtml(
                            localize(
                                character,
                                "race"
                            )
                        )}
                    </td>

                </tr>

                <tr>

                    <th>
                        ${escapeHtml(
                            t("profile.nation")
                        )}
                    </th>

                    <td>
                        ${escapeHtml(
                            localize(
                                character,
                                "nation"
                            )
                        )}
                    </td>

                </tr>

                <tr>

                    <th>
                        ${escapeHtml(
                            t("profile.faction")
                        )}
                    </th>

                    <td>

                        ${
                            character.factionId ||
                            character.faction
                                ? `
                                    <a href="#/factions/${escapeHtml(
                                        character.factionId ||
                                        slugify(
                                            character.faction
                                        )
                                    )}">
                                        ${escapeHtml(
                                            localize(
                                                character,
                                                "faction"
                                            )
                                        )}
                                    </a>
                                `
                                : escapeHtml(
                                    t("common.noData")
                                )
                        }

                    </td>

                </tr>

                <tr>

                    <th>
                        ${escapeHtml(
                            t("profile.rank")
                        )}
                    </th>

                    <td>
                        ${escapeHtml(
                            localize(
                                character,
                                "rank"
                            )
                        )}
                    </td>

                </tr>

                <tr>

                    <th>
                        ${escapeHtml(
                            t("profile.status")
                        )}
                    </th>

                    <td>
                        ${escapeHtml(
                            localize(
                                character,
                                "status"
                            )
                        )}
                    </td>

                </tr>

                <tr>

                    <th>
                        ${escapeHtml(
                            t("profile.birth")
                        )}
                    </th>

                    <td>
                        ${escapeHtml(
                            localize(
                                character,
                                "birth"
                            )
                        )}
                    </td>

                </tr>

                <tr>

                    <th>
                        ${escapeHtml(
                            t("profile.home")
                        )}
                    </th>

                    <td>

                        ${
                            homeName
                                ? `
                                    <a href="#/places/${escapeHtml(
                                        homeId
                                    )}">
                                        ${escapeHtml(
                                            homeName
                                        )}
                                    </a>
                                `
                                : escapeHtml(
                                    t("common.noData")
                                )
                        }

                    </td>

                </tr>

            </table>

        </section>

    `;
}


function renderRelations(
    titleKey,
    list
) {

    const title =
        t(titleKey);

    return `

        <section class="related">

            <h2>
                ${escapeHtml(title)}
            </h2>

            ${
                Array.isArray(list) &&
                list.length
                    ? `
                        <ul>

                            ${list.map(
                                item => `

                                    <li>

                                        <a
                                            href="#/characters/${escapeHtml(
                                                slugify(item)
                                            )}"
                                        >
                                            ${escapeHtml(item)}
                                        </a>

                                    </li>

                                `
                            ).join("")}

                        </ul>
                    `
                    : `
                        <p>
                            ${escapeHtml(
                                t("common.noData")
                            )}
                        </p>
                    `
            }

        </section>

    `;
}


export async function profileView(id) {

    const characters =
        await getData("characters");

    const character =
        characters.find(
            character =>
                character.id === id
        );


    if (!character) {

        return `

            <section class="profile-not-found">

                <h1>
                    ${escapeHtml(
                        t("profile.notFound")
                    )}
                </h1>

                <p>
                    ${escapeHtml(
                        t(
                            "profile.notFoundDescription"
                        )
                    )}
                </p>

            </section>

        `;
    }


    const favorites =
        getFavorites();

    const isFavorite =
        favorites.includes(
            character.id
        );


    const homeName =
        localize(
            character,
            "home"
        );

    const homeId =
        character.homeId ||
        slugify(character.home);


    const factionName =
        localize(
            character,
            "faction"
        );

    const factionId =
        character.factionId ||
        slugify(character.faction);


    return `

        <section class="profile">

            <nav class="breadcrumbs">

                <a href="#/">
                    ${escapeHtml(
                        t("common.home")
                    )}
                </a>

                <span>&gt;</span>

                <a href="#/characters">
                    ${escapeHtml(
                        t("characters.title")
                    )}
                </a>

                <span>&gt;</span>

                <span>
                    ${escapeHtml(
                        character.name
                    )}
                </span>

            </nav>


            <div class="profile-layout">

                ${renderPortraitGallery(
                    character
                )}


                <main class="profile-main">

                    <header>

                        <h1>
                            ${escapeHtml(
                                character.name
                            )}
                        </h1>

                        <h2>
                            ${escapeHtml(
                                localize(
                                    character,
                                    "title"
                                )
                            )}
                        </h2>

                        <p>
                            ${escapeHtml(
                                localize(
                                    character,
                                    "description"
                                )
                            )}
                        </p>


                        <button
                            type="button"
                            id="favoriteButton"
                            data-id="${escapeHtml(
                                character.id
                            )}"
                        >

                            ${
                                isFavorite
                                    ? escapeHtml(
                                        t(
                                            "favorite.remove"
                                        )
                                    )
                                    : escapeHtml(
                                        t(
                                            "favorite.add"
                                        )
                                    )
                            }

                        </button>

                    </header>


                    ${renderInfoBox(
                        character
                    )}


                    ${renderRelations(
                        "profile.friends",
                        character.friends || []
                    )}


                    ${renderRelations(
                        "profile.enemies",
                        character.enemies || []
                    )}


                    <section class="related">

                        <h2>
                            ${escapeHtml(
                                t(
                                    "profile.related"
                                )
                            )}
                        </h2>

                        <ul>

                            ${
                                homeName
                                    ? `
                                        <li>

                                            <a href="#/places/${escapeHtml(
                                                homeId
                                            )}">
                                                ${escapeHtml(
                                                    homeName
                                                )}
                                            </a>

                                        </li>
                                    `
                                    : ""
                            }


                            ${
                                factionName
                                    ? `
                                        <li>

                                            <a href="#/factions/${escapeHtml(
                                                factionId
                                            )}">
                                                ${escapeHtml(
                                                    factionName
                                                )}
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
}


export function initProfilePage() {

    const image =
        document.getElementById(
            "portraitImage"
        );

    const title =
        document.getElementById(
            "portraitTitle"
        );


    document
        .querySelectorAll(
            ".portrait-thumb"
        )
        .forEach(button => {

            button.onclick = () => {

                if (image) {

                    image.src =
                        button.dataset.image ||
                        "";

                }


                if (title) {

                    title.textContent =
                        button.dataset.title ||
                        "";

                }


                document
                    .querySelectorAll(
                        ".portrait-thumb"
                    )
                    .forEach(
                        thumbnail => {

                            thumbnail.classList
                                .remove(
                                    "active"
                                );

                        }
                    );


                button.classList.add(
                    "active"
                );

            };

        });


    const favoriteButton =
        document.getElementById(
            "favoriteButton"
        );


    if (!favoriteButton) {
        return;
    }


    favoriteButton.onclick = () => {

        let favorites =
            getFavorites();

        const id =
            favoriteButton.dataset.id;


        if (!id) {
            return;
        }


        if (
            favorites.includes(id)
        ) {

            favorites =
                favorites.filter(
                    favoriteId =>
                        favoriteId !== id
                );

        } else {

            favorites.push(id);

        }


        saveFavorites(
            favorites
        );


        favoriteButton.textContent =
            favorites.includes(id)
                ? t(
                    "favorite.remove"
                )
                : t(
                    "favorite.add"
                );

    };

}
