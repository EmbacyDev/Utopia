/** Fixed cream site chrome on all screens (Figma 985:1457). */
import { isDesktopViewport } from "./adaptive.js";

let setSiteLogoMenuOpenFn = null;

export function setSiteLogoMenuOpen(open) {
  setSiteLogoMenuOpenFn?.(open);
}

/** Mobile: emblem fades for fixed chrome. Desktop: whole hero section scrolls away. */
function resolveHeroScrollTarget() {
  const isAdaptivePage = !!document.querySelector(".adapt-mobile, .adapt-desktop");
  if (isAdaptivePage && isDesktopViewport()) {
    return document.querySelector(".hero.hero--final.adapt-desktop");
  }
  if (isAdaptivePage) {
    return document.querySelector(".hero.adapt-mobile .hero__emblem");
  }
  return document.querySelector(".hero .hero__emblem");
}

export function initSiteLogo() {
  const bar = document.getElementById("site-chrome");
  if (!bar) return;

  const fixedChrome = document.body.classList.contains("has-fixed-chrome");

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  if (fixedChrome) {
    bar.hidden = false;
    bar.classList.add("is-visible");
    bar.setAttribute("aria-hidden", "false");
  }

  let pastHero = null;
  let menuPaused = false;
  let scrollTarget = null;
  let scrollObserver = null;

  const setPastHero = (value) => {
    if (pastHero === value) return;
    pastHero = value;
    document.body.classList.toggle("is-past-hero", value);
  };

  const syncPastHero = () => {
    if (!scrollTarget) {
      setPastHero(true);
      return;
    }
    setPastHero(scrollTarget.getBoundingClientRect().bottom <= 0);
  };

  const bindScrollTarget = () => {
    const nextTarget = resolveHeroScrollTarget();
    if (nextTarget === scrollTarget) {
      syncPastHero();
      return;
    }

    if (scrollObserver && scrollTarget) {
      scrollObserver.unobserve(scrollTarget);
    }

    scrollTarget = nextTarget;

    if (!scrollTarget) {
      setPastHero(true);
      setSiteLogoMenuOpenFn = () => {};
      return;
    }

    if (!scrollObserver) {
      scrollObserver = new IntersectionObserver(
        ([entry]) => {
          if (menuPaused) return;
          if (!fixedChrome) {
            const visible = !entry.isIntersecting;
            document.body.classList.toggle("is-past-hero", visible);
            if (!visible) {
              bar.classList.remove("is-visible");
              bar.setAttribute("aria-hidden", "true");
              bar.hidden = true;
              return;
            }
            bar.hidden = false;
            bar.setAttribute("aria-hidden", "false");
            requestAnimationFrame(() => bar.classList.add("is-visible"));
            return;
          }
          setPastHero(!entry.isIntersecting);
        },
        { threshold: 0 },
      );
    }

    scrollObserver.observe(scrollTarget);
    requestAnimationFrame(syncPastHero);
  };

  if (!fixedChrome) {
    bar.classList.remove("is-visible");
    bar.setAttribute("aria-hidden", "true");
    bar.hidden = true;
  }

  bindScrollTarget();

  setSiteLogoMenuOpenFn = (open) => {
    menuPaused = open;
    if (!open) syncPastHero();
  };

  const desktopMq = window.matchMedia("(min-width: 900px)");
  const onBreakpointChange = () => bindScrollTarget();
  if (desktopMq.addEventListener) desktopMq.addEventListener("change", onBreakpointChange);
  else if (desktopMq.addListener) desktopMq.addListener(onBreakpointChange);
}
