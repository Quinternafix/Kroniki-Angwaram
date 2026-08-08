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
        value.es ||
        ""
    );
}


function getYearValue(year) {

    const value = Number.parseInt(
        String(year),
        10
    );

    return Number.isNaN(value)
        ? 0
        : value;
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

    if (
        translated &&
        translated !== key
    ) {
        return translated;
    }

    const language = getLanguage();

    return (
        fallback[language] ||
        fallback.pl ||
        ""
    );
}


function renderRelations(story) {

    let html = "";


    if (
        Array.isArray(story.characters) &&
        story.characters.length
    ) {

        html += `

            <div class="timeline-story-relations">

                <strong>
                    ${escapeHtml(
                        timelineText(
                            "timeline.characters",
                            {
                                pl: "Postacie",
                                en: "Characters",
                                es: "Personajes"
                            }
                        )
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

        `;
    }


    if (
        Array.isArray(story.locations) &&
        story.locations.length
    ) {

        html += `

            <div class="timeline-story-relations">

                <strong>
                    ${escapeHtml(
                        timelineText(
                            "timeline.locations",
                            {
                                pl: "Miejsca",
                                en: "Locations",
                                es: "Lugares"
                            }
                        )
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

        `;
    }


    if (
        Array.isArray(story.factions) &&
        story.factions.length
    ) {

        html += `

            <div class="timeline-story-relations">

                <strong>
                    ${escapeHtml(
                        timelineText(
                            "timeline.factions",
                            {
                                pl: "Frakcje",
                                en: "Factions",
                                es: "Facciones"
                            }
                        )
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

        `;
    }


    return html;
}


function renderStoryContent(story) {

    const title =
        localizeTimeline(
            story,
            "title"
        );

    const summary =
        localizeTimeline(
            story,
            "summary"
        );

    const content =
        localizeTimeline(
            story,
            "content"
        );


    const paragraphs =
        String(content || "")
            .split(/\n\s*\n/)
            .map(
                paragraph =>
                    paragraph.trim()
            )
            .filter(Boolean)
            .map(
                paragraph =>
                    `<p>${escapeHtml(
                        paragraph
                    ).replace(
                        /\n/g,
                        "<br>"
                    )}</p>`
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
                            timelineText(
                                "timeline.story",
                                {
                                    pl: "Opowiadanie",
                                    en: "Story",
                                    es: "Relato"
                                }
                            )
                        )}

                    </div>

                    <h2>
                        ${escapeHtml(title)}
                    </h2>

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
                            timelineText(
                                "timeline.readStory",
                                {
                                    pl: "Czytaj opowiadanie",
                                    en: "Read story",
                                    es: "Leer relato"
                                }
                            )
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
                            timelineText(
                                "timeline.story",
                                {
                                    pl: "Opowiadanie",
                                    en: "Story",
                                    es: "Relato"
                                }
                            )
                        )}

                    </div>

                    <h2>
                        ${escapeHtml(title)}
                    </h2>

    `;


    if (
        story.date ||
        story.author
    ) {

        html += `

                    <div class="timeline-story-meta">

        `;


        if (story.date) {

            html += `

                        <span>
                            ${escapeHtml(story.date)}
                        </span>

            `;
        }


        if (story.author) {

            html += `

                        <span>
                            ${escapeHtml(story.author)}
                        </span>

            `;
        }


        html += `

                    </div>

        `;
    }


    html += `

                </header>

    `;


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


function renderTimelineEvent(event) {

    const title =
        localizeTimeline(
            event,
            "title"
        );

    const description =
        localizeTimeline(
            event,
            "description"
        );


    return `

        <article class="timeline-event">

            <div class="timeline-marker"></div>

            <div class="timeline-content">

                <div class="timeline-year">
                    ${escapeHtml(
                        event.year ?? "—"
                    )}
                </div>

                <div class="timeline-entry-type">

                    ${escapeHtml(
                        timelineText(
                            "timeline.event",
                            {
                                pl: "Wydarzenie",
                                en: "Event",
                                es: "Evento"
                            }
                        )
                    )}

                </div>

                <h2>
                    ${escapeHtml(title)}
                </h2>

                ${
                    description
                        ? `
                            <p>
                                ${escapeHtml(
                                    description
                                )}
                            </p>
                        `
                        : ""
                }

            </div>

        </article>

    `;
}


function renderTimelineEntry(entry) {

    if (
        entry &&
        entry.type === "story"
    ) {

        return `

            <article class="timeline-event">

                <div class="timeline-marker"></div>

                <div class="timeline-content">

                    <div class="timeline-year">
                        ${escapeHtml(
                            entry.year ?? "—"
                        )}
                    </div>

                    ${renderStoryContent(entry)}

                </div>

            </article>

        `;
    }


    return renderTimelineEvent(entry);
}


export async function timelineView() {

    try {

        const events =
            await getData("timeline");


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


        const sortedEvents =
            [...events].sort(
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

    } catch (error) {

        console.error(
            "Błąd ładowania historii:",
            error
        );


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
}
