```javascript
import { getData } from "../core/api.js";
import { getLanguage, t } from "../core/i18n.js";

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

function renderRelations(story) {

    const groups = [];

    if (
        Array.isArray(story.characters) &&
        story.characters.length
    ) {

        groups.push(`
            <div class="timeline-story-relations">

                <strong>
                    ${escapeHtml(
                        t("timeline.characters") ||
                        "Postacie"
                    )}
                </strong>

                <div class="timeline-story-tags">

                    ${story.characters
                        .map(
                            character =>
                                `<span>${escapeHtml(character)}</span>`
                        )
                        .join("")}

                </div>

            </div>
        `);
    }

    if (
        Array.isArray(story.locations) &&
        story.locations.length
    ) {

        groups.push(`
            <div class="timeline-story-relations">

                <strong>
                    ${escapeHtml(
                        t("timeline.locations") ||
                        "Miejsca"
                    )}
                </strong>

                <div class="timeline-story-tags">

                    ${story.locations
                        .map(
                            location =>
                                `<span>${escapeHtml(location)}</span>`
                        )
                        .join("")}

                </div>

            </div>
        `);
    }

    if (
        Array.isArray(story.factions) &&
        story.factions.length
    ) {

        groups.push(`
            <div class="timeline-story-relations">

                <strong>
                    ${escapeHtml(
                        t("timeline.factions") ||
                        "Frakcje"
                    )}
                </strong>

                <div class="timeline-story-tags">

                    ${story.factions
                        .map(
                            faction =>
                                `<span>${escapeHtml(faction)}</span>`
                        )
                        .join("")}

                </div>

            </div>
        `);
    }

    return groups.join("");
}

function renderStoryContent(story) {

    const title = localizeTimeline(story, "title");

    const summary = localizeTimeline(
        story,
        "summary"
    );

    const content = localizeTimeline(
        story,
        "content"
    );

    const author = story.author
        ? escapeHtml(story.author)
        : "";

    const cover = story.cover
        ? escapeHtml(story.cover)
        : "";

    const paragraphs = String(content || "")
        .split(/\n\s*\n/)
        .map(paragraph => paragraph.trim())
        .filter(Boolean)
        .map(
            paragraph =>
                `<p>${escapeHtml(paragraph).replace(
                    /\n/g,
                    "<br>"
                )}</p>`
        )
        .join("");

    return `
        <details class="timeline-story">

            <summary class="timeline-story-summary">

                ${
                    cover
                        ? `
                            <div class="timeline-story-cover">

                                <img
                                    src="${cover}"
                                    alt="${escapeHtml(title)}"
                                    loading="lazy"
                                >

                            </div>
                        `
                        : ""
                }

                <div class="timeline-story-summary-content">

                    <div class="timeline-story-label">
                        ${escapeHtml(
                            t("timeline.story") ||
                            "Opowiadanie"
                        )}
                    </div>

                    <h2>
                        ${escapeHtml(title)}
                    </h2>

                    ${
                        story.date
                            ? `
                                <div class="timeline-story-date">
                                    ${escapeHtml(story.date)}
                                </div>
                            `
                            : ""
                    }

                    ${
                        author
                            ? `
                                <div class="timeline-story-author">
                                    ${author}
                                </div>
                            `
                            : ""
                    }

                    ${
                        summary
                            ? `
                                <p class="timeline-story-summary-text">
                                    ${escapeHtml(summary)}
                                </p>
                            `
                            : ""
                    }

                    <span class="timeline-story-read">
                        ${escapeHtml(
                            t("timeline.readStory") ||
                            "Czytaj opowiadanie"
                        )}
                    </span>

                </div>

            </summary>

            <div class="timeline-story-content">

                ${
                    cover
                        ? `
                            <img
                                class="timeline-story-open-cover"
                                src="${cover}"
                                alt="${escapeHtml(title)}"
                                loading="lazy"
                            >
                        `
                        : ""
                }

                <header class="timeline-story-header">

                    <div class="timeline-story-type">
                        ${escapeHtml(
                            t("timeline.story") ||
                            "Opowiadanie"
                        )}
                    </div>

                    <h2>
                        ${escapeHtml(title)}
                    </h2>

                    ${
                        story.date ||
                        story.author
                            ? `
                                <div class="timeline-story-meta">

                                    ${
                                        story.date
                                            ? `
                                                <span>
                                                    ${escapeHtml(
                                                        story.date
                                                    )}
                                                </span>
                                            `
                                            : ""
                                    }

                                    ${
                                        story.author
                                            ? `
                                                <span>
                                                    ${escapeHtml(
                                                        story.author
                                                    )}
                                                </span>
                                            `
                                            : ""
                                    }

                                </div>
                            `
                            : ""
                    }

                </header>

                ${
                    summary
                        ? `
                            <div class="timeline-story-intro">
                                ${escapeHtml(summary)}
                            </div>
                        `
                        : ""
                }

                <div class="timeline-story-text">

                    ${paragraphs}

                </div>

                ${renderRelations(story)}

            </div>

        </details>
    `;
}

function renderTimelineEvent(event) {

    const title = localizeTimeline(
        event,
        "title"
    );

    const description = localizeTimeline(
        event,
        "description"
    );

    return `
        <article class="timeline-event">

            <div class="timeline-marker"></div>

            <div class="timeline-content">

                <div class="timeline-year">
                    ${escapeHtml(event.year ?? "—")}
                </div>

                <div class="timeline-entry-type">
                    ${escapeHtml(
                        t("timeline.event") ||
                        "Wydarzenie"
                    )}
                </div>

                <h2>
                    ${escapeHtml(title)}
                </h2>

                ${
                    description
                        ? `<p>${escapeHtml(description)}</p>`
                        : ""
                }

            </div>

        </article>
    `;
}

function renderTimelineEntry(entry) {

    if (entry && entry.type === "story") {

        return `
            <article class="timeline-event timeline-story-event">

                <div class="timeline-marker"></div>

                <div class="timeline-content">

                    <div class="timeline-year">
                        ${escapeHtml(entry.year ?? "—")}
                    </div>

                    ${renderStoryContent(entry)}

                </div>

            </article>
        `;
    }

    return renderTimelineEvent(entry);
}

export async function timelineView() {

    const events = await getData("timeline");

    if (!Array.isArray(events)) {

        return `
            <section class="timeline-page">

                <header class="timeline-header">

                    <h1>
                        ${escapeHtml(
                            t("timeline.title")
                        )}
                    </h1>

                    <p>
                        ${escapeHtml(
                            t("timeline.description")
                        )}
                    </p>

                </header>

                <p>
                    ${escapeHtml(
                        t("common.noData")
                    )}
                </p>

            </section>
        `;
    }

    const sortedEvents = [...events].sort(
        (a, b) =>
            getYearValue(a.year) -
            getYearValue(b.year)
    );

    if (!sortedEvents.length) {

        return `
            <section class="timeline-page">

                <header class="timeline-header">

                    <h1>
                        ${escapeHtml(
                            t("timeline.title")
                        )}
                    </h1>

                    <p>
                        ${escapeHtml(
                            t("timeline.description")
                        )}
                    </p>

                </header>

                <p>
                    ${escapeHtml(
                        t("timeline.empty")
                    )}
                </p>

            </section>
        `;
    }

    return `
        <section class="timeline-page">

            <header class="timeline-header">

                <h1>
                    ${escapeHtml(
                        t("timeline.title")
                    )}
                </h1>

                <p>
                    ${escapeHtml(
                        t("timeline.description")
                    )}
                </p>

            </header>

            <div class="timeline">

                ${sortedEvents
                    .map(renderTimelineEntry)
                    .join("")}

            </div>

        </section>
    `;
}
```

### Jak teraz działa `timeline.json`

Zachowujesz dotychczasowe wydarzenia bez zmian:

```json
{
  "type": "event",
  "id": "bitwa-pod-ferrins",
  "year": 1687,
  "title": {
    "pl": "Bitwa pod Ferrins",
    "en": "Battle of Ferrins",
    "es": "Batalla de Ferrins"
  },
  "description": {
    "pl": "Opis wydarzenia.",
    "en": "Event description.",
    "es": "Descripción del evento."
  }
}
```

A opowiadanie dodajesz jako:

```json
{
  "type": "story",
  "id": "podczas-burzy",
  "year": 1687,
  "date": "3 kwietnia 1687",
  "title": {
    "pl": "Podczas burzy",
    "en": "During the Storm",
    "es": "Durante la tormenta"
  },
  "author": "Bartłomiej Wojciechowski",
  "cover": "assets/stories/podczas-burzy.png",
  "summary": {
    "pl": "Krótki opis opowiadania.",
    "en": "A short story summary.",
    "es": "Un breve resumen del relato."
  },
  "content": {
    "pl": "Pierwszy akapit opowiadania.\n\nDrugi akapit opowiadania.",
    "en": "The first paragraph of the story.\n\nThe second paragraph of the story.",
    "es": "El primer párrafo del relato.\n\nEl segundo párrafo del relato."
  },
  "characters": [
    "Rykan",
    "Neorath Stormbringer"
  ],
  "locations": [
    "Ferrins"
  ],
  "factions": []
}
```

Opowiadanie pojawi się na osi czasu razem z wydarzeniami, ale będzie miało własny wygląd i możliwość **rozwinięcia pełnej treści**. Nie potrzebujemy osobnego modala ani dodatkowego JavaScriptu.

### Ważna rzecz

Do `i18n.js` potrzebne będą jeszcze te klucze:

```javascript
timeline: {
    // Twoje istniejące klucze...

    event: {
        pl: "Wydarzenie",
        en: "Event",
        es: "Evento"
    },

    story: {
        pl: "Opowiadanie",
        en: "Story",
        es: "Relato"
    },

    readStory: {
        pl: "Czytaj opowiadanie",
        en: "Read story",
        es: "Leer relato"
    },

    characters: {
        pl: "Postacie",
        en: "Characters",
        es: "Personajes"
    },

    locations: {
        pl: "Miejsca",
        en: "Locations",
        es: "Lugares"
    },

    factions: {
        pl: "Frakcje",
        en: "Factions",
        es: "Facciones"
    }
}
```

Dzięki temu **cała obecna funkcjonalność `timeline.js` zostaje zachowana**, a nowy typ `story` jest dokładany do istniejącej osi czasu.
