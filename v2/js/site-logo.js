/** Fixed top chrome slides in once the hero logo row scrolls off-screen (~150px). */
let setSiteLogoMenuOpenFn = null;

export function setSiteLogoMenuOpen(open) {
  setSiteLogoMenuOpenFn?.(open);
}

export function initSiteLogo() {
  const heroChrome = document.querySelector(".hero__chrome");
  const bar = document.getElementById("site-chrome");
  if (!heroChrome || !bar) return;

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  let pastHero = null;
  let menuPaused = false;

  const setBarVisible = (visible) => {
    const isVisible = bar.classList.contains("is-visible");
    if (isVisible === visible) return;

    document.body.classList.toggle("is-past-hero", visible);

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
  };

  const setPastHero = (value) => {
    if (pastHero === value) return;
    pastHero = value;
    setBarVisible(value);
  };

  function readPastHeroLogo() {
    const { bottom } = heroChrome.getBoundingClientRect();
    return bottom <= 0;
  }

  function syncSiteChrome() {
    setPastHero(readPastHeroLogo());
  }

  const heroChromeObserver = new IntersectionObserver(
    ([entry]) => {
      if (menuPaused) return;
      setPastHero(!entry.isIntersecting);
    },
    { threshold: 0 }
  );

  heroChromeObserver.observe(heroChrome);

  setSiteLogoMenuOpenFn = (open) => {
    menuPaused = open;
    if (!open) syncSiteChrome();
  };

  setBarVisible(false);
  requestAnimationFrame(syncSiteChrome);
}
