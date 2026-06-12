/** Fixed site chrome on hero (Figma 985:1457); legacy slide-in when bar starts hidden. */
let setSiteLogoMenuOpenFn = null;

export function setSiteLogoMenuOpen(open) {
  setSiteLogoMenuOpenFn?.(open);
}

export function initSiteLogo() {
  const heroEmblem = document.querySelector(".hero__emblem");
  const bar = document.getElementById("site-chrome");
  if (!bar) return;

  const fixedChrome = document.body.classList.contains("has-fixed-chrome");

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  let pastHero = null;
  let menuPaused = false;

  const setBarVisible = (visible) => {
    if (!fixedChrome) {
      const isVisible = bar.classList.contains("is-visible");
      if (isVisible === visible) return;

      if (!visible) {
        bar.classList.remove("is-visible");
        bar.setAttribute("aria-hidden", "true");
        bar.hidden = true;
        return;
      }

      bar.hidden = false;
      bar.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => {
        bar.classList.add("is-visible");
      });
    }
  };

  const setPastHero = (value) => {
    if (pastHero === value) return;
    pastHero = value;
    document.body.classList.toggle("is-past-hero", value);
    if (!fixedChrome) setBarVisible(value);
  };

  if (fixedChrome) {
    bar.hidden = false;
    bar.classList.add("is-visible");
    bar.setAttribute("aria-hidden", "false");
  } else {
    setBarVisible(false);
  }

  if (!heroEmblem) {
    setSiteLogoMenuOpenFn = () => {};
    return;
  }

  const syncPastHero = () => {
    setPastHero(heroEmblem.getBoundingClientRect().bottom <= 0);
  };

  const heroEmblemObserver = new IntersectionObserver(
    ([entry]) => {
      if (menuPaused) return;
      setPastHero(!entry.isIntersecting);
    },
    { threshold: 0 }
  );

  heroEmblemObserver.observe(heroEmblem);

  setSiteLogoMenuOpenFn = (open) => {
    menuPaused = open;
    if (!open) syncPastHero();
  };

  requestAnimationFrame(syncPastHero);
}
