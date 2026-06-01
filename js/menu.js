export function initMenu() {
  const menu = document.getElementById("site-menu");
  const toggle = document.querySelector(".dock__menu-toggle");
  if (!menu || !toggle) return;

  const groupLinks = menu.querySelectorAll("[data-ecosystem-group]");

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

  toggle.addEventListener("click", () => {
    if (isOpen()) closeMenu();
    else openMenu();
  });

  menu.querySelectorAll(".menu__link, .menu__sublink, .menu__header a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  groupLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const group = link.dataset.ecosystemGroup;
      if (!group) return;
      const tab = document.querySelector(`.ecosystem__tab[data-group="${group}"]`);
      if (tab) {
        e.preventDefault();
        tab.click();
        document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
      }
      closeMenu();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeMenu();
  });

  menu.addEventListener("click", (e) => {
    if (e.target === menu) closeMenu();
  });
}
