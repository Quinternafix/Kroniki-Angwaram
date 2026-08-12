import { getData } from "../core/api.js";
import { localize, t } from "../core/i18n.js";

export async function placesView() {
    const places = await getData("locations");

    return `
        <h1>${t("places.title")}</h1>

        <div class="cards-grid">
            ${places.map(place => `
                <article class="card">

                    <img
                        src="${place.image}"
                        alt="${localize(place, "name")}"
                        class="card-image"
                    >

                    <h2>
                        ${localize(place, "name")}
                    </h2>

                    <p>
                        ${localize(place, "description")}
                    </p>

                    <a
                        href="#/places/${encodeURIComponent(place.id)}"
                        class="card-button"
                    >
                        ${t("common.open")}
                    </a>

                </article>
            `).join("")}
        </div>
    `;
}
