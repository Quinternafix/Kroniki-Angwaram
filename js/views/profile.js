import { getData } from "../core/api.js";

export async function profileView(id) {

    const characters = await getData("characters");

    const character = characters.find(c => c.id === id);

    if (!character) {

        return `
            <h1>Nie znaleziono postaci.</h1>

            <p>
                Taka postać nie istnieje.
            </p>
        `;

    }

    return `

<section class="profile">

<div class="profile-header">

<img
src="${character.image}"
alt="${character.name}"
class="profile-image">

<div class="profile-text">

<h1>${character.name}</h1>

<h2>${character.title}</h2>

<p>${character.description}</p>

</div>

</div>

<h2>Informacje</h2>

<table class="infobox">

<tr>

<th>Rasa</th>

<td>${character.race}</td>

</tr>

<tr>

<th>Naród</th>

<td>${character.nation}</td>

</tr>

<tr>

<th>Frakcja</th>

<td>${character.faction}</td>

</tr>

<tr>

<th>Ranga</th>

<td>${character.rank}</td>

</tr>

<tr>

<th>Status</th>

<td>${character.status}</td>

</tr>

<tr>

<th>Data urodzenia</th>

<td>${character.birth}</td>

</tr>

</table>

<p>

<a href="#/characters">

← Powrót do listy postaci

</a>

</p>

</section>

`;

}