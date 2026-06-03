import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";
import { OPENING_SLIDES } from "./data.js";

const OPENING_SWIPER = {
  slidesPerView: 1,
  loop: true,
  loopAdditionalSlides: 1,
  speed: 400,
  spaceBetween: 0,
};

function appendSlideMedia(slideEl, slide) {
  if (slide.video) {
    const video = document.createElement("video");
    video.className = "opening__bg-media";
    video.src = slide.video;
    video.poster = slide.image || "";
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = false;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");
    video.preload = "auto";
    video.style.width = `${slide.mediaWidth}px`;
    video.style.left = slide.mediaLeft;

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

    slideEl.appendChild(video);
    return video;
  }

  if (slide.stacked && slide.layers) {
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
    slideEl.appendChild(stack);
    return null;
  }

  const img = document.createElement("img");
  img.className = "opening__bg-media";
  img.src = slide.image;
  img.alt = "";
  img.style.width = `${slide.mediaWidth}px`;
  img.style.left = slide.mediaLeft;
  slideEl.appendChild(img);
  return null;
}

function playActiveVideo(section, swiper) {
  section.querySelectorAll("video.opening__bg-media").forEach((node) => {
    node.pause();
  });

  const slide = swiper.slides[swiper.activeIndex];
  const video = slide?.querySelector("video.opening__bg-media");
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;

  const tryPlay = () => {
    const promise = video.play();
    if (promise?.catch) {
      promise.catch(() => {});
    }
  };

  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    tryPlay();
    return;
  }

  video.addEventListener("loadeddata", tryPlay, { once: true });
  video.load();
}

function syncPill(pillLabel, index) {
  const label = OPENING_SLIDES[index]?.label;
  if (pillLabel && label) pillLabel.textContent = label;
}

export function initOpening() {
  const section = document.querySelector(".opening");
  if (!section) return;

  const swiperEl = section.querySelector(".opening__slider");
  const wrapper = swiperEl?.querySelector(".swiper-wrapper");
  const prevBtn = section.querySelector(".opening__nav-btn--prev");
  const nextBtn = section.querySelector(".opening__nav-btn--next");
  const pillLabel = section.querySelector(".opening__location-pill .ecosystem__location-pill__label");
  if (!swiperEl || !wrapper) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let unlockedPlayback = false;

  OPENING_SLIDES.forEach((slide, i) => {
    const swiperSlide = document.createElement("div");
    swiperSlide.className = "swiper-slide";

    const inner = document.createElement("div");
    inner.className = `opening__bg-slide opening__bg-slide--${i}`;
    appendSlideMedia(inner, slide);
    swiperSlide.appendChild(inner);
    wrapper.appendChild(swiperSlide);
  });

  const openingSwiper = new Swiper(swiperEl, {
    slidesPerView: OPENING_SWIPER.slidesPerView,
    loop: OPENING_SWIPER.loop,
    loopAdditionalSlides: OPENING_SWIPER.loopAdditionalSlides,
    speed: reducedMotion ? 0 : OPENING_SWIPER.speed,
    spaceBetween: OPENING_SWIPER.spaceBetween,
    grabCursor: true,
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    on: {
      init(swiper) {
        syncPill(pillLabel, swiper.realIndex);
        playActiveVideo(section, swiper);
      },
      slideChange(swiper) {
        syncPill(pillLabel, swiper.realIndex);
      },
      slideChangeTransitionEnd(swiper) {
        playActiveVideo(section, swiper);
      },
    },
  });

  const unlock = () => {
    if (unlockedPlayback) return;
    unlockedPlayback = true;
    playActiveVideo(section, openingSwiper);
  };

  section.querySelector(".opening__media")?.addEventListener("touchstart", unlock, {
    passive: true,
    once: true,
  });
  section.querySelector(".opening__media")?.addEventListener("click", unlock, { once: true });

  return openingSwiper;
}
