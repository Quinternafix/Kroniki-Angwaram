import { getData } from "../core/api.js";

export async function factionsView() {
    const factions = await getData("factions");

    return `
        <h1>Frakcje</h1>

        <div class="cards-grid">
            ${factions.map(faction => `
                <article class="card">
                    <img src="${faction.image}" alt="${faction.name}" class="card-image">
                    <h2>${faction.name}</h2>
                    <p>${faction.description}</p>
                    <a href="#/factions/${faction.id}" class="card-button">Otwórz profil</a>
                </article>
            `).join("")}
        </div>
    `;
}