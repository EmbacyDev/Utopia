import { LOCATION_GROUPS } from "./data.js";

export function initLocations() {
  const section = document.querySelector(".ecosystem");
  if (!section) return;

  const bg = section.querySelector(".ecosystem__bg");
  const pill = section.querySelector(".ecosystem__location-pill");
  const pillLabel = pill?.querySelector(".ecosystem__location-pill__label");
  const pillIsLink = pill?.tagName === "A";
  const tabs = [...section.querySelectorAll(".ecosystem__tab")];
  const prev = section.querySelector(".ecosystem__nav-btn--prev");
  const next = section.querySelector(".ecosystem__nav-btn--next");

  let group = "tropical";
  let index = 0;

  function currentList() {
    return LOCATION_GROUPS[group] || [];
  }

  function render() {
    const list = currentList();
    const comingSoon = list.length === 0;

    section.classList.toggle("ecosystem--coming-soon", comingSoon);
    prev?.toggleAttribute("hidden", comingSoon);
    next?.toggleAttribute("hidden", comingSoon);

    if (comingSoon) {
      const empty = "Coming soon";
      if (pillLabel) pillLabel.textContent = empty;
      else if (pill) pill.textContent = empty;
      if (pill) {
        pill.removeAttribute("title");
        pill.classList.add("ecosystem__location-pill--static");
      }
      if (pillIsLink) {
        pill.removeAttribute("href");
        pill.setAttribute("aria-disabled", "true");
      }
      if (bg) bg.style.backgroundImage = "";
    } else {
      const item = list[index];
      const label = `${item.name}, ${item.country}`;
      if (pillLabel) pillLabel.textContent = label;
      else if (pill) pill.textContent = label;
      if (pill) pill.classList.remove("ecosystem__location-pill--static");
      if (pillIsLink) {
        pill.href = `#${item.name.toLowerCase().replace(/\s+/g, "-")}`;
        pill.title = label;
        pill.removeAttribute("aria-disabled");
      }
      if (bg && item.image) {
        bg.style.backgroundImage = `
        linear-gradient(180deg, rgba(51, 47, 46, 0) 86.13%, #332f2e 108.21%),
        url("${item.image}")
      `;
      }
    }

    tabs.forEach((tab) => {
      const isActive = tab.dataset.group === group;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const g = tab.dataset.group;
      if (!g) return;
      group = g;
      index = 0;
      render();
    });
  });

  prev?.addEventListener("click", () => {
    const list = currentList();
    if (!list.length) return;
    index = (index - 1 + list.length) % list.length;
    render();
  });

  next?.addEventListener("click", () => {
    const list = currentList();
    if (!list.length) return;
    index = (index + 1) % list.length;
    render();
  });

  render();
}
