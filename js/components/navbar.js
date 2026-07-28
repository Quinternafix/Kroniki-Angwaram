export function renderNavbar() {

document.getElementById("navbar").innerHTML = `

<div class="logo">

🐉 Kroniki Angwaram

</div>

<div class="toolbar">

<input
id="search"
placeholder="Szukaj...">

<button id="pl" data-language="pl">🇵🇱</button>
<button id="en" data-language="en">🇬🇧</button>
<button id="es" data-language="es">🇪🇸</button>

</div>

`;

}
