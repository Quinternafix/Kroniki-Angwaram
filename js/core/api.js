const cache = {};

export async function getData(file) {

    if (cache[file]) {

        return cache[file];

    }

    const response = await fetch(`data/${file}.json`);

    if (!response.ok) {

        throw new Error(`Nie znaleziono data/${file}.json`);

    }

    const data = await response.json();

    cache[file] = data;

    return data;

}