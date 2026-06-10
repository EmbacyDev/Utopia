import { buildDestinationsList } from "./destinations-nav.js";

export function initFooter() {
  const container = document.querySelector("[data-footer-destinations]");
  if (!container) return;
  buildDestinationsList(container, { idPrefix: "footer-dest" });
}
