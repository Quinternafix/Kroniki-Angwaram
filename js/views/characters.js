import { getData } from "../core/api.js";
import { state } from "../state.js";

export async function charactersView() {
    const characters = await getData("characters");

    const filtered = characters.filter(character => {
        const q = (state.search || "").toLowerCase();
        return (
            character.name.toLowerCase().includes(q) ||
            character.title.toLowerCase().includes(q)
        );
    });

    return `
        <h1>Postacie</h1>

        <div class="character-list">
            ${filtered.map(character => `
                <article class="character-card">
                    <img
                        src="${character.image}"
                        alt="${character.name}"
                        class="character-image">

                    <h2>${character.name}</h2>
                    <p>${character.title}</p>

                    <a href="#/characters/${character.id}" class="character-button">
                        Otwórz profil
                    </a>
                </article>
            `).join("")}
        </div>
    `;
}