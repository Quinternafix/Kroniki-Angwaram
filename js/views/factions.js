import { getData } from "../core/api.js";
import { localize, t } from "../core/i18n.js";

export async function factionsView() {

    const factions = await getData("factions");

    return `

        <section class="factions-page">

            <h1>${t("factions.title")}</h1>

            <div class="cards-grid">

                ${factions.map(faction => {

                    const name = localize(faction, "name");
                    const description = localize(faction, "description");

                    return `

                        <article class="card">

                            <img
                                src="${faction.image || ""}"
                                alt="${name}"
                                class="card-image"
                            >

                            <div class="card-content">

                                <h2>
                                    ${name}
                                </h2>

                                ${
                                    description
                                        ? `<p>${description}</p>`
                                        : ""
                                }

                                <a
                                    href="#/factions/${encodeURIComponent(faction.id)}"
                                    class="card-button"
                                >
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
