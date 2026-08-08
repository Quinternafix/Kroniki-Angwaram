import { t } from "../core/i18n.js";

export function renderFooter() {

    const footer = document.getElementById("footer");

    if (!footer) {
        return;
    }

    footer.innerHTML = `
        <span>
            © 2026 ${t("site.title")}
        </span>
    `;
}
