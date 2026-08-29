import { state } from "../state.js";

let attachedInput = null;

export function initSearch() {

    window.addEventListener(
        "languagechange",
        attachSearch
    );

    window.addEventListener(
        "hashchange",
        attachSearch
    );

    window.addEventListener(
        "DOMContentLoaded",
        attachSearch
    );

    attachSearch();

}

function attachSearch() {

    const input =
        document.getElementById("searchInput");

    if (!input) {
        return;
    }

    // Przywróć frazę ze state (np. po re-renderze navbara / zmianie języka)
    if (state.search && input.value !== state.search) {
        input.value = state.search;
    }

    // jeśli to ten sam input – nie doklejaj drugiego listenera
    if (attachedInput === input) {
        return;
    }

    attachedInput = input;

    input.addEventListener("input", () => {

        state.search =
            input.value
                .trim()
                .toLowerCase();

        // odśwież filtry na bieżącej stronie (postacie itd.)
        window.dispatchEvent(
            new Event("search-updated")
        );

    });

}
