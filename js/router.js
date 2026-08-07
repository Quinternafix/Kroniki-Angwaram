import { homeView } from "./views/home.js";

import { charactersView } from "./views/characters.js";
import {
    profileView,
    initProfilePage
} from "./views/profile.js";

import { factionsView } from "./views/factions.js";
import { factionView } from "./views/faction.js";

import { placesView } from "./views/places.js";
import { placeView } from "./views/place.js";

import { timelineView } from "./views/timeline.js";

import { libraryView } from "./views/library.js";
import { seriesView } from "./views/series.js";
import { bookView } from "./views/book.js";
import { readerView } from "./views/reader.js";

import { notFoundView } from "./views/notfound.js";

import {
    highlightCurrentPage
} from "./components/navbar.js";

export async function router() {

    const app = document.getElementById("app");

    if (!app) {
        console.error("Nie znaleziono elementu #app.");
        return;
    }

    const hash = location.hash || "#/";

    try {

        /* ===========================
           PROFIL POSTACI
        =========================== */

        if (hash.startsWith("#/characters/")) {

            const id = decodeURIComponent(
                hash.split("/")[2]
            );

            app.innerHTML = await profileView(id);

            initProfilePage();

            highlightCurrentPage();

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            return;
        }

        /* ===========================
           PROFIL FRAKCJI
        =========================== */

        if (hash.startsWith("#/factions/")) {

            const id = decodeURIComponent(
                hash.split("/")[2]
            );

            app.innerHTML = await factionView(id);

            highlightCurrentPage();

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            return;
        }

        /* ===========================
           PROFIL MIEJSCA
        =========================== */

        if (hash.startsWith("#/places/")) {

            const id = decodeURIComponent(
                hash.split("/")[2]
            );

            app.innerHTML = await placeView(id);

            highlightCurrentPage();

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            return;
        }

        /* ===========================
           PROFIL SERII
        =========================== */

        if (hash.startsWith("#/series/")) {

            const id = decodeURIComponent(
                hash.split("/")[2]
            );

            app.innerHTML = await seriesView(id);

            highlightCurrentPage();

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            return;
        }

        /* ===========================
           PROFIL KSIĄŻKI
        =========================== */

        if (hash.startsWith("#/books/")) {

            const id = decodeURIComponent(
                hash.split("/")[2]
            );

            app.innerHTML = await bookView(id);

            highlightCurrentPage();

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            return;
        }

        /* ===========================
           CZYTNIK
        =========================== */

        if (hash.startsWith("#/reader/")) {

            const parts = hash.split("/");

            const book = decodeURIComponent(parts[2]);
            const chapter = decodeURIComponent(parts[3]);

            if (!book || !chapter) {

                app.innerHTML = notFoundView();

                highlightCurrentPage();

                return;

            }

            app.innerHTML = await readerView(
                book,
                chapter
            );

            highlightCurrentPage();

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            return;
        }

        /* ===========================
           GŁÓWNE STRONY
        =========================== */

        switch (hash) {

            case "#/":

                app.innerHTML = homeView();

                break;

            case "#/characters":

                app.innerHTML =
                    await charactersView();

                break;

            case "#/factions":

                app.innerHTML =
                    await factionsView();

                break;

            case "#/places":

                app.innerHTML =
                    await placesView();

                break;

            case "#/timeline":

                app.innerHTML =
                    await timelineView();

                break;

            case "#/library":

                app.innerHTML =
                    await libraryView();

                break;

            default:

                app.innerHTML =
                    notFoundView();

                break;

        }

        highlightCurrentPage();

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

    } catch (error) {

        console.error(
            "Błąd routera:",
            error
        );

        app.innerHTML = `

            <section class="error-page">

                <h1>⚠ Wystąpił błąd</h1>

                <p>
                    Nie udało się wyświetlić tej strony.
                </p>

                <pre>${error.message}</pre>

            </section>

        `;

    }

}
