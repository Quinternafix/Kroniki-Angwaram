import { getData } from "../core/api.js";
import { getFavorites, saveFavorites } from "../core/storage.js";

function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function profileView(id) {
    const characters = await getData("characters");
    const character = characters.find(c => c.id === id);

    if (!character) {
        return `
            <h1>Nie znaleziono postaci.</h1>
            <p>Taka postać nie istnieje.</p>
        `;
    }

    const friends = Array.isArray(character.friends) ? character.friends : [];
    const enemies = Array.isArray(character.enemies) ? character.enemies : [];
    const favorites = getFavorites();
    const isFavorite = favorites.includes(character.id);

    return `
        <section class="profile">

            <nav class="breadcrumbs">
                <a href="#/">Start</a> &gt;
                <a href="#/characters">Postacie</a> &gt;
                <span>${character.name}</span>
            </nav>

            <div class="profile-header">
                <img src="${character.image}" alt="${character.name}" class="profile-image">

                <div>
                    <h1>${character.name}</h1>
                    <h2>${character.title}</h2>
                    <p>${character.description}</p>

                    <button
                        class="favorite-button"
                        data-id="${character.id}">
                        ${isFavorite ? "★ Usuń z ulubionych" : "⭐ Dodaj do ulubionych"}
                    </button>
                </div>
            </div>

            <section class="info-box">
                <h2>Informacje</h2>
                <ul>
                    <li><strong>Rasa:</strong> ${character.race}</li>
                    <li><strong>Naród:</strong> ${character.nation}</li>
                    <li><strong>Frakcja:</strong> ${character.faction}</li>
                    <li><strong>Ranga:</strong> ${character.rank}</li>
                    <li><strong>Status:</strong> ${character.status}</li>
                    <li><strong>Data urodzenia:</strong> ${character.birth}</li>
                </ul>
            </section>

            <section class="relations">
                <h2>Przyjaciele</h2>
                ${
                    friends.length
                        ? `<ul>
                            ${friends.map(friend => `
                                <li>
                                    <a href="#/characters/${slugify(friend)}">${friend}</a>
                                </li>
                            `).join("")}
                          </ul>`
                        : `<p>Brak</p>`
                }

                <h2>Wrogowie</h2>
                ${
                    enemies.length
                        ? `<ul>
                            ${enemies.map(enemy => `
                                <li>
                                    <a href="#/characters/${slugify(enemy)}">${enemy}</a>
                                </li>
                            `).join("")}
                          </ul>`
                        : `<p>Brak</p>`
                }
            </section>

            <section class="related">
                <h2>Powiązane artykuły</h2>
                <ul>
                    ${
                        character.home
                            ? `<li>
                                <a href="#/places/${slugify(character.home)}">
                                    ${character.home}
                                </a>
                            </li>`
                            : ""
                    }
                    ${
                        character.faction
                            ? `<li>
                                <a href="#/factions/${slugify(character.faction)}">
                                    ${character.faction}
                                </a>
                            </li>`
                            : ""
                    }
                </ul>
            </section>

        </section>
    `;
}