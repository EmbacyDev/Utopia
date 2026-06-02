export function initCtaFinal() {
  const section = document.querySelector(".cta-final");
  const video = section?.querySelector(".cta-final__bg video");
  if (!video) return;

  const poster = video.getAttribute("poster");

  function tryPlay() {
    if (!video.isConnected) return;
    const promise = video.play();
    if (promise?.catch) {
      promise.catch(() => {});
    }
  }

  video.addEventListener(
    "error",
    () => {
      if (!poster) return;
      const img = document.createElement("img");
      img.className = "cta-final__bg-media";
      img.src = poster;
      img.alt = "";
      video.replaceWith(img);
    },
    { once: true }
  );

  video.addEventListener("loadeddata", tryPlay, { once: true });
  tryPlay();

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) tryPlay();
          else video.pause();
        });
      },
      { threshold: 0.12 }
    );
    io.observe(section);
  }
}
