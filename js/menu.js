import { DESTINATION_GROUPS, LOCATION_GROUPS } from "./data.js";
import { goToEcosystemLocation } from "./locations.js";

function scrollToDestinations() {
  const section = document.getElementById("destinations");
  if (!section) return;
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildMenuDestinations(container) {
  container.innerHTML = "";
  container.className = "menu__dest-list";

  DESTINATION_GROUPS.forEach(({ id, label }) => {
    const locations = LOCATION_GROUPS[id] || [];
    const group = document.createElement("div");
    group.className = "menu__dest-group";
    group.dataset.group = id;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "footer__dest menu__dest-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = `
      <span>${label}</span>
      <img class="menu__dest-chevron" src="assets/chevron-dark.svg" alt="" width="12" height="12" />
    `;

    const list = document.createElement("ul");
    list.className = "menu__dest-properties";
    list.hidden = true;

    if (locations.length === 0) {
      const item = document.createElement("li");
      item.className = "menu__dest-property menu__dest-property--static";
      item.textContent = "Coming soon";
      list.appendChild(item);
    } else {
      locations.forEach((loc, index) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.className = "menu__dest-property";
        link.href = `#destinations`;
        link.dataset.ecosystemGroup = id;
        link.dataset.ecosystemIndex = String(index);
        link.textContent = `${loc.name}, ${loc.country}`;
        item.appendChild(link);
        list.appendChild(item);
      });
    }

    toggle.addEventListener("click", () => {
      const open = group.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      list.hidden = !open;
    });

    group.append(toggle, list);
    container.appendChild(group);
  });
}

export function initMenu() {
  const menu = document.getElementById("site-menu");
  const toggle = document.querySelector(".dock__menu-toggle");
  if (!menu || !toggle) return;

  const destContainer = menu.querySelector("[data-menu-destinations]");
  if (destContainer) buildMenuDestinations(destContainer);

  function openMenu() {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
  }

  function isOpen() {
    return menu.classList.contains("is-open");
  }

  function navigateToProperty(group, index) {
    goToEcosystemLocation(group, index);
    scrollToDestinations();
    closeMenu();
  }

  toggle.addEventListener("click", () => {
    if (isOpen()) closeMenu();
    else openMenu();
  });

  menu.querySelectorAll(".menu__header a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  menu.querySelectorAll(".menu__exp-card, .menu__links a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  menu.querySelectorAll("[data-ecosystem-group][data-ecosystem-index]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const group = link.dataset.ecosystemGroup;
      const index = Number.parseInt(link.dataset.ecosystemIndex, 10) || 0;
      if (!group) return;
      navigateToProperty(group, index);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeMenu();
  });

  menu.addEventListener("click", (e) => {
    if (e.target === menu) closeMenu();
  });
}
