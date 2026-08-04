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

function localizeSeries(item, field) {

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

function sortBooks(books) {

    return [...books].sort((a, b) => {

        const orderA =
            Number(a.order ?? 9999);

        const orderB =
            Number(b.order ?? 9999);

        if (orderA !== orderB) {
            return orderA - orderB;
        }

        return String(a.id)
            .localeCompare(
                String(b.id),
                getLanguage()
            );

    });

}

function renderBook(book) {

    const title = localizeSeries(
        book,
        "title"
    );

    const description = localizeSeries(
        book,
        "description"
    );

    const cover =
        book.cover ||
        "assets/books/covers/default.jpg";

    return `

        <article class="series-book">

            <div class="series-book-cover">

                <img
                    src="${escapeHtml(cover)}"
                    alt="${escapeHtml(title)}"
                    loading="lazy"
                >

            </div>

            <div class="series-book-content">

                <div class="series-book-order">

                    ${t("library.book")} ${Number(book.order ?? 0)}

                </div>

                <h2>

                    ${escapeHtml(title)}

                </h2>

                <p>

                    ${escapeHtml(description)}

                </p>

                <div class="series-book-meta">

                    <span>

                        ✍
                        ${escapeHtml(
                            getStatusText(
                                book.status
                            )
                        )}

                    </span>

                </div>

                <a
                    class="series-book-button"
                    href="#/books/${encodeURIComponent(book.id)}"
                >

                    ${escapeHtml(
                        t("library.openBook")
                    )}

                </a>

            </div>

        </article>

    `;

}

function renderBooks(books) {

    return books
        .map(renderBook)
        .join("");

}

function renderSeriesHeader(series) {

    const title =
        localizeSeries(
            series,
            "title"
        );

    const description =
        localizeSeries(
            series,
            "description"
        );

    const cover =
        series.cover ||
        "assets/books/covers/default.jpg";

    return `

        <header class="series-header">

            <div class="series-cover">

                <img
                    src="${escapeHtml(cover)}"
                    alt="${escapeHtml(title)}"
                    loading="lazy"
                >

            </div>

            <div class="series-info">

                <h1>

                    ${escapeHtml(title)}

                </h1>

                <p>

                    ${escapeHtml(description)}

                </p>

                <div class="series-meta">

                    <span>

                        📚
                        ${Number(
                            series.bookCount ??
                            series.books?.length ??
                            0
                        )}

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

            </div>

        </header>

    `;

}
export async function seriesView(id) {

    try {

        const series =
            await getData(
                `series/${id}`
            );

        if (!series) {

            return `

                <section class="series-page">

                    <h1>

                        ${escapeHtml(
                            t("library.seriesNotFound")
                        )}

                    </h1>

                </section>

            `;

        }

        const books = [];

        if (Array.isArray(series.books)) {

            for (const item of sortBooks(series.books)) {

                try {

                    const book =
                        await getData(
                            `books/${item.id}`
                        );

                    books.push({

                        ...book,

                        order:
                            item.order ??
                            book.order

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

                <section class="series-books">

                    ${books.length

                        ? renderBooks(books)

                        : `

                            <p class="series-empty">

                                ${escapeHtml(
                                    t("common.noData")
                                )}

                            </p>

                        `}

                </section>

            </section>

        `;

    } catch (error) {

        console.error(

            "Błąd ładowania serii:",

            error

        );

        return `

            <section class="series-page">

                <h1>

                    ${escapeHtml(
                        t("library.seriesNotFound")
                    )}

                </h1>

                <p>

                    ${escapeHtml(
                        t("common.noData")
                    )}

                </p>

            </section>

        `;

    }

}
