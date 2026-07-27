import { t } from "../core/i18n.js";

export function homeView() {
  return `<section class="hero">
    <h1>${t("site.title")}</h1>
    <p>${t("home.welcome")}</p>
    <p>${t("home.instructions")}</p>
  </section>`;
}
