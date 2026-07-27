export function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

export function saveFavorites(list) {
    localStorage.setItem("favorites", JSON.stringify(list));
}