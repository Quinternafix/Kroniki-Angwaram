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
            pl: "Planowany",
            en: "Planned",
            es: "Planificado",
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
            pl: "Ukończony",
            en: "Completed",
            es: "Completado",
            className: "status-completed"
        },
        published: {
            pl: "Wydany",
            en: "Published",
            es: "Publicado",
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

/**
 * Preferuje summary, potem description (kompatybilność wsteczna).
 */
function getBookBlurb(book) {
    return (
        localizeSeries(book, "summary") ||
        localizeSeries(book, "description") ||
        ""
    );
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
                    onerror="this.style.display='none';this.parentElement.classList.add('placeholder');this.parentElement.innerHTML='<span class=\\'series-cover-initials\\'>${escapeHtml(getInitials(title))}</span>';"
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
                    ← ${escapeHtml(t("nav.library") || t("library.title"))}
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
                    <span class="series-books-count">
                        📚 ${bookCount}
                        ${escapeHtml(
                            bookCount === 1
                                ? t("library.book")
                                : t("library.books")
                        )}
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
    const subtitle = localizeSeries(book, "subtitle");
    const blurb = getBookBlurb(book);

    const cover =
        typeof book.cover === "string" && book.cover.trim() !== ""
            ? book.cover.trim()
            : "";

    const order = Number(book.order ?? 0);
    const statusInfo = getStatusInfo(book.status);
    const isPlanned = book.status === "planned";

    const coverHtml = cover
        ? `
            <div class="series-book-cover">
                <img
                    src="${escapeHtml(cover)}"
                    alt="${escapeHtml(title)}"
                    loading="lazy"
                    onerror="this.style.display='none';this.parentElement.classList.add('placeholder');this.parentElement.innerHTML='<span class=\\'series-book-initials\\'>${escapeHtml(getInitials(title))}</span>';"
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
        <article class="series-book${isPlanned ? " is-planned" : ""}">

            ${coverHtml}

            <div class="series-book-content">

                <div class="series-book-order">
                    ${escapeHtml(t("library.book"))} ${order || "—"}
                    ${
                        subtitle
                            ? ` · ${escapeHtml(subtitle)}`
                            : ""
                    }
                </div>

                <h2 class="series-book-title">
                    ${escapeHtml(title)}
                </h2>

                ${
                    blurb
                        ? `
                            <p class="series-book-description">
                                ${escapeHtml(blurb)}
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
                    class="series-book-button${isPlanned ? " is-disabled" : ""}"
                    href="#/books/${encodeURIComponent(book.id)}"
                    ${isPlanned ? `title="${escapeHtml(t("library.comingSoon") || "Wkrótce")}"` : ""}
                >
                    ${escapeHtml(
                        isPlanned
                            ? (t("library.comingSoon") || "Wkrótce")
                            : t("library.openBook")
                    )}
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
                            ← ${escapeHtml(t("nav.library") || t("library.title"))}
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

                    // Fallback – pokaż przynajmniej wpis z serii
                    books.push({
                        id: item.id,
                        order: item.order,
                        title: item.title || { pl: item.id, en: item.id },
                        status: item.status || "planned",
                        cover: item.cover || ""
                    });
                }
            }
        }

        const writingCount = books.filter(b => b.status === "writing").length;
        const plannedCount = books.filter(b => b.status === "planned").length;

        return `
            <section class="series-page">

                ${renderSeriesHeader(series)}

                <section class="series-books-section">
                    <div class="series-books-heading-row">
                        <h2 class="series-books-heading">
                            ${escapeHtml(t("library.books") || "Tomy")}
                        </h2>
                        <div class="series-books-stats">
                            ${
                                writingCount
                                    ? `<span class="stat-writing">${writingCount} ${escapeHtml(t("library.statusWriting") || "w trakcie")}</span>`
                                    : ""
                            }
                            ${
                                plannedCount
                                    ? `<span class="stat-planned">${plannedCount} ${escapeHtml(t("library.statusPlanned") || "planowane")}</span>`
                                    : ""
                            }
                        </div>
                    </div>

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
                        ← ${escapeHtml(t("nav.library") || t("library.title"))}
                    </a>
                </p>
            </section>
        `;
    }
}
