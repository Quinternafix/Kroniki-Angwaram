export const state = {

    // Aktualny język
    language: localStorage.getItem("language") || "pl",

    // Tekst wyszukiwarki
    search: "",

    // Ulubione elementy
    favorites: [],

    // Aktualnie otwarta strona
    page: "",

    // Aktualne ID
    id: null,

    // Załadowane dane (cache w pamięci)
    data: {},

    // Informacja o ładowaniu
    loading: false

};
