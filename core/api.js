const cache = {};

/**
 * Pobiera plik JSON z assets/data.
 * Obsługuje również podfoldery, np.:
 *
 * getData("library")
 * → assets/data/library.json
 *
 * getData("series/wedrowcy-switu")
 * → assets/data/series/wedrowcy-switu.json
 *
 * getData("books/biala-dusza")
 * → assets/data/books/biala-dusza.json
 */
export async function getData(file) {

    if (!file) {
        throw new Error("Nie podano nazwy pliku.");
    }

    if (cache[file]) {
        return cache[file];
    }

    const path = `assets/data/${file}.json`;

    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(
            `Nie znaleziono pliku: ${path}`
        );
    }

    const data = await response.json();

    cache[file] = data;

    return data;
}

/**
 * Czyści cache.
 * Można użyć podczas odświeżania danych
 * bez przeładowania strony.
 */
export function clearCache() {

    Object.keys(cache).forEach(key => {
        delete cache[key];
    });

}

/**
 * Usuwa z cache tylko jeden plik.
 */
export function clearCacheItem(file) {

    delete cache[file];

}
