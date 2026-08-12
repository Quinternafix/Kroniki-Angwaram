import { getData } from "../core/api.js";
import { localize, t } from "../core/i18n.js";

export async function placeView(id) {

    const places = await getData("locations");

    const place = places.find(
        item => item.id === id
    );

    if (!place) {

        return `
            <section class="error-page">

                <h1>404</h1>

                <p>
                    ${t("notFound")}
                </p>

            </section>
        `;
    }

    const [
        characters,
        factions
    ] = await Promise.all([
        getData("characters"),
        getData("factions")
    ]);

    const characterList =
        Array.isArray(place.relatedCharacters)
            ? place.relatedCharacters
            : [];

    const factionList =
        Array.isArray(place.relatedFactions)
            ? place.relatedFactions
            : [];

    return `

        <section class="profile">

            <nav class="breadcrumbs">

                <a href="#/">
                    ${t("common.home")}
                </a>

                &gt;

                <a href="#/places">
                    ${t("places.title")}
                </a>

                &gt;

                <span>
                    ${localize(place, "name")}
                </span>

            </nav>


            <div class="profile-header">

                <img
                    src="${place.image || ""}"
                    alt="${localize(place, "name")}"
                    class="profile-image"
                >

                <div>

                    <h1>
                        ${localize(place, "name")}
                    </h1>

                    <p>
                        ${localize(place, "description")}
                    </p>

                </div>

            </div>


            <section class="info-box">

                <h2>
                    ${t("place.characters")}
                </h2>

                ${
                    characterList.length
                        ? `
                            <ul>

                                ${characterList.map(characterId => {

                                    const character =
                                        characters.find(
                                            item =>
                                                item.id === characterId
                                        );

                                    if (!character) {

                                        return `
                                            <li>
                                                ${characterId}
                                            </li>
                                        `;
                                    }

                                    const name =
                                        localize(
                                            character,
                                            "name"
                                        ) || character.name;

                                    return `
                                        <li>
                                            <a
                                                href="#/characters/${encodeURIComponent(character.id)}"
                                            >
                                                ${name}
                                            </a>
                                        </li>
                                    `;

                                }).join("")}

                            </ul>
                        `
                        : `
                            <p>
                                ${t("common.noData")}
                            </p>
                        `
                }

            </section>


            <section class="related">

                <h2>
                    ${t("place.factions")}
                </h2>

                ${
                    factionList.length
                        ? `
                            <ul>

                                ${factionList.map(factionId => {

                                    const faction =
                                        factions.find(
                                            item =>
                                                item.id === factionId
                                        );

                                    if (!faction) {

                                        return `
                                            <li>
                                                ${factionId}
                                            </li>
                                        `;
                                    }

                                    return `
                                        <li>
                                            <a
                                                href="#/factions/${encodeURIComponent(faction.id)}"
                                            >
                                                ${localize(
                                                    faction,
                                                    "name"
                                                )}
                                            </a>
                                        </li>
                                    `;

                                }).join("")}

                            </ul>
                        `
                        : `
                            <p>
                                ${t("common.noData")}
                            </p>
                        `
                }

            </section>

        </section>

    `;
}
