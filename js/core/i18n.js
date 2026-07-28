const translations = {
    pl: {
        "site.title": "Kroniki Angwaram",
        "nav.home": "Start",
        "nav.characters": "Postacie",
        "nav.factions": "Frakcje",
        "nav.places": "Miejsca",
        "nav.timeline": "Historia",
        "home.welcome": "Witaj w encyklopedii świata Angwaram.",
        "home.instructions": "Korzystaj z menu, aby przeglądać postacie, miejsca, frakcje i historię.",
        "characters.title": "Postacie",
        "factions.title": "Frakcje",
        "places.title": "Miejsca",
        "timeline.title": "Historia",
        "timeline.empty": "Ta sekcja jest w przygotowaniu.",
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
        "favorite.remove": "★ Usuń z ulubionych"
    },

    en: {
        "site.title": "Chronicles of Angwaram",
        "nav.home": "Home",
        "nav.characters": "Characters",
        "nav.factions": "Factions",
        "nav.places": "Places",
        "nav.timeline": "History",
        "home.welcome": "Welcome to the encyclopedia of the world of Angwaram.",
        "home.instructions": "Use the menu to explore characters, places, factions, and history.",
        "characters.title": "Characters",
        "factions.title": "Factions",
        "places.title": "Places",
        "timeline.title": "History",
        "timeline.empty": "This section is under construction.",
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
        "favorite.remove": "★ Remove from favorites"
    },

    es: {
        "site.title": "Crónicas de Angwaram",
        "nav.home": "Inicio",
        "nav.characters": "Personajes",
        "nav.factions": "Facciones",
        "nav.places": "Lugares",
        "nav.timeline": "Historia",
        "home.welcome": "Bienvenido a la enciclopedia del mundo de Angwaram.",
        "home.instructions": "Usa el menú para explorar personajes, lugares, facciones e historia.",
        "characters.title": "Personajes",
        "factions.title": "Facciones",
        "places.title": "Lugares",
        "timeline.title": "Historia",
        "timeline.empty": "Esta sección está en preparación.",
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
        "favorite.remove": "★ Quitar de favoritos"
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

export function applyTranslations() {
    document.documentElement.lang = currentLanguage;
    document.title = t("site.title");

    document.querySelectorAll("[data-i18n]").forEach(element => {
        element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll("[data-language]").forEach(button => {
        button.setAttribute(
            "aria-pressed",
            String(button.dataset.language === currentLanguage)
        );
    });
}

export function setLanguage(language) {
    if (!translations[language]) return;

    currentLanguage = language;
    localStorage.setItem("language", language);
    applyTranslations();
    window.dispatchEvent(new Event("languagechange"));
}

export function initI18n() {
    document.addEventListener("click", event => {
        const button = event.target.closest("[data-language]");

        if (button) {
            setLanguage(button.dataset.language);
        }
    });

    applyTranslations();
}
