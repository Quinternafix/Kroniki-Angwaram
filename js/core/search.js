import { state } from "../state.js";

export function initSearch() {
    window.addEventListener("DOMContentLoaded", () => {
        const input = document.getElementById("searchInput");
        if (!input) return;

        input.addEventListener("input", () => {
            state.search = input.value.toLowerCase();
            window.dispatchEvent(new Event("hashchange"));
        });
    });
}
