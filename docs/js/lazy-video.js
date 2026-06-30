(function () {
  function prefersWebM() {
    var v = document.createElement('video');
    return v.canPlayType('video/webm; codecs="vp9"') !== '' || v.canPlayType('video/webm') !== '';
  }

  var useWebM = prefersWebM();

  function resolveVideoUrl(src) {
    // src is e.g. "assets/tropics.mp4"
    // webm opt versions live at assets/opt/<name>.webm
    if (!useWebM) return src;
    var match = src.match(/^(assets\/)(.+)\.mp4$/i);
    if (!match) return src;
    return match[1] + 'opt/' + match[2] + '.webm';
  }

  function attachLazyVideo(video) {
    var rawSrc = video.dataset.src;
    if (!rawSrc) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');
    video.preload = 'none';

    var loaded = false;

    function load() {
      if (loaded) return;
      loaded = true;
      var src = resolveVideoUrl(rawSrc);
      video.src = src;
      video.load();

      // fallback to mp4 if webm errors
      if (useWebM) {
        video.addEventListener('error', function () {
          if (video.src !== rawSrc) {
            video.src = rawSrc;
            video.load();
            tryPlay();
          }
        }, { once: true });
      }
    }

    function tryPlay() {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }

    function play() {
      load();
      if (video.readyState >= 2) {
        tryPlay();
      } else {
        var onReady = function () {
          video.removeEventListener('canplay', onReady);
          video.removeEventListener('loadeddata', onReady);
          tryPlay();
        };
        video.addEventListener('canplay', onReady);
        video.addEventListener('loadeddata', onReady);
      }
    }

    function pause() {
      if (!video.paused) video.pause();
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) play();
        else pause();
      });
    }, { rootMargin: '160px', threshold: 0.15 });

    observer.observe(video);
  }

  window.attachLazyVideo = attachLazyVideo;

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('video[data-src]').forEach(attachLazyVideo);
  });
})();
