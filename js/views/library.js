import { getData } from "../core/api.js";
import { getLanguage, t } from "../core/i18n.js";

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

function localizeLibrary(item, field) {

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

function getStatusText(status) {

    const language = getLanguage();

    const statuses = {

        planned: {
            pl: "Planowana",
            en: "Planned",
            es: "Planificada"
        },

        writing: {
            pl: "W trakcie pisania",
            en: "Writing",
            es: "En escritura"
        },

        editing: {
            pl: "Redakcja",
            en: "Editing",
            es: "Edición"
        },

        completed: {
            pl: "Ukończona",
            en: "Completed",
            es: "Completada"
        },

        published: {
            pl: "Wydana",
            en: "Published",
            es: "Publicada"
        }

    };

    const item = statuses[status];

    if (!item) {
        return status ?? "";
    }

    return (
        item[language] ||
        item.pl
    );

}

function sortSeries(series) {

    return [...series].sort((a, b) => {

        const orderA =
            Number(a.order ?? 9999);

        const orderB =
            Number(b.order ?? 9999);

        if (orderA !== orderB) {
            return orderA - orderB;
        }

        return localizeLibrary(a, "title")
            .localeCompare(
                localizeLibrary(b, "title"),
                getLanguage()
            );

    });

}

function renderSeries(series) {

    const title = localizeLibrary(
        series,
        "title"
    );

    const description = localizeLibrary(
        series,
        "description"
    );

    const featured =
        Boolean(series.featured);

    const cover =
        series.cover ||
        "assets/books/covers/default.jpg";

    const bookCount =
        Number(series.bookCount ?? 0);

    return `

        <article class="library-card${featured ? " featured" : ""}">

            <div class="library-cover">

                <img
                    src="${escapeHtml(cover)}"
                    alt="${escapeHtml(title)}"
                    loading="lazy"
                >

            </div>

            <div class="library-content">

                ${featured ? `

                    <span class="library-featured">

                        ⭐ ${escapeHtml(
                            t("library.featured")
                        )}

                    </span>

                ` : ""}

                <h2>

                    ${escapeHtml(title)}

                </h2>

                <p class="library-description">

                    ${escapeHtml(description)}

                </p>

                <div class="library-meta">

                    <span>

                        📚
                        ${bookCount}

                    </span>

                    <span>

                        ✍
                        ${escapeHtml(
                            getStatusText(
                                series.status
                            )
                        )}

                    </span>

                </div>

                <a
                    class="library-button"
                    href="#/series/${encodeURIComponent(series.id)}"
                >

                    ${escapeHtml(
                        t("library.openSeries")
                    )}

                </a>

            </div>

        </article>

    `;

}

function renderLibrary(series) {

    return `

        <div class="library-grid">

            ${series
                .map(renderSeries)
                .join("")}

        </div>

    `;

}

export async function libraryView() {

    try {

        const library =
            await getData("library");

        if (
            !library ||
            !Array.isArray(
                library.series
            )
        ) {

            return `

                <section class="library-page">

                    <header class="library-header">

                        <h1>

                            ${escapeHtml(
                                t("library.title")
                            )}

                        </h1>

                        <p>

                            ${escapeHtml(
                                t("common.noData")
                            )}

                        </p>

                    </header>

                </section>

            `;

        }

        const title =
            localizeLibrary(
                library,
                "title"
            );

        const description =
            localizeLibrary(
                library,
                "description"
            );

        const series =
            sortSeries(
                library.series
            );

        return `

            <section class="library-page">

                <header class="library-header">

                    <h1>

                        ${escapeHtml(title)}

                    </h1>

                    <p>

                        ${escapeHtml(description)}

                    </p>

                </header>

                ${renderLibrary(series)}

            </section>

        `;

    } catch (error) {

        console.error(
            "Błąd ładowania biblioteki:",
            error
        );

        return `

            <section class="library-page">

                <header class="library-header">

                    <h1>

                        ${escapeHtml(
                            t("library.title")
                        )}

                    </h1>

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
