import { getData } from "../core/api.js";
import { getFavorites, saveFavorites } from "../core/storage.js";
import { localize, t } from "../core/i18n.js";

function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function renderPortraitGallery(character) {

    const portraits = character.portraits || [
        {
            title: "Obecnie",
            image: character.image
        }
    ];

    return `

<div class="portrait-panel">

    <img
        id="portraitImage"
        src="${portraits[0].image}"
        alt="${character.name}"
        class="profile-image">

    <div class="portrait-title">

${portraits[0].title?.[state.language] || portraits[0].title?.pl || portraits[0].title}

    </div>

    <div class="portrait-gallery">

        ${portraits.map((portrait,index)=>`

<button
class="portrait-thumb ${index===0?"active":""}"
data-image="${portrait.image}"
data-title="${portrait.title}">

${portrait.title?.[state.language] || portrait.title?.pl || portrait.title}

</button>

`).join("")}

    </div>

</div>

`;

}

function renderInfoBox(character) {

    return `

<aside class="wiki-infobox">

    <div class="wiki-header">

        <h2>${character.name}</h2>

        <p>${localize(character,"title")}</p>

    </div>

    <table class="wiki-table">

        <tr>
            <th>Rasa</th>
            <td>${localize(character,"race")}</td>
        </tr>

        <tr>
            <th>Naród</th>
            <td>${localize(character,"nation")}</td>
        </tr>

        <tr>
            <th>Frakcja</th>
            <td>

                <a href="#/factions/${character.factionId || slugify(character.faction)}">

                    ${localize(character,"faction")}

                </a>

            </td>
        </tr>

        <tr>
            <th>Ranga</th>
            <td>${localize(character,"rank")}</td>
        </tr>

        <tr>
            <th>Status</th>
            <td>${localize(character,"status")}</td>
        </tr>

        <tr>
            <th>Data urodzenia</th>
            <td>${localize(character,"birth")}</td>
        </tr>

        <tr>
            <th>Dom</th>
            <td>

                <a href="#/places/${character.homeId || slugify(character.home)}">

                    ${character.home}

                </a>

            </td>
        </tr>

    </table>

</aside>

`;

}

function renderRelations(title, list) {

    return `
        <section class="relations">

            <h2>${title}</h2>

            ${
                list.length
                ? `
                    <ul>

                        ${list.map(item => `
                            <li>
                                <a href="#/characters/${slugify(item)}">
                                    ${item}
                                </a>
                            </li>
                        `).join("")}

                    </ul>
                `
                : `<p>Brak danych.</p>`
            }

        </section>
    `;
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

    const favorites = getFavorites();
    const isFavorite = favorites.includes(character.id);

    return `

<section class="profile">

    <nav class="breadcrumbs">

        <a href="#/">Start</a>

        >

        <a href="#/characters">${t("characters.title")}</a>

        >

        <span>${character.name}</span>

    </nav>

    <div class="profile-layout">

        ${renderPortraitGallery(character)}

        <main class="profile-main">

            <header>

                <h1>${character.name}</h1>

                <h2>${localize(character,"title")}</h2>

                <p>${localize(character,"description")}</p>

                <button
                    id="favoriteButton"
                    data-id="${character.id}">

                    ${isFavorite
                        ? "★ Usuń z ulubionych"
                        : "⭐ Dodaj do ulubionych"}

                </button>

            </header>

            ${renderInfoBox(character)}

            ${renderRelations(
                "Przyjaciele",
                character.friends || []
            )}

            ${renderRelations(
                "Wrogowie",
                character.enemies || []
            )}

            <section class="related">

                <h2>Powiązane artykuły</h2>

                <ul>

                    <li>

                        <a href="#/places/${character.homeId || slugify(character.home)}">

                            ${character.home}

                        </a>

                    </li>

                    <li>

                        <a href="#/factions/${character.factionId || slugify(character.faction)}">

                            ${localize(character,"faction")}

                        </a>

                    </li>

                </ul>

            </section>

        </main>

    </div>

</section>

`;

}

export function initProfilePage(){

    const image=document.getElementById("portraitImage");

    const title=document.querySelector(".portrait-title");

    document
    .querySelectorAll(".portrait-thumb")
    .forEach(button=>{

        button.onclick=()=>{

            document
            .querySelectorAll(".portrait-thumb")
            .forEach(b=>b.classList.remove("active"));

            button.classList.add("active");

            image.src=button.dataset.image;

            title.textContent=button.dataset.title;

        };

    });

    const favoriteButton=document.getElementById("favoriteButton");

    if(!favoriteButton) return;

    favoriteButton.onclick=()=>{

        let favorites=getFavorites();

        const id=favoriteButton.dataset.id;

        if(favorites.includes(id)){

            favorites=favorites.filter(f=>f!==id);

        }

        else{

            favorites.push(id);

        }

        saveFavorites(favorites);

        favoriteButton.textContent=

            favorites.includes(id)

            ?"★ Usuń z ulubionych"

            :"⭐ Dodaj do ulubionych";

    };

}
