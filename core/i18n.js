const translations = {
    pl: {
        "site.title": "Kroniki Angwaram",
        "nav.home": "Start",
        "nav.characters": "Postacie",
        "nav.factions": "Frakcje",
        "nav.places": "Miejsca",
        "nav.timeline": "Historia",
        "nav.searchPlaceholder": "Szukaj...",

        "timeline.title": "Historia",
        "timeline.description": "Chronologia najważniejszych wydarzeń w historii Angwaram.",
        "timeline.empty": "Brak wydarzeń do wyświetlenia."
    },

    en: {
        "site.title": "Chronicles of Angwaram",
        "nav.home": "Home",
        "nav.characters": "Characters",
        "nav.factions": "Factions",
        "nav.places": "Places",
        "nav.timeline": "History",
        "nav.searchPlaceholder": "Search...",

        "timeline.title": "History",
        "timeline.description": "A chronology of the most important events in the history of Angwaram.",
        "timeline.empty": "There are no events to display."
    },

    es: {
        "site.title": "Crónicas de Angwaram",
        "nav.home": "Inicio",
        "nav.characters": "Personajes",
        "nav.factions": "Facciones",
        "nav.places": "Lugares",
        "nav.timeline": "Historia",
        "nav.searchPlaceholder": "Buscar...",

        "timeline.title": "Historia",
        "timeline.description": "Una cronología de los acontecimientos más importantes de la historia de Angwaram.",
        "timeline.empty": "No hay eventos para mostrar."
    }
};

let currentLanguage = localStorage.getItem("language") || "pl";

export function getLanguage() {
    return currentLanguage;
}

export function t(key) {
    return translations[currentLanguage]?.[key] ?? translations.pl[key] ?? key;
}

export function localize(item, field) {
    return item.translations?.[currentLanguage]?.[field] ?? item[field] ?? "";
}

export function localizeTimeline(item, field) {

    if (!item || !item[field]) {
        return "";
    }

    const value = item[field];

    if (typeof value === "string") {
        return value;
    }

    return (
        value[currentLanguage] ||
        value.pl ||
        value.en ||
        ""
    );
}
