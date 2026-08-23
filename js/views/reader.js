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

function getChapter(book, chapterId) {
    if (!Array.isArray(book.chapters)) {
        return null;
    }

    return (
        book.chapters.find(
            chapter => chapter.id === chapterId
        ) || null
    );
}

function getChapterIndex(book, chapterId) {
    if (!Array.isArray(book.chapters)) {
        return -1;
    }

    return book.chapters.findIndex(
        chapter => chapter.id === chapterId
    );
}

function getPreviousChapter(book, chapterId) {
    const index = getChapterIndex(book, chapterId);

    if (index <= 0) {
        return null;
    }

    return book.chapters[index - 1];
}

function getNextChapter(book, chapterId) {
    const index = getChapterIndex(book, chapterId);

    if (
        index === -1 ||
        index >= book.chapters.length - 1
    ) {
        return null;
    }

    return book.chapters[index + 1];
}

function saveReadingProgress(bookId, chapterId) {
    localStorage.setItem(
        `reader:${bookId}`,
        chapterId
    );
}

function getReadingProgress(bookId) {
    return localStorage.getItem(
        `reader:${bookId}`
    );
}

function renderParagraphs(text) {
    return String(text || "")
        .split(/\n\s*\n/)
        .map(paragraph => paragraph.trim())
        .filter(Boolean)
        .map(
            paragraph =>
                `<p>${
                    escapeHtml(paragraph)
                        .replace(/\n/g, "<br>")
                }</p>`
        )
        .join("");
}

function renderTableOfContents(book, currentChapterId) {
    if (!Array.isArray(book.chapters)) {
        return "";
    }

    return `
        <aside class="reader-toc">
            <h2>${escapeHtml(t("reader.contents"))}</h2>
            <ul>
                ${book.chapters.map(chapter => {
                    const title = localizeBook(chapter, "title");
                    const active = chapter.id === currentChapterId;

                    return `
                        <li>
                            <a
                                class="${active ? "active" : ""}"
                                href="#/reader/${encodeURIComponent(book.id)}/${encodeURIComponent(chapter.id)}"
                            >
                                ${escapeHtml(title)}
                            </a>
                        </li>
                    `;
                }).join("")}
            </ul>
        </aside>
    `;
}

function renderNavigation(book, chapter) {
    const previous = getPreviousChapter(book, chapter.id);
    const next = getNextChapter(book, chapter.id);

    return `
        <nav class="reader-navigation">
            <div>
                ${previous
                    ? `
                        <a
                            class="reader-button"
                            href="#/reader/${encodeURIComponent(book.id)}/${encodeURIComponent(previous.id)}"
                        >
                            ← ${escapeHtml(localizeBook(previous, "title"))}
                        </a>
                    `
                    : ""
                }
            </div>

            <div>
                <a
                    class="reader-button"
                    href="#/books/${encodeURIComponent(book.id)}"
                >
                    ${escapeHtml(t("reader.backToBook"))}
                </a>
            </div>

            <div>
                ${next
                    ? `
                        <a
                            class="reader-button"
                            href="#/reader/${encodeURIComponent(book.id)}/${encodeURIComponent(next.id)}"
                        >
                            ${escapeHtml(localizeBook(next, "title"))} →
                        </a>
                    `
                    : ""
                }
            </div>
        </nav>
    `;
}

function renderReaderHeader(book, chapter) {
    const bookTitle = localizeBook(book, "title");
    const chapterTitle = localizeBook(chapter, "title");

    return `
        <header class="reader-header">
            <div class="reader-book-title">
                ${escapeHtml(bookTitle)}
            </div>
            <h1>
                ${escapeHtml(chapterTitle)}
            </h1>
        </header>
    `;
}

function renderChapter(book, chapter) {
    saveReadingProgress(book.id, chapter.id);

    const content = localizeBook(chapter, "content");
    const illustration = chapter.image || chapter.cover || "";

    let html = `
        <div class="reader-wrapper">
            <article class="reader-chapter enter-active">
                ${renderReaderHeader(book, chapter)}
    `;

    if (illustration) {
        html += `
            <figure class="reader-image">
                <img
                    src="${escapeHtml(illustration)}"
                    alt="${escapeHtml(localizeBook(chapter, "title"))}"
                    loading="lazy"
                >
            </figure>
        `;
    }

    html += `
                <section class="reader-content">
                    ${renderParagraphs(content)}
                </section>
    `;

    // Cytaty
    if (Array.isArray(chapter.quotes) && chapter.quotes.length) {
        html += `
            <section class="reader-quotes">
                <h2>${escapeHtml(t("reader.quotes"))}</h2>
        `;

        for (const quote of chapter.quotes) {
            html += `
                <blockquote>
                    <p>
                        ${escapeHtml(localizeBook(quote, "text"))}
                    </p>
            `;

            if (quote.author) {
                html += `
                    <footer>
                        ${escapeHtml(quote.author)}
                    </footer>
                `;
            }

            html += `</blockquote>`;
        }

        html += `</section>`;
    }

    // Notatki
    if (Array.isArray(chapter.notes) && chapter.notes.length) {
        html += `
            <section class="reader-notes">
                <h2>${escapeHtml(t("reader.notes"))}</h2>
                <ul>
        `;

        for (const note of chapter.notes) {
            html += `
                <li>
                    ${escapeHtml(localizeBook(note, "text"))}
                </li>
            `;
        }

        html += `
                </ul>
            </section>
        `;
    }

    html += `
                ${renderNavigation(book, chapter)}
            </article>
        </div>
    `;

    return html;
}

export async function readerView(bookId, chapterId) {
    try {
        const book = await getData(`books/${bookId}`);

        if (!book) {
            return `
                <section class="reader-page">
                    <h1>${escapeHtml(t("reader.bookNotFound"))}</h1>
                </section>
            `;
        }

        book.chapters = sortChapters(book.chapters);

        if (!chapterId) {
            const saved = getReadingProgress(bookId);

            if (saved) {
                chapterId = saved;
            } else if (
                Array.isArray(book.chapters) &&
                book.chapters.length
            ) {
                chapterId = book.chapters[0].id;
            }
        }

        const chapterMeta = getChapter(book, chapterId);

        if (!chapterMeta) {
            return `
                <section class="reader-page">
                    <h1>${escapeHtml(t("reader.chapterNotFound"))}</h1>
                </section>
            `;
        }

        const chapter = await getData(
            `chapters/${book.id}/${chapterId}`
        );

        if (!chapter) {
            return `
                <section class="reader-page">
                    <h1>${escapeHtml(t("reader.chapterNotFound"))}</h1>
                </section>
            `;
        }

        // Łączymy meta + pełną treść
        const fullChapter = {
            ...chapterMeta,
            ...chapter
        };

        return `
            <section class="reader-page">
                ${renderTableOfContents(book, chapterId)}
                ${renderChapter(book, fullChapter)}
            </section>
        `;

    } catch (error) {
        console.error("Reader error:", error);

        return `
            <section class="reader-page">
                <h1>${escapeHtml(t("reader.error") || "Wystąpił błąd")}</h1>
            </section>
        `;
    }
}
