import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";
import { OPENING_SLIDES } from "./data.js";

const SLIDE_COUNT = OPENING_SLIDES.length;

/** No loop clones — 3 heavy videos × duplicates caused lag and dead-ends. */
const OPENING_SWIPER = {
  slidesPerView: 1,
  slidesPerGroup: 1,
  loop: false,
  speed: 400,
  spaceBetween: 0,
  resistanceRatio: 0.72,
};

const EDGE_SWIPE_PX = 48;

function appendSlideVideo(slideEl, slide) {
  const video = document.createElement("video");
  video.className = "opening__bg-media";
  video.src = slide.video;
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.autoplay = false;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "true");
  video.preload = "metadata";
  video.style.width = `${slide.mediaWidth}px`;
  video.style.left = slide.mediaLeft;
  slideEl.appendChild(video);
  return video;
}

function playActiveVideo(section) {
  const activeSlide = section.querySelector(".opening__slider .swiper-slide-active");
  const activeVideo = activeSlide?.querySelector("video.opening__bg-media");

  section.querySelectorAll("video.opening__bg-media").forEach((node) => {
    node.pause();
    if (node !== activeVideo) {
      node.preload = "metadata";
    }
  });

  if (!activeVideo) return;

  activeVideo.muted = true;
  activeVideo.defaultMuted = true;
  activeVideo.preload = "auto";

  const tryPlay = () => {
    const promise = activeVideo.play();
    if (promise?.catch) promise.catch(() => {});
  };

  if (activeVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    tryPlay();
    return;
  }

  activeVideo.addEventListener("loadeddata", tryPlay, { once: true });
  if (activeVideo.networkState !== HTMLMediaElement.NETWORK_LOADING) {
    activeVideo.load();
  }
}

function syncPill(pillLabel, index) {
  const label = OPENING_SLIDES[index]?.label;
  if (pillLabel && label) pillLabel.textContent = label;
}

function stepOpening(swiper, delta) {
  const next = (swiper.realIndex + delta + SLIDE_COUNT) % SLIDE_COUNT;
  if (next === swiper.realIndex) return;
  swiper.slideTo(next);
}

function handleEdgeSwipeWrap(swiper) {
  if (swiper.animating) return;

  const diff = swiper.touches?.diff ?? 0;
  if (Math.abs(diff) < EDGE_SWIPE_PX) return;

  const idx = swiper.realIndex;
  if (idx === SLIDE_COUNT - 1 && diff < 0) {
    swiper.slideTo(0);
  } else if (idx === 0 && diff > 0) {
    swiper.slideTo(SLIDE_COUNT - 1);
  }
}

export function initOpening() {
  const section = document.querySelector(".opening");
  if (!section) return;

  const swiperEl = section.querySelector(".opening__slider");
  const wrapper = swiperEl?.querySelector(".swiper-wrapper");
  const prevBtn = section.querySelector(".opening__nav-btn--prev");
  const nextBtn = section.querySelector(".opening__nav-btn--next");
  const pillLabel = section.querySelector(".opening__location-pill .ecosystem__location-pill__label");
  const mediaEl = section.querySelector(".opening__media");
  if (!swiperEl || !wrapper) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let unlockedPlayback = false;

  OPENING_SLIDES.forEach((slide, i) => {
    const swiperSlide = document.createElement("div");
    swiperSlide.className = "swiper-slide";

    const inner = document.createElement("div");
    inner.className = `opening__bg-slide opening__bg-slide--${i}`;
    if (slide.video) appendSlideVideo(inner, slide);
    swiperSlide.appendChild(inner);
    wrapper.appendChild(swiperSlide);
  });

  const openingSwiper = new Swiper(swiperEl, {
    slidesPerView: OPENING_SWIPER.slidesPerView,
    slidesPerGroup: OPENING_SWIPER.slidesPerGroup,
    loop: OPENING_SWIPER.loop,
    speed: reducedMotion ? 0 : OPENING_SWIPER.speed,
    spaceBetween: OPENING_SWIPER.spaceBetween,
    resistanceRatio: OPENING_SWIPER.resistanceRatio,
    grabCursor: true,
    threshold: 10,
    touchAngle: 35,
    longSwipesRatio: 0.22,
    shortSwipes: true,
    preventInteractionOnTransition: false,
    touchStartPreventDefault: false,
    watchSlidesProgress: true,
    on: {
      init(swiper) {
        syncPill(pillLabel, swiper.realIndex);
        playActiveVideo(section);
      },
      slideChangeTransitionStart() {
        section.querySelectorAll("video.opening__bg-media").forEach((node) => node.pause());
      },
      slideChangeTransitionEnd(swiper) {
        syncPill(pillLabel, swiper.realIndex);
        playActiveVideo(section);
      },
      touchEnd(swiper) {
        handleEdgeSwipeWrap(swiper);
      },
    },
  });

  prevBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    stepOpening(openingSwiper, -1);
  });

  nextBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    stepOpening(openingSwiper, 1);
  });

  const unlock = () => {
    if (unlockedPlayback) return;
    unlockedPlayback = true;
    playActiveVideo(section);
  };

  mediaEl?.addEventListener("touchstart", unlock, { passive: true, once: true });
  mediaEl?.addEventListener("click", unlock, { once: true });

  return openingSwiper;
}
