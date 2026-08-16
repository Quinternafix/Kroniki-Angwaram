import { getData } from "../core/api.js";
import { getLanguage, t } from "../core/i18n.js";

/* ==========================================================
   PROGRESS — DODANE
   ========================================================== */

function getReadingProgress(bookId) {
    try {
        const key = `reading_${bookId}`;
        const value = localStorage.getItem(key);
        return value ? String(value) : null;
    } catch {
        return null;
    }
}

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

function localizeBook(item, field) {
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
    return t(`library.status.${status}`);
}

function sortChapters(chapters) {
    if (!Array.isArray(chapters)) {
        return [];
    }

    return [...chapters].sort(
        (a, b) =>
            Number(a.order ?? 0) -
            Number(b.order ?? 0)
    );
}

/* ==========================================================
   META
   ========================================================== */

function renderMeta(book) {
    return `
        <div class="book-meta">

            <div>
                <strong>${escapeHtml(t("book.author"))}</strong>
                ${escapeHtml(book.author || "-")}
            </div>

            <div>
                <strong>${escapeHtml(t("book.genre"))}</strong>
                ${escapeHtml(book.genre || "-")}
            </div>

            <div>
                <strong>${escapeHtml(t("book.status"))}</strong>
                ${escapeHtml(getStatusText(book.status))}
            </div>

        </div>
    `;
}

/* ==========================================================
   HEADER
   ========================================================== */

function renderHeader(book) {
    const title = localizeBook(book, "title");
    const subtitle = localizeBook(book, "subtitle");

    return `
        <header class="book-header">

            <div class="book-cover">
                <img
                    src="${escapeHtml(book.cover || "")}"
                    alt="${escapeHtml(title)}"
                    loading="lazy"
                >
            </div>

            <div class="book-header-content">

                <h1>${escapeHtml(title)}</h1>

                ${
                    subtitle
                        ? `<h2>${escapeHtml(subtitle)}</h2>`
                        : ""
                }

                ${renderMeta(book)}

            </div>

        </header>
    `;
}

/* ==========================================================
   SUMMARY
   ========================================================== */

function renderSummary(book) {
    const summary = localizeBook(book, "summary");

    if (!summary) {
        return "";
    }

    return `
        <section class="book-summary">

            <h2>${escapeHtml(t("book.summary"))}</h2>

            <p>${escapeHtml(summary)}</p>

        </section>
    `;
}

/* ==========================================================
   CHAPTER LIST
   ========================================================== */

function renderChapterList(book) {
    const chapters = sortChapters(book.chapters);

    return `
        <section class="book-chapters">

            <h2>${escapeHtml(t("book.chapters"))}</h2>

            <div class="book-chapter-list">

                ${chapters.map(chapter => {
                    const title = localizeBook(chapter, "title");

                    return `
                        <a
                            class="book-chapter"
                            href="#/reader/${encodeURIComponent(book.id)}/${encodeURIComponent(chapter.id)}"
                        >
                            <span class="book-chapter-number">${chapter.order}</span>
                            <span class="book-chapter-title">${escapeHtml(title)}</span>
                        </a>
                    `;
                }).join("")}

            </div>

        </section>
    `;
}

/* ==========================================================
   ACTIONS
   ========================================================== */

function renderActions(book) {

    const savedChapter = getReadingProgress(book.id);

    const firstChapter =
        Array.isArray(book.chapters) &&
        book.chapters.length
            ? sortChapters(book.chapters)[0]
            : null;

    const continueTarget =
        savedChapter || firstChapter?.id;

    return `
        <section class="book-actions">

            ${
                continueTarget
                    ? `
                        <a
                            class="book-button primary"
                            href="#/reader/${encodeURIComponent(book.id)}/${encodeURIComponent(continueTarget)}"
                        >
                            ${escapeHtml(
                                savedChapter
                                    ? t("book.continueReading")
                                    : t("book.startReading")
                            )}
                        </a>
                    `
                    : ""
            }

            ${
                book.series
                    ? `
                        <a
                            class="book-button"
                            href="#/series/${encodeURIComponent(book.series)}"
                        >
                            ${escapeHtml(t("book.backToSeries"))}
                        </a>
                    `
                    : ""
            }

        </section>
    `;
}

/* ==========================================================
   BOOK PAGE
   ========================================================== */

function renderBook(book) {
    return `
        <section class="book-page">

            ${renderHeader(book)}

            ${renderActions(book)}

            ${renderSummary(book)}

            ${renderChapterList(book)}

        </section>
    `;
}

/* ==========================================================
   VIEW
   ========================================================== */

export async function bookView(id) {

    try {

        const book = await getData(`books/${id}`);

        if (!book) {
            return `
                <section class="book-page">
                    <h1>${escapeHtml(t("book.notFound"))}</h1>
                </section>
            `;
        }

        return renderBook(book);

    } catch (error) {

        console.error("Błąd ładowania książki:", error);

        return `
            <section class="book-page">

                <h1>${escapeHtml(t("book.notFound"))}</h1>

                <p>${escapeHtml(t("common.noData"))}</p>

            </section>
        `;
    }
}

console.log("book.js loaded");
