import { getData } from "../core/api.js";
import { t, localize } from "../core/i18n.js";

export async function factionsView() {

    const factions = await getData("factions");

    return `

        <section class="factions-page">

            <h1 data-i18n="factions.title">
                ${t("factions.title")}
            </h1>

            <div class="faction-list">

                ${factions.map(faction => {

                    const name = localize(faction, "name");
                    const description = localize(faction, "description");

                    return `

                        <article class="faction-card">

                            <h2>${name}</h2>

                            ${
                                description
                                    ? `<p>${description}</p>`
                                    : ""
                            }

                            <a
                                href="#/factions/${encodeURIComponent(faction.id)}"
                                class="faction-button"
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
