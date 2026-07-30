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
import { notFoundView } from "./views/notfound.js";

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

            const id = hash.split("/")[2];

            app.innerHTML = await profileView(id);

            initProfilePage();

            return;
        }

        /* ===========================
           PROFIL FRAKCJI
        =========================== */

        if (hash.startsWith("#/factions/")) {

            const id = hash.split("/")[2];

            app.innerHTML = await factionView(id);

            return;
        }

        /* ===========================
           PROFIL MIEJSCA
        =========================== */

        if (hash.startsWith("#/places/")) {

            const id = hash.split("/")[2];

            app.innerHTML = await placeView(id);

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

                app.innerHTML = await charactersView();

                break;

            case "#/factions":

                app.innerHTML = await factionsView();

                break;

            case "#/places":

                app.innerHTML = await placesView();

                break;

            case "#/timeline":

                app.innerHTML = await timelineView();

                break;

            default:

                app.innerHTML = notFoundView();

                break;
        }

    } catch (error) {

        console.error("Błąd routera:", error);

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
