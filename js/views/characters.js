import { getData } from "../core/api.js";
import { state } from "../state.js";
import { getFavorites } from "../core/storage.js";
import {
    localize,
    t,
    getLanguage
} from "../core/i18n.js";

/* ==========================================================
   POMOCNICZE
   ========================================================== */

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getInitials(name) {
    if (!name) return "?";

    return String(name)
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join("");
}

function uniqueSorted(values) {
    return [...new Set(values.filter(Boolean))]
        .sort((a, b) =>
            String(a).localeCompare(String(b), getLanguage())
        );
}

/* ==========================================================
   KARTA POSTACI
   ========================================================== */

function renderCharacterCard(character, favorites) {
    const name = character.name || "";
    const title = localize(character, "title");
    const race = localize(character, "race");
    const nation = localize(character, "nation");
    const faction = localize(character, "faction");
    const status = localize(character, "status");

    const portrait =
        character.portraits?.[0]?.image ||
        character.image ||
        "";

    const isFavorite = favorites.includes(character.id);

    const imageHtml = portrait
        ? `
            <div class="character-image-wrap">
                <img
                    src="${escapeHtml(portrait)}"
                    alt="${escapeHtml(name)}"
                    class="character-image"
                    loading="lazy"
                >
            </div>
        `
        : `
            <div class="character-image-wrap placeholder">
                <span class="character-initials">
                    ${escapeHtml(getInitials(name))}
                </span>
            </div>
        `;

    return `
        <article
            class="character-card"
            data-name="${escapeHtml(name.toLowerCase())}"
            data-title="${escapeHtml(String(title).toLowerCase())}"
            data-race="${escapeHtml(String(race).toLowerCase())}"
            data-nation="${escapeHtml(String(nation).toLowerCase())}"
            data-faction="${escapeHtml(String(faction).toLowerCase())}"
            data-status="${escapeHtml(String(status).toLowerCase())}"
            data-favorite="${isFavorite ? "1" : "0"}"
        >

            ${imageHtml}

            <div class="character-content">

                ${
                    isFavorite
                        ? `<span class="character-fav" title="Ulubione">⭐</span>`
                        : ""
                }

                <h2 class="character-name">
                    ${escapeHtml(name)}
                </h2>

                ${
                    title
                        ? `
                            <p class="character-title">
                                ${escapeHtml(title)}
                            </p>
                        `
                        : ""
                }

                <div class="character-meta">
                    ${race ? `<span class="character-tag">${escapeHtml(race)}</span>` : ""}
                    ${nation ? `<span class="character-tag">${escapeHtml(nation)}</span>` : ""}
                    ${status ? `<span class="character-tag status">${escapeHtml(status)}</span>` : ""}
                </div>

                ${
                    faction
                        ? `
                            <p class="character-faction">
                                ${escapeHtml(faction)}
                            </p>
                        `
                        : ""
                }

                <a
                    href="#/characters/${encodeURIComponent(character.id)}"
                    class="character-button"
                >
                    ${escapeHtml(t("common.open"))}
                </a>

            </div>

        </article>
    `;
}

/* ==========================================================
   FILTRY
   ========================================================== */

function renderFilters(races, factions, statuses) {
    return `
        <div class="characters-filters">

            <div class="filter-group">
                <label for="filter-race">Rasa</label>
                <select id="filter-race">
                    <option value="">Wszystkie</option>
                    ${races.map(r =>
                        `<option value="${escapeHtml(r.toLowerCase())}">${escapeHtml(r)}</option>`
                    ).join("")}
                </select>
            </div>

            <div class="filter-group">
                <label for="filter-faction">Frakcja</label>
                <select id="filter-faction">
                    <option value="">Wszystkie</option>
                    ${factions.map(f =>
                        `<option value="${escapeHtml(f.toLowerCase())}">${escapeHtml(f)}</option>`
                    ).join("")}
                </select>
            </div>

            <div class="filter-group">
                <label for="filter-status">Status</label>
                <select id="filter-status">
                    <option value="">Wszystkie</option>
                    ${statuses.map(s =>
                        `<option value="${escapeHtml(s.toLowerCase())}">${escapeHtml(s)}</option>`
                    ).join("")}
                </select>
            </div>

            <div class="filter-group">
                <label for="filter-favorite">Ulubione</label>
                <select id="filter-favorite">
                    <option value="">Wszystkie</option>
                    <option value="1">Tylko ulubione</option>
                </select>
            </div>

            <div class="filter-group">
                <label for="filter-sort">Sortuj</label>
                <select id="filter-sort">
                    <option value="name-asc">A–Z</option>
                    <option value="name-desc">Z–A</option>
                    <option value="favorite">Ulubione najpierw</option>
                </select>
            </div>

        </div>
    `;
}

/* ==========================================================
   LOGIKA FILTROWANIA (po renderze)
   ========================================================== */

/** Handler wyszukiwania – trzymany globalnie, żeby dało się go odpiąć */
let charactersSearchHandler = null;

function initCharacterFilters() {
    const grid = document.querySelector(".character-grid");
    const counter = document.querySelector(".characters-count");

    if (!grid) return;

    const cards = [...grid.querySelectorAll(".character-card")];

    const raceSelect = document.getElementById("filter-race");
    const factionSelect = document.getElementById("filter-faction");
    const statusSelect = document.getElementById("filter-status");
    const favoriteSelect = document.getElementById("filter-favorite");
    const sortSelect = document.getElementById("filter-sort");

    function applyFilters() {
        // Po wyjściu ze strony siatka jest już poza DOM – nic nie rób
        if (!document.body.contains(grid)) {
            return;
        }

        const race = raceSelect?.value || "";
        const faction = factionSelect?.value || "";
        const status = statusSelect?.value || "";
        const favorite = favoriteSelect?.value || "";
        const sort = sortSelect?.value || "name-asc";
        const query = (state.search || "").toLowerCase().trim();

        let visible = cards.filter(card => {
            const name = card.dataset.name || "";
            const title = card.dataset.title || "";
            const cardRace = card.dataset.race || "";
            const cardNation = card.dataset.nation || "";
            const cardFaction = card.dataset.faction || "";
            const cardStatus = card.dataset.status || "";

            const matchQuery =
                !query ||
                name.includes(query) ||
                title.includes(query) ||
                cardRace.includes(query) ||
                cardNation.includes(query) ||
                cardFaction.includes(query) ||
                cardStatus.includes(query);

            const matchRace =
                !race || cardRace === race;

            const matchFaction =
                !faction || cardFaction === faction;

            const matchStatus =
                !status || cardStatus === status;

            const matchFavorite =
                !favorite || (card.dataset.favorite || "") === favorite;

            const show =
                matchQuery &&
                matchRace &&
                matchFaction &&
                matchStatus &&
                matchFavorite;

            card.style.display = show ? "" : "none";

            return show;
        });

        // Sortowanie
        visible.sort((a, b) => {
            if (sort === "favorite") {
                const favDiff =
                    Number(b.dataset.favorite || 0) -
                    Number(a.dataset.favorite || 0);

                if (favDiff !== 0) return favDiff;
            }

            const nameA = a.dataset.name || "";
            const nameB = b.dataset.name || "";

            if (sort === "name-desc") {
                return nameB.localeCompare(nameA, getLanguage());
            }

            return nameA.localeCompare(nameB, getLanguage());
        });

        visible.forEach(card => grid.appendChild(card));

        if (counter) {
            counter.textContent =
                visible.length === cards.length
                    ? `${visible.length} postaci`
                    : `Znaleziono ${visible.length} z ${cards.length}`;
        }
    }

    [
        raceSelect,
        factionSelect,
        statusSelect,
        favoriteSelect,
        sortSelect
    ].forEach(el => {
        if (el) {
            el.addEventListener("change", applyFilters);
        }
    });

    // Odpięcie poprzedniego handlera – bez wycieków przy wielokrotnym wejściu na stronę
    if (charactersSearchHandler) {
        window.removeEventListener("search-updated", charactersSearchHandler);
    }
    charactersSearchHandler = applyFilters;
    window.addEventListener("search-updated", charactersSearchHandler);

    applyFilters();
}

/* ==========================================================
   WIDOK
   ========================================================== */

export async function charactersView() {
    const characters = await getData("characters");
    const favorites = getFavorites();

    const races = uniqueSorted(
        characters.map(c => localize(c, "race"))
    );

    const factions = uniqueSorted(
        characters.map(c => localize(c, "faction"))
    );

    const statuses = uniqueSorted(
        characters.map(c => localize(c, "status"))
    );

    // sortowanie początkowe A-Z
    const sorted = [...characters].sort((a, b) =>
        String(a.name || "").localeCompare(
            String(b.name || ""),
            getLanguage()
        )
    );

    // init filtrów po wstawieniu HTML
    queueMicrotask(() => {
        initCharacterFilters();
    });

    return `
        <section class="page characters-page">

            <header class="page-header">
                <h1>${escapeHtml(t("characters.title"))}</h1>
                <p class="characters-count">
                    ${sorted.length} postaci
                </p>
            </header>

            ${renderFilters(races, factions, statuses)}

            <div class="character-grid">
                ${
                    sorted.length
                        ? sorted
                              .map(c =>
                                  renderCharacterCard(c, favorites)
                              )
                              .join("")
                        : `
                            <div class="characters-empty">
                                ${escapeHtml(t("common.noData"))}
                            </div>
                        `
                }
            </div>

        </section>
    `;
}
