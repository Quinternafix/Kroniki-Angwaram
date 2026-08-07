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

    if (attachedInput === input) {
        return;
    }

    attachedInput = input;

    input.addEventListener("input", () => {

        state.search =
            input.value
                .trim()
                .toLowerCase();

        window.dispatchEvent(
            new Event("hashchange")
        );

    });

}
