import { getData } from "../core/api.js";

export async function factionView(id) {
    const factions = await getData("factions");
    const faction = factions.find(f => f.id === id);

    if (!faction) {
        return `
            <h1>Nie znaleziono frakcji.</h1>
            <p>Taka frakcja nie istnieje.</p>
        `;
    }

    return `
        <section class="profile">

            <nav class="breadcrumbs">
                <a href="#/">Start</a> &gt;
                <a href="#/factions">Frakcje</a> &gt;
                <span>${faction.name}</span>
            </nav>

            <div class="profile-header">
                <img src="${faction.image}" alt="${faction.name}" class="profile-image">

                <div>
                    <h1>${faction.name}</h1>
                    <p>${faction.description}</p>
                </div>
            </div>

            <section class="info-box">
                <h2>Członkowie</h2>
                <ul>
                    ${Array.isArray(faction.members) && faction.members.length
                        ? faction.members.map(member => `
                            <li><a href="#/characters/${member}">${member}</a></li>
                          `).join("")
                        : "<li>Brak danych</li>"
                    }
                </ul>
            </section>

        </section>
    `;
}