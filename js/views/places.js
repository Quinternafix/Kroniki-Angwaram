import { getData } from "../core/api.js";

export async function placesView() {
    const places = await getData("places");

    return `
        <h1>Miejsca</h1>

        <div class="cards-grid">
            ${places.map(place => `
                <article class="card">
                    <img src="${place.image}" alt="${place.name}" class="card-image">
                    <h2>${place.name}</h2>
                    <p>${place.description}</p>
                    <a href="#/places/${place.id}" class="card-button">Otwórz profil</a>
                </article>
            `).join("")}
        </div>
    `;
}