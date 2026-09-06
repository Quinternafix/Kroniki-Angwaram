import { getData } from "../core/api.js";
import { localize, t } from "../core/i18n.js";

/* Frakcje wykluczone z listy (miasta / państwa, nie organizacje) */
const EXCLUDED_FACTION_IDS = new Set([
    "zjednoczone-krolestwo-selidoru",
    "popielna-marchia"
]);

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function truncate(text, max = 110) {
    const s = String(text || "").trim();
    if (s.length <= max) return s;
    return s.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

function renderFactionCard(faction) {
    const name = localize(faction, "name") || faction.name || "";
    const description = localize(faction, "description") || "";
    const image = faction.image || "";
    const id = faction.id || "";

    const imageStyle = image
        ? `style="background-image: url('${escapeHtml(image)}')"`
        : "";

    return `
        <a
            href="#/factions/${encodeURIComponent(id)}"
            class="faction-tile"
            data-id="${escapeHtml(id)}"
        >
            <div class="faction-tile-media" ${imageStyle}>
                <div class="faction-tile-icon" aria-hidden="true">
                    <span class="faction-tile-people">👥</span>
                    <span class="faction-tile-dot"></span>
                </div>
            </div>

            <div class="faction-tile-bar">
                <h2 class="faction-tile-name">
                    ${escapeHtml(name)}
                </h2>
                ${
                    description
                        ? `
                            <p class="faction-tile-desc">
                                ${escapeHtml(truncate(description))}
                            </p>
                        `
                        : ""
                }
            </div>
        </a>
    `;
}

export async function factionsView() {
    const factions = await getData("factions");

    const visible = (Array.isArray(factions) ? factions : [])
        .filter(f => f && f.id && !EXCLUDED_FACTION_IDS.has(f.id))
        .sort((a, b) =>
            String(localize(a, "name") || a.name || "").localeCompare(
                String(localize(b, "name") || b.name || ""),
                undefined,
                { sensitivity: "base" }
            )
        );

    return `
        <section class="page factions-page">
            <header class="page-header">
                <h1>${escapeHtml(t("factions.title"))}</h1>
                <p class="factions-count">
                    ${visible.length}
                    ${escapeHtml(
                        visible.length === 1
                            ? "frakcja"
                            : "frakcji"
                    )}
                </p>
            </header>

            <div class="faction-grid">
                ${
                    visible.length
                        ? visible.map(renderFactionCard).join("")
                        : `
                            <div class="factions-empty">
                                ${escapeHtml(t("common.noData"))}
                            </div>
                        `
                }
            </div>
        </section>
    `;
}
