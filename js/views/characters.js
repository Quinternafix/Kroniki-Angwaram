import { getData } from "../core/api.js";

export async function charactersView() {

    const characters = await getData("characters");

    return `
        <h1>Postacie</h1>

        <div class="character-list">

            ${characters.map(character => `

                <div class="character-card">

                    <img src="${character.image}" alt="${character.name}">

                    <h2>${character.name}</h2>

                    <p>${character.title}</p>

                    <button data-id="${character.id}">
                        Więcej
                    </button>

                </div>

            `).join("")}

        </div>
    `;
}