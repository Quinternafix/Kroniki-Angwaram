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

        <img src="${character.image}" class="profile-image">

        <div>

            <h1>${character.name}</h1>
            <h2>${character.title}</h2>

            <p>${character.description}</p>

        </div>

    </div>

    <section class="info-box">
        ...
    </section>

    <section class="relations">
        ...
    </section>

    <section class="related">
        ...
    </section>

</section>

`;

}