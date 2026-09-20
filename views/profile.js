import { getData } from "../core/api.js";
import {
    getFavorites,
    saveFavorites
} from "../core/storage.js";

import {
    getLanguage,
    localize,
    localizeValue,
    t
} from "../core/i18n.js";


function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getPortraitTitle(portrait) {
    if (!portrait || typeof portrait !== "object") {
        return "";
    }

    const translatedTitle = portrait.translations?.[getLanguage()]?.title;

    if (translatedTitle !== undefined && translatedTitle !== null && translatedTitle !== "") {
        return String(translatedTitle);
    }

    const localizedTitle = localizeValue(portrait.title);
    if (localizedTitle) {
        return localizedTitle;
    }

    const fallbackTitle = portrait.translations?.pl?.title;
    if (fallbackTitle !== undefined && fallbackTitle !== null && fallbackTitle !== "") {
        return String(fallbackTitle);
    }

    return "";
}


function renderPortraitGallery(character, displayName) {
    const portraits =
        Array.isArray(character.portraits) && character.portraits.length
            ? character.portraits
            : [
                {
                    title: {
                        pl: "Obecnie",
                        en: "Present",
                        es: "Actualidad"
                    },
                    image: character.image
                }
            ];

    const firstPortrait = portraits[0];
    const firstTitle = getPortraitTitle(firstPortrait);

    return `
        <div class="portrait-gallery-wrapper">
            <img
                id="portraitImage"
                src="${escapeHtml(firstPortrait?.image || character.image || "")}"
                alt="${escapeHtml(displayName)}"
                class="profile-image"
            >
            <div id="portraitTitle" class="portrait-title">
                ${escapeHtml(firstTitle)}
            </div>
            <div class="portrait-gallery">
                ${portraits.map((portrait, index) => {
                    const portraitTitle = getPortraitTitle(portrait);
                    return `
                        <button
                            type="button"
                            class="portrait-thumb ${index === 0 ? "active" : ""}"
                            data-image="${escapeHtml(portrait?.image || "")}"
                            data-title="${escapeHtml(portraitTitle)}"
                        >
                            ${escapeHtml(portraitTitle)}
                        </button>
                    `;
                }).join("")}
            </div>
        </div>
    `;
}


function renderInfoBox(character, displayName) {
    const homeName = localize(character, "home");
    const homeId = character.homeId || slugify(character.home);

    return `
        <section class="info-box">
            <div class="wiki-header">
                <h2>${escapeHtml(displayName)}</h2>
                <p>${escapeHtml(localize(character, "title"))}</p>
            </div>
            <table class="wiki-table">
                <tr>
                    <th>${escapeHtml(t("profile.race"))}</th>
                    <td>${escapeHtml(localize(character, "race"))}</td>
                </tr>
                <tr>
                    <th>${escapeHtml(t("profile.nation"))}</th>
                    <td>${escapeHtml(localize(character, "nation"))}</td>
                </tr>
                <tr>
                    <th>${escapeHtml(t("profile.faction"))}</th>
                    <td>
                        ${
                            character.factionId || character.faction
                                ? `<a href="#/factions/${escapeHtml(character.factionId || slugify(character.faction))}">
                                    ${escapeHtml(localize(character, "faction"))}
                                   </a>`
                                : escapeHtml(t("common.noData"))
                        }
                    </td>
                </tr>
                <tr>
                    <th>${escapeHtml(t("profile.rank"))}</th>
                    <td>${escapeHtml(localize(character, "rank"))}</td>
                </tr>
                <tr>
                    <th>${escapeHtml(t("profile.status"))}</th>
                    <td>${escapeHtml(localize(character, "status"))}</td>
                </tr>
                <tr>
                    <th>${escapeHtml(t("profile.birth"))}</th>
                    <td>${escapeHtml(localize(character, "birth"))}</td>
                </tr>
                <tr>
                    <th>${escapeHtml(t("profile.home"))}</th>
                    <td>
                        ${
                            homeName
                                ? `<a href="#/places/${escapeHtml(homeId)}">${escapeHtml(homeName)}</a>`
                                : escapeHtml(t("common.noData"))
                        }
                    </td>
                </tr>
            </table>
        </section>
    `;
}


function resolveCharacterId(item, characters) {
    const raw = String(item ?? "").trim();
    if (!raw) return "";

    const list = Array.isArray(characters) ? characters : [];

    let match = list.find(c => c.id === raw);
    if (match) return match.id;

    match = list.find(c => c.name === raw);
    if (match) return match.id;

    const rawLower = raw.toLowerCase();
    match = list.find(c => String(c.name || "").toLowerCase() === rawLower);
    if (match) return match.id;

    const itemSlug = slugify(raw);
    match = list.find(c => slugify(c.id) === itemSlug || slugify(c.name) === itemSlug);
    if (match) return match.id;

    return itemSlug;
}


const RELATION_TRANSLATIONS = {
    "ojciec":               { pl: "ojciec",               en: "father",          es: "padre" },
    "matka":                { pl: "matka",                en: "mother",          es: "madre" },
    "syn":                  { pl: "syn",                  en: "son",             es: "hijo" },
    "córka":                { pl: "córka",                en: "daughter",        es: "hija" },
    "brat":                 { pl: "brat",                 en: "brother",         es: "hermano" },
    "siostra":              { pl: "siostra",              en: "sister",          es: "hermana" },
    "dziadek":              { pl: "dziadek",              en: "grandfather",     es: "abuelo" },
    "babcia":               { pl: "babcia",               en: "grandmother",     es: "abuela" },
    "wnuk":                 { pl: "wnuk",                 en: "grandson",        es: "nieto" },
    "wnuczka":              { pl: "wnuczka",              en: "granddaughter",   es: "nieta" },
    "wujek":                { pl: "wujek",                en: "uncle",           es: "tío" },
    "ciocia":               { pl: "ciocia",               en: "aunt",            es: "tía" },
    "kuzyn":                { pl: "kuzyn",                en: "cousin",          es: "primo" },
    "kuzynka":              { pl: "kuzynka",              en: "cousin",          es: "prima" },
    "mąż":                  { pl: "mąż",                  en: "husband",         es: "esposo" },
    "żona":                 { pl: "żona",                 en: "wife",            es: "esposa" },
    "partner":              { pl: "partner",              en: "partner",         es: "pareja" },
    "partnerka":            { pl: "partnerka",            en: "partner",         es: "pareja" },
    "przybrany ojciec":     { pl: "przybrany ojciec",     en: "foster father",   es: "padre adoptivo" },
    "przybrana matka":      { pl: "przybrana matka",      en: "foster mother",   es: "madre adoptiva" },
    "ojczym":               { pl: "ojczym",               en: "stepfather",      es: "padrastro" },
    "macocha":              { pl: "macocha",              en: "stepmother",      es: "madrastra" },
    "przyrodni brat":       { pl: "przyrodni brat",       en: "half-brother",    es: "hermanastro" },
    "przyrodnia siostra":   { pl: "przyrodnia siostra",   en: "half-sister",     es: "hermanastra" }
};


function getRelationLabel(relation) {
    if (!relation) return "";

    if (typeof relation === "object" && !Array.isArray(relation)) {
        const lang = getLanguage();
        return relation[lang] || relation.pl || relation.en || Object.values(relation)[0] || "";
    }

    const key = String(relation).toLowerCase().trim();
    const translations = RELATION_TRANSLATIONS[key];

    if (translations) {
        const lang = getLanguage();
        return translations[lang] || translations.pl || relation;
    }

    return String(relation);
}


function renderRelations(titleKey, list, characters = []) {
    const title = t(titleKey);

    return `
        <section class="related">
            <h2>${escapeHtml(title)}</h2>
            ${
                Array.isArray(list) && list.length
                    ? `
                        <ul>
                            ${list.map(item => {
                                const isObject = item && typeof item === "object" && !Array.isArray(item);

                                const name = isObject
                                    ? (item.name || "")
                                    : String(item ?? "");

                                const relationRaw = isObject
                                    ? (item.relation || "")
                                    : "";

                                const relationLabel = getRelationLabel(relationRaw);
                                const id = resolveCharacterId(name, characters);

                                return `
                                    <li>
                                        ${relationLabel ? `<span class="relation">${escapeHtml(relationLabel)}</span> ` : ""}
                                        <a href="#/characters/${escapeHtml(id)}">
                                            ${escapeHtml(name)}
                                        </a>
                                    </li>
                                `;
                            }).join("")}
                        </ul>
                    `
                    : `<p>${escapeHtml(t("common.noData"))}</p>`
            }
        </section>
    `;
}


export async function profileView(id) {
    const characters = await getData("characters");
    const character = characters.find(c => c.id === id);

    if (!character) {
        return `
            <section class="profile-not-found">
                <h1>${escapeHtml(t("profile.notFound"))}</h1>
                <p>${escapeHtml(t("profile.notFoundDescription"))}</p>
            </section>
        `;
    }

    const displayName = localize(character, "name") || character.name || "";

    const favorites = getFavorites();
    const isFavorite = favorites.includes(character.id);

    const homeName = localize(character, "home");
    const homeId = character.homeId || slugify(character.home);

    const factionName = localize(character, "faction");
    const factionId = character.factionId || slugify(character.faction);

    return `
        <section class="profile">
            <nav class="breadcrumbs">
                <a href="#/">${escapeHtml(t("common.home"))}</a>
                <span>&gt;</span>
                <a href="#/characters">${escapeHtml(t("characters.title"))}</a>
                <span>&gt;</span>
                <span>${escapeHtml(displayName)}</span>
            </nav>

            <div class="profile-layout">
                ${renderPortraitGallery(character, displayName)}

                <main class="profile-main">
                    <header>
                        <h1>${escapeHtml(displayName)}</h1>
                        <h2>${escapeHtml(localize(character, "title"))}</h2>
                        <p>${escapeHtml(localize(character, "description"))}</p>

                        <button
                            type="button"
                            id="favoriteButton"
                            data-id="${escapeHtml(character.id)}"
                        >
                            ${isFavorite
                                ? escapeHtml(t("favorite.remove"))
                                : escapeHtml(t("favorite.add"))
                            }
                        </button>
                    </header>

                    ${renderInfoBox(character, displayName)}

                    ${renderRelations(
                        "profile.family",
                        character.family || [
                            ...(Array.isArray(character.parents) ? character.parents : []),
                            ...(Array.isArray(character.siblings) ? character.siblings : [])
                        ],
                        characters
                    )}

                    ${renderRelations("profile.friends", character.friends, characters)}
                    ${renderRelations("profile.enemies", character.enemies, characters)}

                    ${
                        Array.isArray(character.quotes) && character.quotes.length
                            ? `
                                <section class="related">
                                    <h2>${escapeHtml(t("profile.quotes"))}</h2>
                                    <ul>
                                        ${character.quotes.map((quote, index) => {
                                            const translated = character.translations?.[getLanguage()]?.quotes?.[index];
                                            const text = translated || quote;
                                            return `<li><em>„${escapeHtml(text)}”</em></li>`;
                                        }).join("")}
                                    </ul>
                                </section>
                            `
                            : ""
                    }

                    <section class="related">
                        <h2>${escapeHtml(t("profile.related"))}</h2>
                        <ul>
                            ${homeName ? `
                                <li>
                                    <a href="#/places/${escapeHtml(homeId)}">${escapeHtml(homeName)}</a>
                                </li>
                            ` : ""}
                            ${factionName ? `
                                <li>
                                    <a href="#/factions/${escapeHtml(factionId)}">${escapeHtml(factionName)}</a>
                                </li>
                            ` : ""}
                        </ul>
                    </section>
                </main>
            </div>
        </section>
    `;
}


export function initProfilePage() {
    const image = document.getElementById("portraitImage");
    const title = document.getElementById("portraitTitle");

    document.querySelectorAll(".portrait-thumb").forEach(button => {
        button.onclick = () => {
            if (image) {
                image.src = button.dataset.image || "";
            }
            if (title) {
                title.textContent = button.dataset.title || "";
            }

            document.querySelectorAll(".portrait-thumb").forEach(thumbnail => {
                thumbnail.classList.remove("active");
            });

            button.classList.add("active");
        };
    });

    const favoriteButton = document.getElementById("favoriteButton");

    if (favoriteButton) {
        favoriteButton.onclick = () => {
            const id = favoriteButton.dataset.id;
            let favorites = getFavorites();

            if (favorites.includes(id)) {
                favorites = favorites.filter(fav => fav !== id);
                favoriteButton.textContent = t("favorite.add");
            } else {
                favorites.push(id);
                favoriteButton.textContent = t("favorite.remove");
            }

            saveFavorites(favorites);
        };
    }
}
