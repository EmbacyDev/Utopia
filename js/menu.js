import { DESTINATION_GROUPS, LOCATION_GROUPS } from "./data.js";
import { goToEcosystemLocation } from "./locations.js";

function scrollToDestinations() {
  const section = document.getElementById("destinations");
  if (!section) return;
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

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

function buildMenuDestinations(container, onNavigateGroup) {
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
      const navBtn = document.createElement("button");
      navBtn.type = "button";
      navBtn.className = "menu__dest-toggle menu__dest-nav";
      navBtn.textContent = label;
      navBtn.setAttribute("aria-label", `Go to ${label} — coming soon`);
      navBtn.addEventListener("click", () => onNavigateGroup(id));
      row.append(navBtn, chevron);
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

    locations.forEach((loc, index) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.className = "menu__dest-property";
      link.href = "#destinations";
      link.dataset.ecosystemGroup = id;
      link.dataset.ecosystemIndex = String(index);
      link.textContent = `${loc.name}, ${loc.country}`;
      item.appendChild(link);
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

  function navigateToProperty(group, index) {
    goToEcosystemLocation(group, index);
    scrollToDestinations();
    closeMenu();
  }

  function navigateToGroup(group) {
    goToEcosystemLocation(group, 0);
    scrollToDestinations();
    closeMenu();
  }

  if (destContainer) buildMenuDestinations(destContainer, navigateToGroup);

  toggle.addEventListener("click", () => {
    if (isOpen()) closeMenu();
    else openMenu();
  });

  menu.querySelectorAll(".menu__header a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  menu.querySelectorAll(".menu__links a").forEach((link) => {
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
