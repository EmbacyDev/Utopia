/** Hero emblem stays fixed on the first screen; compact bar slides in after hero. */
export function initSiteLogo() {
  const hero = document.querySelector(".hero");
  const bar = document.getElementById("site-logo-bar");
  if (!hero || !bar) return;

  const setBarVisible = (visible) => {
    bar.classList.toggle("is-visible", visible);
    bar.setAttribute("aria-hidden", visible ? "false" : "true");
    document.body.classList.toggle("is-past-hero", visible);
  };

  const sync = () => {
    const rect = hero.getBoundingClientRect();
    setBarVisible(rect.bottom <= 0);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) setBarVisible(false);
      else sync();
    },
    { threshold: 0 }
  );

  observer.observe(hero);
  sync();
  window.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync, { passive: true });
}
