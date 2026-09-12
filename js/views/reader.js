import { getData } from "../core/api.js";
import { getLanguage, t } from "../core/i18n.js";

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
    if (!item || item[field] === undefined || item[field] === null) {
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
    try {
        localStorage.setItem(`reader:${bookId}`, chapterId);
    } catch {
        /* ignore */
    }
}

function getReadingProgress(bookId) {
    try {
        return localStorage.getItem(`reader:${bookId}`);
    } catch {
        return null;
    }
}

/* ---------- Ustawienia czytnika ---------- */

const READER_SETTINGS_KEY = "reader:settings";

function getReaderSettings() {
    try {
        const raw = localStorage.getItem(READER_SETTINGS_KEY);
        if (!raw) {
            return { fontScale: 1, theme: "dark", width: "normal" };
        }
        return {
            fontScale: 1,
            theme: "dark",
            width: "normal",
            ...JSON.parse(raw)
        };
    } catch {
        return { fontScale: 1, theme: "dark", width: "normal" };
    }
}

function saveReaderSettings(settings) {
    try {
        localStorage.setItem(
            READER_SETTINGS_KEY,
            JSON.stringify(settings)
        );
    } catch {
        /* ignore */
    }
}

/* ==========================================================
   TREŚĆ
   ========================================================== */

function renderParagraphs(text) {
    const paragraphs = String(text || "")
        .split(/\n\s*\n/)
        .map(paragraph => paragraph.trim())
        .filter(Boolean);

    return paragraphs
        .map((paragraph, index) => {
            const html = escapeHtml(paragraph).replace(/\n/g, "<br>");
            const dropCap =
                index === 0 ? " class=\"reader-dropcap\"" : "";
            return `<p${dropCap}>${html}</p>`;
        })
        .join("");
}

/* ==========================================================
   SPIS TREŚCI
   ========================================================== */

function renderTableOfContents(book, currentChapterId) {
    if (!Array.isArray(book.chapters) || !book.chapters.length) {
        return "";
    }

    const currentIndex = getChapterIndex(book, currentChapterId);
    const total = book.chapters.length;
    const progress =
        currentIndex >= 0
            ? Math.round(((currentIndex + 1) / total) * 100)
            : 0;

    return `
        <aside class="reader-toc" id="readerToc">
            <div class="reader-toc-header">
                <h2>${escapeHtml(t("reader.contents"))}</h2>
                <button
                    type="button"
                    class="reader-toc-toggle"
                    id="readerTocToggle"
                    aria-expanded="true"
                    aria-controls="readerTocList"
                >
                    ▾
                </button>
            </div>

            <div class="reader-toc-progress">
                <div class="reader-toc-progress-bar">
                    <span style="width: ${progress}%"></span>
                </div>
                <div class="reader-toc-progress-label">
                    ${currentIndex + 1} / ${total}
                </div>
            </div>

            <ul class="reader-toc-list" id="readerTocList">
                ${book.chapters
                    .map((chapter, index) => {
                        const title = localizeBook(chapter, "title");
                        const active = chapter.id === currentChapterId;

                        return `
                            <li>
                                <a
                                    class="${active ? "active" : ""}"
                                    href="#/reader/${encodeURIComponent(book.id)}/${encodeURIComponent(chapter.id)}"
                                >
                                    <span class="reader-toc-num">${index + 1}</span>
                                    <span class="reader-toc-title">${escapeHtml(title)}</span>
                                </a>
                            </li>
                        `;
                    })
                    .join("")}
            </ul>
        </aside>
    `;
}

/* ==========================================================
   NAWIGACJA
   ========================================================== */

function renderNavigation(book, chapter) {
    const previous = getPreviousChapter(book, chapter.id);
    const next = getNextChapter(book, chapter.id);

    return `
        <nav class="reader-navigation">
            <div class="reader-nav-prev">
                ${
                    previous
                        ? `
                            <a
                                class="reader-button"
                                href="#/reader/${encodeURIComponent(book.id)}/${encodeURIComponent(previous.id)}"
                                data-reader-nav="prev"
                            >
                                <span class="reader-nav-label">← ${escapeHtml(t("reader.previous"))}</span>
                                <span class="reader-nav-title">${escapeHtml(localizeBook(previous, "title"))}</span>
                            </a>
                        `
                        : `<span class="reader-button is-placeholder"></span>`
                }
            </div>

            <div class="reader-nav-center">
                <a
                    class="reader-button"
                    href="#/books/${encodeURIComponent(book.id)}"
                >
                    ${escapeHtml(t("reader.backToBook"))}
                </a>
            </div>

            <div class="reader-nav-next">
                ${
                    next
                        ? `
                            <a
                                class="reader-button"
                                href="#/reader/${encodeURIComponent(book.id)}/${encodeURIComponent(next.id)}"
                                data-reader-nav="next"
                            >
                                <span class="reader-nav-label">${escapeHtml(t("reader.next"))} →</span>
                                <span class="reader-nav-title">${escapeHtml(localizeBook(next, "title"))}</span>
                            </a>
                        `
                        : `<span class="reader-button is-placeholder"></span>`
                }
            </div>
        </nav>
    `;
}

/* ==========================================================
   USTAWIENIA
   ========================================================== */

function renderSettingsBar() {
    return `
        <div class="reader-settings" id="readerSettings">
            <button type="button" class="reader-settings-btn" data-action="font-down" title="A−">A−</button>
            <button type="button" class="reader-settings-btn" data-action="font-up" title="A+">A+</button>
            <button type="button" class="reader-settings-btn" data-action="width" title="${escapeHtml(t("reader.width") || "Szerokość")}">⟷</button>
            <button type="button" class="reader-settings-btn" data-action="theme" title="${escapeHtml(t("reader.theme") || "Motyw")}">◐</button>
        </div>
    `;
}

/* ==========================================================
   NAGŁÓWEK
   ========================================================== */

function renderReaderHeader(book, chapter) {
    const bookTitle = localizeBook(book, "title");
    const chapterTitle = localizeBook(chapter, "title");

    return `
        <header class="reader-header">
            <nav class="reader-breadcrumb">
                <a href="#/library">${escapeHtml(t("nav.library") || t("library.title"))}</a>
                <span class="reader-breadcrumb-sep">›</span>
                <a href="#/books/${encodeURIComponent(book.id)}">${escapeHtml(bookTitle)}</a>
                <span class="reader-breadcrumb-sep">›</span>
                <span>${escapeHtml(chapterTitle)}</span>
            </nav>

            <div class="reader-book-title">
                ${escapeHtml(bookTitle)}
            </div>

            <h1>
                ${escapeHtml(chapterTitle)}
            </h1>
        </header>
    `;
}

/* ==========================================================
   CYTATY / PRZYPISY
   ========================================================== */

function renderQuotes(chapter) {
    if (!Array.isArray(chapter.quotes) || !chapter.quotes.length) {
        return "";
    }

    return `
        <section class="reader-quotes">
            <h2>${escapeHtml(t("reader.quotes"))}</h2>
            ${chapter.quotes
                .map(quote => {
                    const text =
                        typeof quote === "string"
                            ? quote
                            : localizeBook(quote, "text") ||
                              quote.text ||
                              "";
                    const author =
                        typeof quote === "object"
                            ? quote.author || ""
                            : "";

                    return `
                        <blockquote>
                            <p>${escapeHtml(text)}</p>
                            ${
                                author
                                    ? `<footer>— ${escapeHtml(author)}</footer>`
                                    : ""
                            }
                        </blockquote>
                    `;
                })
                .join("")}
        </section>
    `;
}

function renderNotes(chapter) {
    if (!Array.isArray(chapter.notes) || !chapter.notes.length) {
        return "";
    }

    return `
        <section class="reader-notes">
            <h2>${escapeHtml(t("reader.notes"))}</h2>
            <ul>
                ${chapter.notes
                    .map(note => {
                        const text =
                            typeof note === "string"
                                ? note
                                : localizeBook(note, "text") ||
                                  note.text ||
                                  "";

                        return `
                            <li>
                                <span class="reader-note-icon">📌</span>
                                <span>${escapeHtml(text)}</span>
                            </li>
                        `;
                    })
                    .join("")}
            </ul>
        </section>
    `;
}

/* ==========================================================
   ROZDZIAŁ
   ========================================================== */

function renderChapter(book, chapter) {
    saveReadingProgress(book.id, chapter.id);

    const content = localizeBook(chapter, "content");
    const illustration = chapter.image || chapter.cover || "";

    return `
        <div class="reader-wrapper">
            <article class="reader-chapter">
                ${renderSettingsBar()}
                ${renderReaderHeader(book, chapter)}

                ${
                    illustration
                        ? `
                            <figure class="reader-image">
                                <img
                                    src="${escapeHtml(illustration)}"
                                    alt="${escapeHtml(localizeBook(chapter, "title"))}"
                                    loading="lazy"
                                >
                            </figure>
                        `
                        : ""
                }

                <section class="reader-content">
                    ${renderParagraphs(content)}
                </section>

                ${renderQuotes(chapter)}
                ${renderNotes(chapter)}
                ${renderNavigation(book, chapter)}
            </article>
        </div>
    `;
}

/* ==========================================================
   WIDOK
   ========================================================== */

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

        const fullChapter = {
            ...chapterMeta,
            ...chapter
        };

        // Dane do nawigacji klawiaturą
        const previous = getPreviousChapter(book, chapterId);
        const next = getNextChapter(book, chapterId);

        return `
            <section
                class="reader-page"
                data-book-id="${escapeHtml(book.id)}"
                data-prev="${previous ? escapeHtml(previous.id) : ""}"
                data-next="${next ? escapeHtml(next.id) : ""}"
            >
                <div class="reader-layout">
                    ${renderTableOfContents(book, chapterId)}
                    ${renderChapter(book, fullChapter)}
                </div>
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

/* ==========================================================
   INIT — ustawienia + skróty klawiszowe
   ========================================================== */

export function initReaderPage() {
    const page = document.querySelector(".reader-page");
    if (!page) {
        return;
    }

    const chapterEl = document.querySelector(".reader-chapter");
    const settings = getReaderSettings();

    function applySettings() {
        if (!chapterEl) {
            return;
        }

        chapterEl.style.setProperty(
            "--reader-font-scale",
            String(settings.fontScale)
        );
        chapterEl.dataset.theme = settings.theme;
        chapterEl.dataset.width = settings.width;
        page.dataset.theme = settings.theme;
    }

    applySettings();

    // Przyciski ustawień
    document
        .querySelectorAll(".reader-settings-btn")
        .forEach(button => {
            button.onclick = () => {
                const action = button.dataset.action;

                if (action === "font-up") {
                    settings.fontScale = Math.min(
                        1.4,
                        +(settings.fontScale + 0.1).toFixed(2)
                    );
                } else if (action === "font-down") {
                    settings.fontScale = Math.max(
                        0.85,
                        +(settings.fontScale - 0.1).toFixed(2)
                    );
                } else if (action === "width") {
                    const widths = ["narrow", "normal", "wide"];
                    const idx = widths.indexOf(settings.width);
                    settings.width =
                        widths[(idx + 1) % widths.length];
                } else if (action === "theme") {
                    const themes = ["dark", "sepia", "light"];
                    const idx = themes.indexOf(settings.theme);
                    settings.theme =
                        themes[(idx + 1) % themes.length];
                }

                saveReaderSettings(settings);
                applySettings();
            };
        });

    // TOC toggle (mobile)
    const tocToggle = document.getElementById("readerTocToggle");
    const toc = document.getElementById("readerToc");

    if (tocToggle && toc) {
        tocToggle.onclick = () => {
            const collapsed = toc.classList.toggle("is-collapsed");
            tocToggle.setAttribute(
                "aria-expanded",
                collapsed ? "false" : "true"
            );
            tocToggle.textContent = collapsed ? "▸" : "▾";
        };
    }

    // Skróty klawiszowe ← →
    const bookId = page.dataset.bookId;
    const prevId = page.dataset.prev;
    const nextId = page.dataset.next;

    function onKeyDown(event) {
        const tag = (event.target && event.target.tagName) || "";
        if (
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            event.target?.isContentEditable
        ) {
            return;
        }

        if (event.key === "ArrowLeft" && prevId && bookId) {
            location.hash = `#/reader/${encodeURIComponent(bookId)}/${encodeURIComponent(prevId)}`;
        }

        if (event.key === "ArrowRight" && nextId && bookId) {
            location.hash = `#/reader/${encodeURIComponent(bookId)}/${encodeURIComponent(nextId)}`;
        }
    }

    // Usuń poprzedni listener jeśli był
    if (window.__readerKeyHandler) {
        document.removeEventListener(
            "keydown",
            window.__readerKeyHandler
        );
    }

    window.__readerKeyHandler = onKeyDown;
    document.addEventListener("keydown", onKeyDown);
}
