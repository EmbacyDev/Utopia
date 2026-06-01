import { OPENING_SLIDES } from "./data.js";

export function initOpening(parallax) {
  const section = document.querySelector(".opening");
  if (!section) return;

  const bgRoot = section.querySelector(".opening__bg");
  const label = section.querySelector(".opening__caption-label");
  const progressEl = section.querySelector(".opening__progress");

  OPENING_SLIDES.forEach((slide, i) => {
    const el = document.createElement("div");
    el.className = `opening__bg-slide opening__bg-slide--${i}` + (i === 0 ? " is-active" : "");

    if (slide.stacked && slide.layers) {
      const stack = document.createElement("div");
      stack.className = "opening__bg-stack";
      stack.style.left = slide.mediaLeft;
      stack.style.width = `${slide.mediaWidth}px`;
      slide.layers.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.dataset.parallax = "opening";
        stack.appendChild(img);
        parallax?.register(img);
      });
      el.appendChild(stack);
    } else {
      const img = document.createElement("img");
      img.className = "opening__bg-media";
      img.dataset.parallax = "opening";
      img.src = slide.image;
      img.alt = "";
      img.style.width = `${slide.mediaWidth}px`;
      img.style.left = slide.mediaLeft;
      el.appendChild(img);
      parallax?.register(img);
    }

    bgRoot?.appendChild(el);
  });

  const slides = [...section.querySelectorAll(".opening__bg-slide")];

  function update(scrollProgress) {
    const slideCount = slides.length;
    const scaled = scrollProgress * slideCount;
    const index = Math.min(slideCount - 1, Math.floor(scaled));
    const local = scaled - index;

    slides.forEach((s, i) => {
      if (i === index) {
        s.classList.add("is-active");
        s.style.opacity = String(1 - local * 0.35);
      } else if (i === index + 1) {
        s.classList.add("is-active");
        s.style.opacity = String(local * 0.85);
      } else {
        s.classList.remove("is-active");
        s.style.opacity = "";
      }
    });

    if (label) label.textContent = OPENING_SLIDES[index].label;
    if (progressEl) {
      progressEl.dataset.active = String(index);
      const pillOffsets = [0, 14, 28];
      const next = pillOffsets[Math.min(index + 1, pillOffsets.length - 1)];
      const x = pillOffsets[index] + (next - pillOffsets[index]) * local;
      progressEl.style.setProperty("--pill-x", `${x}px`);
    }
  }

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const p = Math.min(1, Math.max(0, -rect.top / scrollable));
    update(p);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
