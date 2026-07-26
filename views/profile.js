import { getData } from "../core/api.js";

export async function profileView(id){

    const characters = await getData("characters");

    const character = characters.find(c => c.id === id);

    if(!character){
        return "<h1>Nie znaleziono postaci.</h1>";
    }

    return `
        <div class="profile">

            <div class="profile-header">

                <img src="${character.image}" class="profile-image">

                <div>

                    <h1>${character.name}</h1>

                    <h2>${character.title}</h2>

                    <p>${character.description}</p>

                </div>

            </div>

            <hr>

            <h3>Informacje</h3>

            <table class="infobox">

                <tr><td>Rasa</td><td>${character.race}</td></tr>
                <tr><td>Naród</td><td>${character.nation}</td></tr>
                <tr><td>Frakcja</td><td>${character.faction}</td></tr>
                <tr><td>Ranga</td><td>${character.rank}</td></tr>
                <tr><td>Status</td><td>${character.status}</td></tr>
                <tr><td>Data urodzenia</td><td>${character.birth}</td></tr>

            </table>

        </div>
    `;
}