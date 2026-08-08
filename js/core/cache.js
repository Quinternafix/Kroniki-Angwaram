const cache = new Map();

/**
 * Pobiera wartość z cache.
 */
export function getCache(key) {
    return cache.get(key);
}

/**
 * Sprawdza, czy element znajduje się w cache.
 */
export function hasCache(key) {
    return cache.has(key);
}

/**
 * Zapisuje wartość w cache.
 */
export function setCache(key, value) {
    cache.set(key, value);
}

/**
 * Usuwa jeden element z cache.
 */
export function deleteCache(key) {
    cache.delete(key);
}

/**
 * Czyści cały cache.
 */
export function clearCache() {
    cache.clear();
}

/**
 * Zwraca cały cache.
 * Przydatne głównie podczas debugowania.
 */
export function getAllCache() {
    return Object.fromEntries(cache);
}
