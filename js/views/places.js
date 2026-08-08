import { getData } from "../core/api.js";
import { localize, t } from "../core/i18n.js";

export async function placesView() {

    const places = await getData("places");

    return `

        <section class="places-page">

            <h1>
                ${t("places.title")}
            </h1>

            <div class="cards-grid">

                ${places.map(place => {

                    const name = localize(place, "name");
                    const description = localize(place, "description");

                    return `

                        <article class="card">

                            <img
                                src="${place.image || ""}"
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
                                    href="#/places/${encodeURIComponent(place.id)}"
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
