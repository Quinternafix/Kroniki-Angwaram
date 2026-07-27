import { getData } from "../core/api.js";

export async function placeView(id) {
    const places = await getData("places");
    const place = places.find(p => p.id === id);

    if (!place) {
        return `
            <h1>Nie znaleziono miejsca.</h1>
            <p>Takie miejsce nie istnieje.</p>
        `;
    }

    return `
        <section class="profile">

            <nav class="breadcrumbs">
                <a href="#/">Start</a> &gt;
                <a href="#/places">Miejsca</a> &gt;
                <span>${place.name}</span>
            </nav>

            <div class="profile-header">
                <img src="${place.image}" alt="${place.name}" class="profile-image">

                <div>
                    <h1>${place.name}</h1>
                    <p>${place.description}</p>
                </div>
            </div>

            <section class="info-box">
                <h2>Powiązane postacie</h2>
                <ul>
                    ${Array.isArray(place.relatedCharacters) && place.relatedCharacters.length
                        ? place.relatedCharacters.map(characterId => `
                            <li><a href="#/characters/${characterId}">${characterId}</a></li>
                          `).join("")
                        : "<li>Brak danych</li>"
                    }
                </ul>
            </section>

            <section class="related">
                <h2>Powiązane frakcje</h2>
                <ul>
                    ${Array.isArray(place.relatedFactions) && place.relatedFactions.length
                        ? place.relatedFactions.map(factionId => `
                            <li><a href="#/factions/${factionId}">${factionId}</a></li>
                          `).join("")
                        : "<li>Brak danych</li>"
                    }
                </ul>
            </section>

        </section>
    `;
}