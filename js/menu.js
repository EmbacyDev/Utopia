import { DESTINATION_GROUPS, LOCATION_GROUPS } from "./data.js";
import { COMING_SOON_PAGE } from "./coming-soon.js";

const ACTIVE_MENU_DESTINATION = "Jericoacoara";

function collapseMenuDestinations(container) {
  if (!container) return;
  container.querySelectorAll(".menu__dest-group.is-open").forEach((group) => {
    group.classList.remove("is-open");
    const list = group.querySelector(".menu__dest-properties");
    const toggle = group.querySelector(".menu__dest-toggle");
    if (list) list.hidden = true;
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });
}

function buildMenuDestinations(container) {
  container.innerHTML = "";
  container.className = "menu__dest-list";

  DESTINATION_GROUPS.forEach(({ id, label }) => {
    const locations = LOCATION_GROUPS[id] || [];
    const group = document.createElement("div");
    group.className = "menu__dest-group";
    group.dataset.group = id;

    const row = document.createElement("div");
    row.className = "menu__dest-row";

    const chevron = document.createElement("img");
    chevron.className = "menu__dest-chevron";
    chevron.src = "assets/chevron-dark.svg";
    chevron.alt = "";
    chevron.width = 12;
    chevron.height = 12;
    chevron.setAttribute("aria-hidden", "true");

    if (locations.length === 0) {
      const inactiveLabel = document.createElement("span");
      inactiveLabel.className = "menu__dest-toggle menu__dest-toggle--inactive";
      inactiveLabel.textContent = label;
      row.append(inactiveLabel, chevron);
      group.append(row);
      container.appendChild(group);
      return;
    }

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "menu__dest-toggle";
    toggleBtn.textContent = label;
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.setAttribute("aria-controls", `menu-dest-${id}`);

    const list = document.createElement("ul");
    list.className = "menu__dest-properties";
    list.id = `menu-dest-${id}`;
    list.hidden = true;

    locations.forEach((loc) => {
      const item = document.createElement("li");
      const text = `${loc.name}, ${loc.country}`;

      if (loc.name === ACTIVE_MENU_DESTINATION) {
        const link = document.createElement("a");
        link.className = "menu__dest-property menu__dest-property--active";
        link.href = COMING_SOON_PAGE;
        link.textContent = text;
        item.appendChild(link);
      } else {
        const label = document.createElement("span");
        label.className = "menu__dest-property";
        label.textContent = text;
        item.appendChild(label);
      }

      list.appendChild(item);
    });

    toggleBtn.addEventListener("click", () => {
      const open = !group.classList.contains("is-open");
      collapseMenuDestinations(container);
      if (open) {
        group.classList.add("is-open");
        list.hidden = false;
        toggleBtn.setAttribute("aria-expanded", "true");
      }
    });

    row.append(toggleBtn, chevron);
    group.append(row, list);
    container.appendChild(group);
  });
}

export function initMenu() {
  const menu = document.getElementById("site-menu");
  const toggle = document.querySelector(".dock__menu-toggle");
  if (!menu || !toggle) return;

  const destContainer = menu.querySelector("[data-menu-destinations]");

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
    collapseMenuDestinations(destContainer);
  }

  function isOpen() {
    return menu.classList.contains("is-open");
  }

  if (destContainer) buildMenuDestinations(destContainer);

  toggle.addEventListener("click", () => {
    if (isOpen()) closeMenu();
    else openMenu();
  });

  menu.querySelectorAll(".menu__header a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  menu.querySelectorAll(".menu__dest-property--active").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeMenu();
  });

  menu.addEventListener("click", (e) => {
    if (e.target === menu) closeMenu();
  });
}
