import { homeView } from "./views/home.js";
import { charactersView } from "./views/characters.js";
import { profileView } from "./views/profile.js";
import { factionsView } from "./views/factions.js";
import { placesView } from "./views/places.js";
import { timelineView } from "./views/timeline.js";
import { notFoundView } from "./views/notfound.js";

export async function router() {

    const app = document.getElementById("app");

    const hash = location.hash || "#/";

    if (hash.startsWith("#/characters/")) {

        const id = hash.split("/")[2];

        app.innerHTML = await profileView(id);

        return;

    }

    switch (hash) {

        case "#/":

            app.innerHTML = homeView();

            break;

        case "#/characters":

            app.innerHTML = await charactersView();

            break;

        case "#/characters/morgath":

            app.innerHTML = await profileView("morgath");

            break;

        case "#/factions":

            app.innerHTML = factionsView();

            break;

        case "#/factions/zjednoczone królestwo selidoru":

            app.innerHTML = await profileView("zjednoczone królestwo selidoru");

            break;

        case "#/places":

            app.innerHTML = placesView();

            break;

        case "#places/selidor":

            app.innerHTML = await profileView("selidor");

            break;

        case "#/timeline":

            app.innerHTML = timelineView();

            break;

        default:

            app.innerHTML = notFoundView();

    }

}