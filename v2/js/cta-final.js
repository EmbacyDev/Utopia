import { attachLazyVideo, ensureVideoSource } from "./lazy-media.js";

/** Final CTA background video — load and autoplay when visible. */
export function initCtaFinal() {
  const section = document.querySelector(".cta-final");
  const video = section?.querySelector("video");
  if (!video) return;

  const rawSrc = video.dataset.src;
  if (!rawSrc) return;

  let unlocked = false;

  const tryPlay = () => {
    ensureVideoSource(video, rawSrc);
    const promise = video.play();
    if (promise?.catch) {
      promise.catch(() => {
        if (unlocked) video.play().catch(() => {});
      });
    }
  };

  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    tryPlay();
  };

  document.addEventListener("touchstart", unlock, { passive: true, once: true });
  document.addEventListener("click", unlock, { once: true });

  video.addEventListener("loadeddata", tryPlay);
  video.addEventListener("canplay", tryPlay);

  attachLazyVideo(video, { rootMargin: "240px", threshold: 0.08 });
}
