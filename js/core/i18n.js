const translations = {
    pl: {
        "site.title": "Kroniki Angwaram",

        "nav.home": "Start",
        "nav.characters": "Postacie",
        "nav.factions": "Frakcje",
        "nav.places": "Miejsca",
        "nav.timeline": "Historia",
        "nav.library": "Biblioteka",
        "nav.searchPlaceholder": "Szukaj...",

        "home.welcome": "Witaj w encyklopedii świata Angwaram.",
        "home.instructions": "Korzystaj z menu, aby przeglądać postacie, miejsca, frakcje i historię.",

        "characters.title": "Postacie",
        "factions.title": "Frakcje",
        "places.title": "Miejsca",
        "timeline.title": "Historia",
        "timeline.description": "Chronologia najważniejszych wydarzeń w historii Angwaram.",
        "timeline.empty": "Brak wydarzeń do wyświetlenia.",

        "common.open": "Otwórz profil",
        "common.home": "Start",
        "common.none": "Brak",
        "common.noData": "Brak danych",

        "profile.notFound": "Nie znaleziono postaci.",
        "profile.notFoundDescription": "Taka postać nie istnieje.",
        "profile.info": "Informacje",
        "profile.race": "Rasa",
        "profile.nation": "Naród",
        "profile.faction": "Frakcja",
        "profile.rank": "Ranga",
        "profile.status": "Status",
        "profile.birth": "Data urodzenia",
        "profile.friends": "Przyjaciele",
        "profile.enemies": "Wrogowie",
        "profile.related": "Powiązane artykuły",
        "profile.home": "Miejsce zamieszkania",
        "profile.parents": "Rodzice",
        "profile.siblings": "Rodzeństwo",
        "profile.gallery": "Galeria",
        "profile.lifeStages": "Etapy życia",
        "profile.quotes": "Cytaty",

        "faction.members": "Członkowie",

        "place.characters": "Powiązane postacie",
        "place.factions": "Powiązane frakcje",

        "notFound": "Nie znaleziono strony.",
        "loading": "Ładowanie...",

        "favorite.add": "⭐ Dodaj do ulubionych",
        "favorite.remove": "★ Usuń z ulubionych",

        "error.notFoundFile": "Nie znaleziono"
    },

    en: {
        "site.title": "Chronicles of Angwaram",

        "nav.home": "Home",
        "nav.characters": "Characters",
        "nav.factions": "Factions",
        "nav.places": "Places",
        "nav.timeline": "History",
        "nav.library": "Library",
        "nav.searchPlaceholder": "Search...",

        "home.welcome": "Welcome to the encyclopedia of the world of Angwaram.",
        "home.instructions": "Use the menu to explore characters, places, factions, and history.",

        "characters.title": "Characters",
        "factions.title": "Factions",
        "places.title": "Places",
        "timeline.title": "History",
        "timeline.description": "A chronology of the most important events in the history of Angwaram.",
        "timeline.empty": "There are no events to display.",

        "common.open": "Open profile",
        "common.home": "Home",
        "common.none": "None",
        "common.noData": "No data",

        "profile.notFound": "Character not found.",
        "profile.notFoundDescription": "This character does not exist.",
        "profile.info": "Information",
        "profile.race": "Race",
        "profile.nation": "Nation",
        "profile.faction": "Faction",
        "profile.rank": "Rank",
        "profile.status": "Status",
        "profile.birth": "Date of birth",
        "profile.friends": "Friends",
        "profile.enemies": "Enemies",
        "profile.related": "Related articles",
        "profile.home": "Residence",
        "profile.parents": "Parents",
        "profile.siblings": "Siblings",
        "profile.gallery": "Gallery",
        "profile.lifeStages": "Life stages",
        "profile.quotes": "Quotes",

        "faction.members": "Members",

        "place.characters": "Related characters",
        "place.factions": "Related factions",

        "notFound": "Page not found.",
        "loading": "Loading...",

        "favorite.add": "⭐ Add to favorites",
        "favorite.remove": "★ Remove from favorites",

        "error.notFoundFile": "File not found"
    },

    es: {
        "site.title": "Crónicas de Angwaram",

        "nav.home": "Inicio",
        "nav.characters": "Personajes",
        "nav.factions": "Facciones",
        "nav.places": "Lugares",
        "nav.timeline": "Historia",
        "nav.library": "Biblioteca",
        "nav.searchPlaceholder": "Buscar...",

        "home.welcome": "Bienvenido a la enciclopedia del mundo de Angwaram.",
        "home.instructions": "Usa el menú para explorar personajes, lugares, facciones e historia.",

        "characters.title": "Personajes",
        "factions.title": "Facciones",
        "places.title": "Lugares",
        "timeline.title": "Historia",
        "timeline.description": "Una cronología de los acontecimientos más importantes de la historia de Angwaram.",
        "timeline.empty": "No hay eventos para mostrar.",

        "common.open": "Abrir perfil",
        "common.home": "Inicio",
        "common.none": "Ninguno",
        "common.noData": "Sin datos",

        "profile.notFound": "Personaje no encontrado.",
        "profile.notFoundDescription": "Este personaje no existe.",
        "profile.info": "Información",
        "profile.race": "Raza",
        "profile.nation": "Nación",
        "profile.faction": "Facción",
        "profile.rank": "Rango",
        "profile.status": "Estado",
        "profile.birth": "Fecha de nacimiento",
        "profile.friends": "Amigos",
        "profile.enemies": "Enemigos",
        "profile.related": "Artículos relacionados",
        "profile.home": "Residencia",
        "profile.parents": "Padres",
        "profile.siblings": "Hermanos",
        "profile.gallery": "Galería",
        "profile.lifeStages": "Etapas de la vida",
        "profile.quotes": "Citas",

        "faction.members": "Miembros",

        "place.characters": "Personajes relacionados",
        "place.factions": "Facciones relacionadas",

        "notFound": "Página no encontrada.",
        "loading": "Cargando...",

        "favorite.add": "⭐ Añadir a favoritos",
        "favorite.remove": "★ Quitar de favoritos",

        "error.notFoundFile": "Archivo no encontrado"
    }
};

let currentLanguage = localStorage.getItem("language") || "pl";

/**
 * Zwraca aktualny język.
 */
export function getLanguage() {
    return currentLanguage;
}

/**
 * Tłumaczy klucz interfejsu.
 *
 * Przykład:
 * t("profile.race")
 * -> Rasa / Race / Raza
 */
export function t(key) {
    return (
        translations[currentLanguage]?.[key] ??
        translations.pl?.[key] ??
        key
    );
}

/**
 * Pobiera przetłumaczoną wartość pola z obiektu.
 *
 * Obsługiwane formaty:
 *
 * 1.:
 * translations: {
 *   en: {
 *     race: "Half-dragon"
 *   }
 * }
 *
 * 2.:
 * title: {
 *   pl: "Obecnie",
 *   en: "Present",
 *   es: "Actualidad"
 * }
 *
 * 3.:
 * title: "Obecnie"
 */
export function localize(item, field) {
    if (!item || typeof item !== "object") {
        return "";
    }

    const language = currentLanguage;
    const fallbackLanguage = "pl";

    /*
     * 1. Najpierw szukamy:
     *
     * translations[currentLanguage][field]
     */
    const translated = item.translations?.[language]?.[field];

    if (
        translated !== undefined &&
        translated !== null &&
        translated !== ""
    ) {
        return translated;
    }

    /*
     * 2. Jeżeli brak tłumaczenia danego języka,
     * próbujemy polskiego.
     */
    const translatedPl = item.translations?.[fallbackLanguage]?.[field];

    if (
        translatedPl !== undefined &&
        translatedPl !== null &&
        translatedPl !== ""
    ) {
        return translatedPl;
    }

    /*
     * 3. Pole może być zapisane jako obiekt językowy:
     *
     * title: {
     *   pl: "Obecnie",
     *   en: "Present",
     *   es: "Actualidad"
     * }
     */
    const value = item[field];

    if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
    ) {
        const localizedValue = value[language];

        if (
            localizedValue !== undefined &&
            localizedValue !== null &&
            localizedValue !== ""
        ) {
            return localizedValue;
        }

        const polishValue = value[fallbackLanguage];

        if (
            polishValue !== undefined &&
            polishValue !== null &&
            polishValue !== ""
        ) {
            return polishValue;
        }

        /*
         * Dodatkowy fallback, gdyby obiekt nie miał polskiego.
         */
        const englishValue = value.en;

        if (
            englishValue !== undefined &&
            englishValue !== null &&
            englishValue !== ""
        ) {
            return englishValue;
        }

        const spanishValue = value.es;

        if (
            spanishValue !== undefined &&
            spanishValue !== null &&
            spanishValue !== ""
        ) {
            return spanishValue;
        }
    }

    /*
     * 4. Zwykła wartość tekstowa.
     */
    if (
        value !== undefined &&
        value !== null &&
        value !== ""
    ) {
        return String(value);
    }

    return "";
}

/**
 * Tłumaczy dowolną wartość.
 *
 * Szczególnie przydatne dla:
 * - nazw galerii,
 * - nazw etapów życia,
 * - nazw portretów,
 * - innych pól zapisanych jako:
 *
 * {
 *   pl: "...",
 *   en: "...",
 *   es: "..."
 * }
 */
export function localizeValue(value) {
    if (value === undefined || value === null) {
        return "";
    }

    /*
     * Obiekt językowy.
     */
    if (
        typeof value === "object" &&
        !Array.isArray(value)
    ) {
        return (
            value[currentLanguage] ??
            value.pl ??
            value.en ??
            value.es ??
            ""
        );
    }

    /*
     * Zwykły tekst.
     */
    return String(value);
}

/**
 * Nakłada tłumaczenia na elementy HTML
 * posiadające data-i18n.
 */
export function applyTranslations() {
    document.documentElement.lang = currentLanguage;

    document.title = t("site.title");

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {
            element.textContent = t(
                element.dataset.i18n
            );
        });

    document
        .querySelectorAll("[data-language]")
        .forEach(button => {
            button.setAttribute(
                "aria-pressed",
                String(
                    button.dataset.language ===
                    currentLanguage
                )
            );
        });
}

/**
 * Zmienia język strony.
 */
export function setLanguage(language) {
    if (!translations[language]) {
        return;
    }

    currentLanguage = language;

    localStorage.setItem(
        "language",
        language
    );

    applyTranslations();

    window.dispatchEvent(
        new Event("languagechange")
    );
}

/**
 * Inicjalizacja systemu tłumaczeń.
 */
export function initI18n() {
    document.addEventListener(
        "click",
        event => {
            const button =
                event.target.closest(
                    "[data-language]"
                );

            if (button) {
                setLanguage(
                    button.dataset.language
                );
            }
        }
    );

    applyTranslations();
}
