import { homeView } from "./views/home.js";
import { charactersView } from "./views/characters.js";
import { profileView } from "./views/profile.js";
import { factionsView } from "./views/factions.js";
import { placesView } from "./views/places.js";
import { timelineView } from "./views/timeline.js";
import { notFoundView } from "./views/notfound.js";

export async function router() {

    const app = document.getElementById("app");

    if (location.hash.startsWith("#/characters/")) {

        const id = location.hash.split("/")[2];

        app.innerHTML = await profileView(id);

        return;
    }

    switch (location.hash || "#/") {

        case "#/":
            app.innerHTML = homeView();
            break;

        case "#/characters":
            app.innerHTML = await charactersView();
            break;

        case "#/factions":
            app.innerHTML = factionsView();
            break;

        case "#/places":
            app.innerHTML = placesView();
            break;

        case "#/timeline":
            app.innerHTML = timelineView();
            break;

        default:
            app.innerHTML = notFoundView();
            break;
    }
}