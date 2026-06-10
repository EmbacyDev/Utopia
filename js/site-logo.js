/** Hero emblem stays fixed on the first screen; compact bar slides in after hero. */
export function initSiteLogo() {
  const hero = document.querySelector(".hero");
  const bar = document.getElementById("site-logo-bar");
  if (!hero || !bar) return;

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  let ticking = false;

  const setBarVisible = (visible) => {
    const isVisible = bar.classList.contains("is-visible");
    if (isVisible === visible) return;

    if (!visible) {
      bar.classList.remove("is-visible");
      bar.setAttribute("aria-hidden", "true");
      bar.hidden = true;
      document.body.classList.remove("is-past-hero");
      return;
    }

    bar.hidden = false;
    bar.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      bar.classList.add("is-visible");
      document.body.classList.add("is-past-hero");
    });
  };

  const sync = () => {
    const heroTop = hero.getBoundingClientRect().top;
    setBarVisible(heroTop < -0.5);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(sync);
  };

  setBarVisible(false);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", sync, { passive: true });
  window.addEventListener("load", sync, { passive: true });
  window.addEventListener("hashchange", sync, { passive: true });
  requestAnimationFrame(sync);
}
