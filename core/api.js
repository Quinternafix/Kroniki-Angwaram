const cache = new Map();

/**
 * Pobiera plik JSON z assets/data.
 *
 * Przykłady:
 *
 * getData("library")
 * getData("series/wedrowcy-switu")
 * getData("books/biala-dusza")
 */
export async function getData(file) {

    if (!file) {
        throw new Error("Nie podano nazwy pliku.");
    }

    if (cache.has(file)) {
        return cache.get(file);
    }

    const path = `assets/data/${file}.json`;

    let response;

    try {

        response = await fetch(path, {
            cache: "no-cache"
        });

    } catch {

        throw new Error(
            `Nie można połączyć się z ${path}`
        );

    }

    if (!response.ok) {

        throw new Error(
            `Nie znaleziono pliku: ${path}`
        );

    }

    const data = await response.json();

    cache.set(file, data);

    return data;

}

/**
 * Czyści cały cache.
 */
export function clearCache() {

    cache.clear();

}

/**
 * Usuwa pojedynczy wpis z cache.
 */
export function clearCacheItem(file) {

    cache.delete(file);

}

/**
 * Sprawdza, czy plik jest już w cache.
 */
export function hasCache(file) {

    return cache.has(file);

}

/**
 * Zwraca dane z cache bez pobierania.
 */
export function getCache(file) {

    return cache.get(file) ?? null;

}
