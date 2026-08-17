import { getData } from "../core/api.js";
import {
    getLanguage,
    t,
    localize
} from "../core/i18n.js";

console.log("LIBRARY i18n TEST:", t("library.featured"));
console.log("LIBRARY LANGUAGE:", getLanguage());
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
 *
 * Korzystamy z głównego systemu i18n,
 * aby wszystkie widoki działały według
 * tych samych zasad.
 */
function localizeLibrary(item, field) {

    return localize(
        item,
        field
    );

}


/**
 * Zwraca przetłumaczony status serii.
 */
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

    const translatedStatus =
        statuses[status];

    if (!translatedStatus) {
        return status ?? "";
    }

    return (
        translatedStatus[language] ??
        translatedStatus.pl ??
        status ??
        ""
    );

}


/**
 * Sortuje serie według pola "order".
 *
 * Jeśli "order" nie istnieje,
 * seria trafia na koniec.
 */
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


/* ==========================================================
   KARTA SERII
   ========================================================== */

function renderSeries(series) {

    const title =
        localizeLibrary(
            series,
            "title"
        );

    const description =
        localizeLibrary(
            series,
            "description"
        );

    const featured =
        Boolean(series.featured);

    const cover =
        typeof series.cover === "string" &&
        series.cover.trim() !== ""
            ? series.cover.trim()
            : "";

    const bookCount =
        Number(
            series.bookCount ?? 0
        );

    const status =
        getStatusText(
            series.status
        );


    /*
     * Okładkę tworzymy tylko wtedy,
     * gdy faktycznie istnieje w danych.
     *
     * Dzięki temu nie pojawi się
     * uszkodzony obrazek ani tekst alt.
     */

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
        : "";


    return `

        <article class="library-card${featured ? " featured" : ""}">

            ${coverHtml}

            <div class="library-content">

                ${
                    featured
                        ? `

                            <span class="library-featured">

                                ⭐ ${escapeHtml(
                                    t("library.featured")
                                )}

                            </span>

                        `
                        : ""
                }


                <h2>

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

                    <span>

                        📚
                        ${bookCount}

                    </span>


                    ${
                        status
                            ? `

                                <span>

                                    ✍
                                    ${escapeHtml(status)}

                                </span>

                            `
                            : ""
                    }

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


/* ==========================================================
   LISTA SERII
   ========================================================== */

function renderLibrary(series) {

    if (!series.length) {

        return `

            <div class="library-empty">

                ${escapeHtml(
                    t("common.noData")
                )}

            </div>

        `;

    }

    return `

        <div class="library-grid">

            ${series
                .map(renderSeries)
                .join("")}

        </div>

    `;

}


/* ==========================================================
   WIDOK BIBLIOTEKI
   ========================================================== */

export async function libraryView() {

    try {

        const library =
            await getData("library");


        /*
         * Sprawdzenie danych.
         */

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


        /*
         * Tytuł biblioteki.
         */

        const title =
            localizeLibrary(
                library,
                "title"
            );


        /*
         * Opis biblioteki.
         */

        const description =
            localizeLibrary(
                library,
                "description"
            );


        /*
         * Sortowanie serii.
         */

        const series =
            sortSeries(
                library.series
            );


        return `

            <section class="library-page">


                <header class="library-header">

                    <h1>

                        ${escapeHtml(
                            title ||
                            t("library.title")
                        )}

                    </h1>


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
