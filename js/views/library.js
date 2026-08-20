import { getData } from "../core/api.js";
import {
    getLanguage,
    t,
    localize
} from "../core/i18n.js";

/* ==========================================================
   POMOCNICZE
   ========================================================== */

/**
 * Zabezpiecza tekst przed wstrzyknięciem HTML.
 */
function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Lokalizuje pole obiektu.
 */
function localizeLibrary(item, field) {
    return localize(item, field);
}

/**
 * Zwraca obiekt statusu: tekst + klasa CSS
 */
function getStatusInfo(status) {
    const language = getLanguage();

    const statuses = {
        planned: {
            pl: "Planowana",
            en: "Planned",
            es: "Planificada",
            className: "status-planned"
        },
        writing: {
            pl: "W trakcie pisania",
            en: "Writing",
            es: "En escritura",
            className: "status-writing"
        },
        editing: {
            pl: "Redakcja",
            en: "Editing",
            es: "Edición",
            className: "status-editing"
        },
        completed: {
            pl: "Ukończona",
            en: "Completed",
            es: "Completada",
            className: "status-completed"
        },
        published: {
            pl: "Wydana",
            en: "Published",
            es: "Publicada",
            className: "status-published"
        }
    };

    const item = statuses[status];

    if (!item) {
        return {
            text: status ?? "",
            className: "status-unknown"
        };
    }

    return {
        text: item[language] ?? item.pl ?? status,
        className: item.className
    };
}

/**
 * Sortuje serie według pola "order".
 * Jeśli "order" nie istnieje, seria trafia na koniec.
 */
function sortSeries(series) {
    return [...series].sort((a, b) => {
        const orderA = Number(a.order ?? 9999);
        const orderB = Number(b.order ?? 9999);

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

/**
 * Generuje inicjały do placeholdera okładki.
 */
function getInitials(title) {
    if (!title) return "?";

    return title
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join("");
}

/* ==========================================================
   KARTA SERII
   ========================================================== */

function renderSeries(series) {
    const title = localizeLibrary(series, "title");
    const description = localizeLibrary(series, "description");
    const featured = Boolean(series.featured);

    const cover =
        typeof series.cover === "string" && series.cover.trim() !== ""
            ? series.cover.trim()
            : "";

    const bookCount = Number(series.bookCount ?? 0);
    const statusInfo = getStatusInfo(series.status);

    // Okładka lub ładny placeholder
    const coverHtml = cover
        ? `
            <div class="library-cover">
                <img
                    src="${escapeHtml(cover)}"
                    alt="${escapeHtml(title)}"
                    loading="lazy"
                >
            </div>
        `
        : `
            <div class="library-cover placeholder">
                <span class="library-cover-initials">
                    ${escapeHtml(getInitials(title))}
                </span>
            </div>
        `;

    return `
        <article class="library-card${featured ? " featured" : ""}">

            ${coverHtml}

            <div class="library-content">

                ${
                    featured
                        ? `
                            <span class="library-featured">
                                ⭐ ${escapeHtml(t("library.featured"))}
                            </span>
                        `
                        : ""
                }

                <h2 class="library-title">
                    ${escapeHtml(title)}
                </h2>

                ${
                    description
                        ? `
                            <p class="library-description">
                                ${escapeHtml(description)}
                            </p>
                        `
                        : ""
                }

                <div class="library-meta">
                    <span class="library-books">
                        📚 ${bookCount}
                    </span>

                    ${
                        statusInfo.text
                            ? `
                                <span class="library-status ${statusInfo.className}">
                                    ${escapeHtml(statusInfo.text)}
                                </span>
                            `
                            : ""
                    }
                </div>

                <a
                    class="library-button"
                    href="#/series/${encodeURIComponent(series.id)}"
                >
                    ${escapeHtml(t("library.openSeries"))}
                </a>

            </div>

        </article>
    `;
}

/* ==========================================================
   LISTA SERII
   ========================================================== */

function renderLibrary(series) {
    if (!series.length) {
        return `
            <div class="library-empty">
                ${escapeHtml(t("common.noData"))}
            </div>
        `;
    }

    return `
        <div class="library-grid">
            ${series.map(renderSeries).join("")}
        </div>
    `;
}

/* ==========================================================
   WIDOK BIBLIOTEKI
   ========================================================== */

export async function libraryView() {
    try {
        const library = await getData("library");

        if (!library || !Array.isArray(library.series)) {
            return `
                <section class="library-page">
                    <header class="library-header">
                        <h1>
                            ${escapeHtml(t("library.title"))}
                        </h1>
                        <p>
                            ${escapeHtml(t("common.noData"))}
                        </p>
                    </header>
                </section>
            `;
        }

        const title = localizeLibrary(library, "title");
        const description = localizeLibrary(library, "description");
        const series = sortSeries(library.series);

        return `
            <section class="library-page">

                <header class="library-header">
                    <h1>
                        ${escapeHtml(title || t("library.title"))}
                    </h1>

                    ${
                        description
                            ? `
                                <p>
                                    ${escapeHtml(description)}
                                </p>
                            `
                            : ""
                    }
                </header>

                ${renderLibrary(series)}

            </section>
        `;

    } catch (error) {
        console.error("Błąd ładowania biblioteki:", error);

        return `
            <section class="library-page">
                <header class="library-header">
                    <h1>
                        ${escapeHtml(t("library.title"))}
                    </h1>
                </header>

                <p>
                    ${escapeHtml(t("common.noData"))}
                </p>
            </section>
        `;
    }
}
