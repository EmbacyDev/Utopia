/** iOS Safari: 100vw is wider than the visible viewport — use innerWidth instead. */
export function initViewport() {
  const root = document.documentElement;

  function sync() {
    const w = window.innerWidth;
    root.style.setProperty("--app-width", `${w}px`);
    root.style.setProperty("--app-height", `${window.innerHeight}px`);

    const vv = window.visualViewport;
    if (!vv) {
      root.style.setProperty("--browser-chrome-bottom", "0px");
      return;
    }

    const chromeBottom = Math.max(
      0,
      Math.round(window.innerHeight - vv.height - vv.offsetTop),
    );
    root.style.setProperty("--browser-chrome-bottom", `${chromeBottom}px`);
  }

  sync();
  window.addEventListener("resize", sync, { passive: true });
  window.addEventListener("orientationchange", sync, { passive: true });
  window.visualViewport?.addEventListener("resize", sync, { passive: true });
  window.visualViewport?.addEventListener("scroll", sync, { passive: true });
}
