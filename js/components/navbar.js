export function renderNavbar() {

document.getElementById("navbar").innerHTML = `

<div class="logo">

🐉 Kroniki Angwaram

</div>

<div class="toolbar">

<input
id="search"
placeholder="Szukaj...">

<button id="pl">🇵🇱</button>

<button id="en">🇬🇧</button>

</div>

`;

}