import { getData } from "../core/api.js";
import { localizeTimeline, t } from "../core/i18n.js";

function getYearValue(year) {
    const value = Number.parseInt(String(year), 10);
    return Number.isNaN(value) ? 0 : value;
}

function renderTimelineEvent(event) {

    const title = localizeTimeline(event, "title");
    const description = localizeTimeline(event, "description");

    return `
        <article class="timeline-event">

            <div class="timeline-marker"></div>

            <div class="timeline-content">

                <div class="timeline-year">
                    ${event.year ?? "—"}
                </div>

                <h2>
                    ${title}
                </h2>

                ${
                    description
                        ? `<p>${description}</p>`
                        : ""
                }

            </div>

        </article>
    `;
}

export async function timelineView() {

    const events = await getData("timeline");

    if (!Array.isArray(events)) {

        return `
            <section class="timeline-page">

                <h1>${t("timeline.title")}</h1>

                <p>${t("common.noData")}</p>

            </section>
        `;
    }

    const sortedEvents = [...events].sort(
        (a, b) => getYearValue(a.year) - getYearValue(b.year)
    );

    if (!sortedEvents.length) {

        return `
            <section class="timeline-page">

                <h1>${t("timeline.title")}</h1>

                <p>${t("timeline.empty")}</p>

            </section>
        `;
    }

    return `
        <section class="timeline-page">

            <header class="timeline-header">

                <h1>
                    ${t("timeline.title")}
                </h1>

                <p>
                    ${t("timeline.description")}
                </p>

            </header>

            <div class="timeline">

                ${sortedEvents
                    .map(renderTimelineEvent)
                    .join("")}

            </div>

        </section>
    `;
}
