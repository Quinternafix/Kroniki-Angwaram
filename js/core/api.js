import { t } from "./i18n.js";

const cache = {};

export async function getData(file) {

    if (cache[file]) {
        return cache[file];
    }

    const response = await fetch(
        `assets/data/${file}.json`
    );

    if (!response.ok) {
        throw new Error(
            `${t("error.notFoundFile")} assets/data/${file}.json`
        );
    }

    const data = await response.json();

    cache[file] = data;

    return data;
}
