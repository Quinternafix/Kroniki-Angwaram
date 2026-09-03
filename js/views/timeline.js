import { getData } from "../core/api.js";
import { getLanguage, t } from "../core/i18n.js";

/* ==========================================================
   POMOCNICZE
   ========================================================== */

function localizeTimeline(item, field) {
    if (!item || !item[field]) {
        return "";
    }

    const value = item[field];

    if (typeof value === "string") {
        return value;
    }

    const language = getLanguage();

    return (
        value[language] ||
        value.pl ||
        value.en ||
        value.es ||
        ""
    );
}

function getYearValue(year) {
    const value = Number.parseInt(String(year), 10);
    return Number.isNaN(value) ? 0 : value;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function timelineText(key, fallback) {
    const translated = t(key);

    if (translated && translated !== key) {
        return translated;
    }

    const language = getLanguage();

    return fallback[language] || fallback.pl || "";
}

/** Próg (lata) powyżej którego wstawiamy separator epoki */
const ERA_GAP_YEARS = 150;

/* ==========================================================
   RELACJE (postacie / miejsca / frakcje)
   ========================================================== */

function renderRelations(story) {
    let html = "";

    const blocks = [
        {
            key: "characters",
            i18n: "timeline.characters",
            fallback: { pl: "Postacie", en: "Characters", es: "Personajes" },
            items: story.characters
        },
        {
            key: "locations",
            i18n: "timeline.locations",
            fallback: { pl: "Miejsca", en: "Locations", es: "Lugares" },
            items: story.locations
        },
        {
            key: "factions",
            i18n: "timeline.factions",
            fallback: { pl: "Frakcje", en: "Factions", es: "Facciones" },
            items: story.factions
        }
    ];

    for (const block of blocks) {
        if (!Array.isArray(block.items) || !block.items.length) {
            continue;
        }

        html += `
            <div class="timeline-story-relations">
                <strong>
                    ${escapeHtml(timelineText(block.i18n, block.fallback))}
                </strong>
                <div class="timeline-story-tags">
                    ${block.items
                        .map(item => `<span>${escapeHtml(item)}</span>`)
                        .join("")}
                </div>
            </div>
        `;
    }

    return html;
}

/* ==========================================================
   MARKER (ikona wg typu)
   ========================================================== */

function renderMarker(type) {
    const isStory = type === "story";
    const icon = isStory ? "✦" : "◆";
    const label = isStory
        ? timelineText("timeline.story", {
              pl: "Opowiadanie",
              en: "Story",
              es: "Relato"
          })
        : timelineText("timeline.event", {
              pl: "Wydarzenie",
              en: "Event",
              es: "Evento"
          });

    return `
        <div
            class="timeline-marker timeline-marker--${isStory ? "story" : "event"}"
            title="${escapeHtml(label)}"
            aria-hidden="true"
        >
            <span class="timeline-marker-icon">${icon}</span>
        </div>
    `;
}

/* ==========================================================
   SEPARATOR EPOKI
   ========================================================== */

function renderEraSeparator(fromYear, toYear) {
    const from = fromYear ?? "—";
    const to = toYear ?? "—";

    return `
        <div class="timeline-era" role="separator">
            <div class="timeline-era-line"></div>
            <div class="timeline-era-label">
                ${escapeHtml(String(from))}
                <span class="timeline-era-sep">→</span>
                ${escapeHtml(String(to))}
            </div>
            <div class="timeline-era-line"></div>
        </div>
    `;
}

/* ==========================================================
   OPOWIADANIE
   ========================================================== */

function renderStoryContent(story) {
    const title = localizeTimeline(story, "title");
    const summary = localizeTimeline(story, "summary");
    const content = localizeTimeline(story, "content");

    const paragraphs = String(content || "")
        .split(/\n\s*\n/)
        .map(paragraph => paragraph.trim())
        .filter(Boolean)
        .map(
            paragraph =>
                `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`
        )
        .join("");

    let html = `
        <details class="timeline-story">
            <summary class="timeline-story-summary">
    `;

    if (story.cover) {
        html += `
                <div class="timeline-story-cover">
                    <img
                        src="${escapeHtml(story.cover)}"
                        alt="${escapeHtml(title)}"
                        loading="lazy"
                    >
                </div>
        `;
    }

    html += `
                <div class="timeline-story-summary-content">
                    <div class="timeline-story-label">
                        ${escapeHtml(
                            timelineText("timeline.story", {
                                pl: "Opowiadanie",
                                en: "Story",
                                es: "Relato"
                            })
                        )}
                    </div>
                    <h2>${escapeHtml(title)}</h2>
    `;

    if (story.date) {
        html += `
                    <div class="timeline-story-date">
                        ${escapeHtml(story.date)}
                    </div>
        `;
    }

    if (story.author) {
        html += `
                    <div class="timeline-story-author">
                        ${escapeHtml(story.author)}
                    </div>
        `;
    }

    if (summary) {
        html += `
                    <p class="timeline-story-summary-text">
                        ${escapeHtml(summary)}
                    </p>
        `;
    }

    html += `
                    <span class="timeline-story-read">
                        ${escapeHtml(
                            timelineText("timeline.readStory", {
                                pl: "Czytaj opowiadanie",
                                en: "Read story",
                                es: "Leer relato"
                            })
                        )}
                    </span>
                </div>
            </summary>

            <div class="timeline-story-content">
    `;

    if (story.cover) {
        html += `
                <img
                    class="timeline-story-open-cover"
                    src="${escapeHtml(story.cover)}"
                    alt="${escapeHtml(title)}"
                    loading="lazy"
                >
        `;
    }

    html += `
                <header class="timeline-story-header">
                    <div class="timeline-story-type">
                        ${escapeHtml(
                            timelineText("timeline.story", {
                                pl: "Opowiadanie",
                                en: "Story",
                                es: "Relato"
                            })
                        )}
                    </div>
                    <h2>${escapeHtml(title)}</h2>
    `;

    if (story.date || story.author) {
        html += `<div class="timeline-story-meta">`;

        if (story.date) {
            html += `<span>${escapeHtml(story.date)}</span>`;
        }

        if (story.author) {
            html += `<span>${escapeHtml(story.author)}</span>`;
        }

        html += `</div>`;
    }

    html += `</header>`;

    if (summary) {
        html += `
                <div class="timeline-story-intro">
                    ${escapeHtml(summary)}
                </div>
        `;
    }

    html += `
                <div class="timeline-story-text">
                    ${paragraphs}
                </div>
                ${renderRelations(story)}
            </div>
        </details>
    `;

    return html;
}

/* ==========================================================
   WPIS: EVENT
   ========================================================== */

function renderTimelineEvent(event) {
    const title = localizeTimeline(event, "title");
    const description = localizeTimeline(event, "description");

    return `
        <article
            class="timeline-event timeline-entry"
            data-type="event"
            data-year="${escapeHtml(String(event.year ?? ""))}"
        >
            ${renderMarker("event")}

            <div class="timeline-content timeline-content--event">
                <div class="timeline-meta-row">
                    <span class="timeline-year">
                        ${escapeHtml(event.year ?? "—")}
                    </span>
                    <span class="timeline-entry-type">
                        ${escapeHtml(
                            timelineText("timeline.event", {
                                pl: "Wydarzenie",
                                en: "Event",
                                es: "Evento"
                            })
                        )}
                    </span>
                </div>

                <h2>${escapeHtml(title)}</h2>

                ${
                    description
                        ? `<p class="timeline-event-desc">${escapeHtml(description)}</p>`
                        : ""
                }
            </div>
        </article>
    `;
}

/* ==========================================================
   WPIS: STORY
   ========================================================== */

function renderTimelineStory(entry) {
    return `
        <article
            class="timeline-event timeline-entry timeline-entry--story"
            data-type="story"
            data-year="${escapeHtml(String(entry.year ?? ""))}"
        >
            ${renderMarker("story")}

            <div class="timeline-content timeline-content--story">
                <div class="timeline-meta-row">
                    <span class="timeline-year">
                        ${escapeHtml(entry.year ?? "—")}
                    </span>
                    <span class="timeline-entry-type timeline-entry-type--story">
                        ${escapeHtml(
                            timelineText("timeline.story", {
                                pl: "Opowiadanie",
                                en: "Story",
                                es: "Relato"
                            })
                        )}
                    </span>
                </div>

                ${renderStoryContent(entry)}
            </div>
        </article>
    `;
}

function renderTimelineEntry(entry) {
    if (entry && entry.type === "story") {
        return renderTimelineStory(entry);
    }
    return renderTimelineEvent(entry);
}

/* ==========================================================
   BUDOWANIE LISTY Z SEPARATORAMI EPOK
   ========================================================== */

function buildTimelineHtml(sortedEvents) {
    let html = "";
    let prevYear = null;

    for (const entry of sortedEvents) {
        const year = getYearValue(entry.year);

        if (
            prevYear !== null &&
            year - prevYear >= ERA_GAP_YEARS
        ) {
            html += renderEraSeparator(prevYear, year);
        }

        html += renderTimelineEntry(entry);
        prevYear = year;
    }

    return html;
}

/* ==========================================================
   FILTRY (chipy)
   ========================================================== */

function renderFilters() {
    return `
        <div class="timeline-filters" role="group" aria-label="Filter timeline">
            <button
                type="button"
                class="timeline-filter-chip is-active"
                data-filter="all"
            >
                ${escapeHtml(
                    timelineText("timeline.filterAll", {
                        pl: "Wszystkie",
                        en: "All",
                        es: "Todos"
                    })
                )}
            </button>
            <button
                type="button"
                class="timeline-filter-chip"
                data-filter="event"
            >
                ${escapeHtml(
                    timelineText("timeline.event", {
                        pl: "Wydarzenia",
                        en: "Events",
                        es: "Eventos"
                    })
                )}
            </button>
            <button
                type="button"
                class="timeline-filter-chip"
                data-filter="story"
            >
                ${escapeHtml(
                    timelineText("timeline.story", {
                        pl: "Opowiadania",
                        en: "Stories",
                        es: "Relatos"
                    })
                )}
            </button>
        </div>
    `;
}

let timelineFilterHandler = null;

function initTimelineFilters() {
    const root = document.querySelector(".timeline-page");
    if (!root) return;

    const chips = [...root.querySelectorAll(".timeline-filter-chip")];
    const entries = [...root.querySelectorAll(".timeline-entry")];
    const eras = [...root.querySelectorAll(".timeline-era")];

    function applyFilter(filter) {
        chips.forEach(chip => {
            chip.classList.toggle(
                "is-active",
                chip.dataset.filter === filter
            );
        });

        entries.forEach(entry => {
            const type = entry.dataset.type || "event";
            const show =
                filter === "all" || type === filter;
            entry.hidden = !show;
        });

        // Ukryj separatory epok, jeśli oba sąsiadujące wpisy są ukryte
        eras.forEach(era => {
            let prev = era.previousElementSibling;
            let next = era.nextElementSibling;

            while (prev && prev.classList.contains("timeline-era")) {
                prev = prev.previousElementSibling;
            }
            while (next && next.classList.contains("timeline-era")) {
                next = next.nextElementSibling;
            }

            const prevVisible =
                prev &&
                prev.classList.contains("timeline-entry") &&
                !prev.hidden;
            const nextVisible =
                next &&
                next.classList.contains("timeline-entry") &&
                !next.hidden;

            era.hidden = !(prevVisible && nextVisible);
        });
    }

    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            applyFilter(chip.dataset.filter || "all");
        });
    });

    applyFilter("all");
}

/* ==========================================================
   WIDOK
   ========================================================== */

export async function timelineView() {
    try {
        const events = await getData("timeline");

        if (!Array.isArray(events)) {
            return `
                <section class="timeline-page">
                    <header class="timeline-header">
                        <h1>${escapeHtml(t("timeline.title"))}</h1>
                        <p>${escapeHtml(t("timeline.description"))}</p>
                    </header>
                    <p>${escapeHtml(t("common.noData"))}</p>
                </section>
            `;
        }

        const sortedEvents = [...events].sort(
            (a, b) => getYearValue(a.year) - getYearValue(b.year)
        );

        if (!sortedEvents.length) {
            return `
                <section class="timeline-page">
                    <header class="timeline-header">
                        <h1>${escapeHtml(t("timeline.title"))}</h1>
                        <p>${escapeHtml(t("timeline.description"))}</p>
                    </header>
                    <p>${escapeHtml(t("timeline.empty"))}</p>
                </section>
            `;
        }

        // setTimeout — po app.innerHTML (jak w characters.js)
        setTimeout(() => {
            initTimelineFilters();
        }, 0);

        return `
            <section class="timeline-page">
                <header class="timeline-header">
                    <h1>${escapeHtml(t("timeline.title"))}</h1>
                    <p>${escapeHtml(t("timeline.description"))}</p>
                </header>

                ${renderFilters()}

                <div class="timeline">
                    ${buildTimelineHtml(sortedEvents)}
                </div>
            </section>
        `;
    } catch (error) {
        console.error("Błąd ładowania historii:", error);

        return `
            <section class="timeline-page">
                <header class="timeline-header">
                    <h1>${escapeHtml(t("timeline.title"))}</h1>
                    <p>${escapeHtml(t("timeline.description"))}</p>
                </header>
                <p>${escapeHtml(t("common.noData"))}</p>
            </section>
        `;
    }
}
