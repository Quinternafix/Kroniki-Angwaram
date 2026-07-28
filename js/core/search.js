import { state } from "../state.js";

export function initSearch() {
    window.addEventListener("languagechange", attachSearch);
    window.addEventListener("hashchange", attachSearch);
    window.addEventListener("DOMContentLoaded", attachSearch);

    attachSearch(); // próba natychmiastowa
}

function attachSearch() {
    const input = document.getElementById("searchInput");
    if (!input) return; // navbar jeszcze się nie wyrenderował

    input.addEventListener("input", () => {
        state.search = input.value.toLowerCase();
        window.dispatchEvent(new Event("hashchange"));
    });
}
