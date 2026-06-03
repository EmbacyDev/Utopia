import { OPENING_SLIDES } from "./data.js";

export function initOpening() {
  const section = document.querySelector(".opening");
  if (!section) return;

  const sticky = section.querySelector(".opening__sticky");
  const bgRoot = section.querySelector(".opening__bg");
  const pill = section.querySelector(".opening__location-pill");
  const pillLabel = pill?.querySelector(".ecosystem__location-pill__label");
  const progressEl = section.querySelector(".opening__progress");

  OPENING_SLIDES.forEach((slide, i) => {
    const el = document.createElement("div");
    el.className = `opening__bg-slide opening__bg-slide--${i}` + (i === 0 ? " is-active" : "");

    if (slide.video) {
      const video = document.createElement("video");
      video.className = "opening__bg-media";
      video.src = slide.video;
      video.poster = slide.image || "";
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.style.width = `${slide.mediaWidth}px`;
      video.style.left = slide.mediaLeft;

      // Keep section resilient: if video fails, render static image.
      video.addEventListener(
        "error",
        () => {
          const img = document.createElement("img");
          img.className = "opening__bg-media";
          img.src = slide.image;
          img.alt = "";
          img.style.width = `${slide.mediaWidth}px`;
          img.style.left = slide.mediaLeft;
          video.replaceWith(img);
        },
        { once: true }
      );

      el.appendChild(video);
    } else if (slide.stacked && slide.layers) {
      const stack = document.createElement("div");
      stack.className = "opening__bg-stack";
      stack.style.left = slide.mediaLeft;
      stack.style.width = `${slide.mediaWidth}px`;
      slide.layers.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        stack.appendChild(img);
      });
      el.appendChild(stack);
    } else {
      const img = document.createElement("img");
      img.className = "opening__bg-media";
      img.src = slide.image;
      img.alt = "";
      img.style.width = `${slide.mediaWidth}px`;
      img.style.left = slide.mediaLeft;
      el.appendChild(img);
    }

    bgRoot?.appendChild(el);
  });

  const slides = [...section.querySelectorAll(".opening__bg-slide")];
  const mediaNodes = slides.map((slideEl) => slideEl.querySelector("video, img"));
  // Hold each step longer so swipe/scroll doesn't jump too fast.
  const HOLD_PORTION = 0.82;
  // Extra hold before Wellness.
  const FINAL_TRANSITION_HOLD = 0.75;
  let displayIndex = 0;

  function syncMediaPlayback(opacities) {
    mediaNodes.forEach((node, i) => {
      if (!(node instanceof HTMLVideoElement)) return;

      const visible = (opacities[i] || 0) > 0.12;
      if (visible) {
        if (node.paused) {
          const playPromise = node.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {});
          }
        }
      } else if (!node.paused) {
        node.pause();
      }
    });
  }

  function update(scrollProgress) {
    const slideCount = slides.length;
    if (slideCount === 0) return;

    const transitions = Math.max(1, slideCount - 1);
    const scaled = scrollProgress * transitions;
    const index = Math.min(slideCount - 1, Math.floor(scaled));
    const local = scaled - index;

    const nextIndex = Math.min(index + 1, slideCount - 1);
    let currentOpacity = 1;
    let nextOpacity = 0;

    if (index < slideCount - 1) {
      // Let the final "Wellness" slide appear earlier and stay visible longer.
      const holdPortion = index === slideCount - 2 ? FINAL_TRANSITION_HOLD : HOLD_PORTION;
      if (local > holdPortion) {
        const fadeProgress = Math.min(1, (local - holdPortion) / (1 - holdPortion));
        currentOpacity = 1 - fadeProgress;
        nextOpacity = fadeProgress;
      }
    }

    const opacities = slides.map((_, i) => {
      if (i === index) return currentOpacity;
      if (i === nextIndex) return nextOpacity;
      return 0;
    });

    slides.forEach((s, i) => {
      const opacity = opacities[i];
      s.style.opacity = String(opacity);

      if (opacity > 0) s.classList.add("is-active");
      else s.classList.remove("is-active");
    });

    syncMediaPlayback(opacities);

    const dominantIndex = opacities[nextIndex] > opacities[index] ? nextIndex : index;
    displayIndex = dominantIndex;

    const slideLabel = OPENING_SLIDES[displayIndex].label;
    if (pillLabel) pillLabel.textContent = slideLabel;
    if (pill) pill.title = slideLabel;
    if (progressEl) {
      progressEl.dataset.active = String(displayIndex);
      progressEl.querySelectorAll(".opening__progress-item").forEach((dot, i) => {
        dot.setAttribute("aria-current", i === displayIndex ? "true" : "false");
      });
    }
  }

  function syncPinState() {
    if (!sticky) return;

    const vh = window.innerHeight;
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - vh;

    sticky.classList.remove("is-pinned", "is-ended");

    if (rect.top > 0) {
      sticky.style.width = "";
    } else if (scrollable > 0 && rect.bottom <= vh + 1) {
      sticky.classList.add("is-ended");
      sticky.style.width = "";
    } else {
      sticky.classList.add("is-pinned");
      const pinW = section.getBoundingClientRect().width;
      sticky.style.width = `${pinW}px`;
    }
  }

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrollable = section.offsetHeight - vh;

    syncPinState();

    if (scrollable <= 0) {
      update(0);
      return;
    }

    const p = Math.min(1, Math.max(0, -rect.top / scrollable));
    update(p);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
}
