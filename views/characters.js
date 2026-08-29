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
