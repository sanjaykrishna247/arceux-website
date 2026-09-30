// Every deploy replaces the hashed files in /assets. A page that was opened (or cached)
// before a deploy can then ask for files that no longer exist, and the app goes blank.
// If an app script, stylesheet or lazy chunk fails to load, reload once to pick up
// the current version. A session flag stops reload loops.
(function () {
  var KEY = 'arceux-stale-reload';

  // returns true when it reloads; false if it already tried (then the app's own
  // fallbacks take over instead of looping)
  function reloadOnce() {
    try {
      if (sessionStorage.getItem(KEY)) return false;
      sessionStorage.setItem(KEY, String(Date.now()));
    } catch (e) {
      return false;
    }
    location.reload();
    return true;
  }

  // <script>/<link> 404s (capture phase: resource errors don't bubble)
  window.addEventListener(
    'error',
    function (e) {
      var t = e.target;
      var src = t && (t.src || t.href);
      if (src && /\/assets\//.test(src) && (t.tagName === 'SCRIPT' || t.tagName === 'LINK')) reloadOnce();
    },
    true
  );

  // lazy chunks (three.js scenes) that fail to load
  window.addEventListener('vite:preloadError', function (e) {
    if (reloadOnce()) e.preventDefault();
  });
  window.addEventListener('unhandledrejection', function (e) {
    var msg = String((e.reason && e.reason.message) || e.reason || '');
    if (/dynamically imported module|Importing a module script failed|error loading dynamically/i.test(msg)) reloadOnce();
  });

  // once the page has run fine for a while, allow a future self-heal again
  window.addEventListener('load', function () {
    setTimeout(function () {
      try {
        sessionStorage.removeItem(KEY);
      } catch (e) {}
    }, 15000);
  });
})();
