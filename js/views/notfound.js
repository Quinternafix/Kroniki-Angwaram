import { t } from "../core/i18n.js";

export function notFoundView() {
  return `<h1>404</h1><p>${t("notFound")}</p>`;
}
