import { getData } from "../core/api.js";
import {
    getLanguage,
    t,
    localize
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

function localizeSeries(item, field) {
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

function sortBooks(books) {
    return [...books].sort((a, b) => {
        const orderA = Number(a.order ?? 9999);
        const orderB = Number(b.order ?? 9999);

        if (orderA !== orderB) {
            return orderA - orderB;
        }

        return String(a.id).localeCompare(String(b.id), getLanguage());
    });
}

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
   NAGŁÓWEK SERII
   ========================================================== */

function renderSeriesHeader(series) {
    const title = localizeSeries(series, "title");
    const description = localizeSeries(series, "description");

    const cover =
        typeof series.cover === "string" && series.cover.trim() !== ""
            ? series.cover.trim()
            : "";

    const bookCount = Number(
        series.bookCount ?? series.books?.length ?? 0
    );

    const statusInfo = getStatusInfo(series.status);

    const coverHtml = cover
        ? `
            <div class="series-cover">
                <img
                    src="${escapeHtml(cover)}"
                    alt="${escapeHtml(title)}"
                    loading="lazy"
                >
            </div>
        `
        : `
            <div class="series-cover placeholder">
                <span class="series-cover-initials">
                    ${escapeHtml(getInitials(title))}
                </span>
            </div>
        `;

    return `
        <header class="series-header">

            ${coverHtml}

            <div class="series-info">

                <a class="series-back" href="#/library">
                    ← ${escapeHtml(t("nav.library"))}
                </a>

                <h1 class="series-title">
                    ${escapeHtml(title)}
                </h1>

                ${
                    description
                        ? `
                            <p class="series-description">
                                ${escapeHtml(description)}
                            </p>
                        `
                        : ""
                }

                <div class="series-meta">
                    <span class="series-books">
                        📚 ${bookCount}
                    </span>

                    ${
                        statusInfo.text
                            ? `
                                <span class="series-status ${statusInfo.className}">
                                    ${escapeHtml(statusInfo.text)}
                                </span>
                            `
                            : ""
                    }
                </div>

            </div>

        </header>
    `;
}

/* ==========================================================
   KARTA KSIĄŻKI
   ========================================================== */

function renderBook(book) {
    const title = localizeSeries(book, "title");
    const description = localizeSeries(book, "description");

    const cover =
        typeof book.cover === "string" && book.cover.trim() !== ""
            ? book.cover.trim()
            : "";

    const order = Number(book.order ?? 0);
    const statusInfo = getStatusInfo(book.status);

    const coverHtml = cover
        ? `
            <div class="series-book-cover">
                <img
                    src="${escapeHtml(cover)}"
                    alt="${escapeHtml(title)}"
                    loading="lazy"
                >
            </div>
        `
        : `
            <div class="series-book-cover placeholder">
                <span class="series-book-initials">
                    ${escapeHtml(getInitials(title))}
                </span>
            </div>
        `;

    return `
        <article class="series-book">

            ${coverHtml}

            <div class="series-book-content">

                <div class="series-book-order">
                    ${escapeHtml(t("library.book"))} ${order}
                </div>

                <h2 class="series-book-title">
                    ${escapeHtml(title)}
                </h2>

                ${
                    description
                        ? `
                            <p class="series-book-description">
                                ${escapeHtml(description)}
                            </p>
                        `
                        : ""
                }

                <div class="series-book-meta">
                    ${
                        statusInfo.text
                            ? `
                                <span class="series-status ${statusInfo.className}">
                                    ${escapeHtml(statusInfo.text)}
                                </span>
                            `
                            : ""
                    }
                </div>

                <a
                    class="series-book-button"
                    href="#/books/${encodeURIComponent(book.id)}"
                >
                    ${escapeHtml(t("library.openBook"))}
                </a>

            </div>

        </article>
    `;
}

/* ==========================================================
   LISTA KSIĄŻEK
   ========================================================== */

function renderBooks(books) {
    if (!books.length) {
        return `
            <div class="series-empty">
                ${escapeHtml(t("common.noData"))}
            </div>
        `;
    }

    return `
        <div class="series-books-grid">
            ${books.map(renderBook).join("")}
        </div>
    `;
}

/* ==========================================================
   WIDOK SERII
   ========================================================== */

export async function seriesView(id) {
    try {
        const series = await getData(`series/${id}`);

        if (!series) {
            return `
                <section class="series-page">
                    <h1>
                        ${escapeHtml(t("library.seriesNotFound"))}
                    </h1>
                    <p>
                        <a href="#/library">
                            ← ${escapeHtml(t("nav.library"))}
                        </a>
                    </p>
                </section>
            `;
        }

        const books = [];

        if (Array.isArray(series.books)) {
            for (const item of sortBooks(series.books)) {
                try {
                    const book = await getData(`books/${item.id}`);

                    books.push({
                        ...book,
                        order: item.order ?? book.order
                    });

                } catch (error) {
                    console.warn(
                        "Nie udało się załadować książki:",
                        item.id,
                        error
                    );
                }
            }
        }

        return `
            <section class="series-page">

                ${renderSeriesHeader(series)}

                <section class="series-books-section">
                    <h2 class="series-books-heading">
                        ${escapeHtml(t("library.book"))}y
                    </h2>

                    ${renderBooks(books)}
                </section>

            </section>
        `;

    } catch (error) {
        console.error("Błąd ładowania serii:", error);

        return `
            <section class="series-page">
                <h1>
                    ${escapeHtml(t("library.seriesNotFound"))}
                </h1>
                <p>
                    ${escapeHtml(t("common.noData"))}
                </p>
                <p>
                    <a href="#/library">
                        ← ${escapeHtml(t("nav.library"))}
                    </a>
                </p>
            </section>
        `;
    }
}
