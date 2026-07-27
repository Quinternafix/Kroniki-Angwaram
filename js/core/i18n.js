const translations = {
    pl: {
        "site.title": "Kroniki Angwaram",
        "nav.home": "Start",
        "nav.characters": "Postacie",
        "nav.factions": "Frakcje",
        "nav.places": "Miejsca",
        "nav.timeline": "Historia",
        "loading": "Ładowanie..."
    },
    en: {
        "site.title": "Chronicles of Angwaram",
        "nav.home": "Home",
        "nav.characters": "Characters",
        "nav.factions": "Factions",
        "nav.places": "Places",
        "nav.timeline": "History",
        "loading": "Loading..."
    },
    es: {
        "site.title": "Crónicas de Angwaram",
        "nav.home": "Inicio",
        "nav.characters": "Personajes",
        "nav.factions": "Facciones",
        "nav.places": "Lugares",
        "nav.timeline": "Historia",
        "loading": "Cargando..."
    }
};

let currentLanguage = localStorage.getItem("language") || "pl";

export function t(key) {
    return translations[currentLanguage]?.[key] ?? translations.pl[key] ?? key;
}

export function applyTranslations() {
    document.documentElement.lang = currentLanguage;
    document.title = t("site.title");

    document.querySelectorAll("[data-i18n]").forEach(element => {
        element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll("[data-language]").forEach(button => {
        const isActive = button.dataset.language === currentLanguage;
        button.setAttribute("aria-pressed", String(isActive));
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
        if (button) setLanguage(button.dataset.language);
    });

    applyTranslations();
}
