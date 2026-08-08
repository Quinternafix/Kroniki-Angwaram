import { t } from "../core/i18n.js";

export function homeView() {

    return `

        <section class="home-page">

            <h1 data-i18n="home.welcome">
                ${t("home.welcome")}
            </h1>

            <p data-i18n="home.instructions">
                ${t("home.instructions")}
            </p>

        </section>

    `;
}
