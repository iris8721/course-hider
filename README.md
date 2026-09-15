# course-hider

Tampermonkey userscript that adds per-course hide/unhide buttons to the MyLS (D2L Brightspace) course selector dropdown, plus a "Show All Courses" toggle. Useful for decluttering the course list once a term ends.

## Install

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension.
2. Tampermonkey dashboard → **Create a new script** → delete the template → paste the contents of `script.js` → save.
3. Open MyLS and click the course selector. Each course row gets a 🚫 button to hide it (👁️ to unhide), and a toggle button at the bottom of the dropdown switches between showing all courses and only unhidden ones.

The `@include` pattern matches `https://mylearningspace.*.ca/*`, so it should work across Canadian institutions running D2L.

## How it works

- D2L renders the course selector as a single-page app, so a `MutationObserver` on `document.body` re-runs `init()` whenever the DOM changes. Each pass is idempotent: buttons are only injected into rows that don't already have one.
- Hidden courses are identified by their `data-org-unit-id` attribute and persisted via `GM_setValue`/`GM_getValue`, so the list survives reloads.
- Hiding is done by setting `display: none` on the `li.d2l-datalist-item` row; the dropdown width is also relaxed so long course names aren't truncated.

## Known limitations

- Depends on D2L's internal class names (`d2l-datalist-item`, `d2l-course-selector-item`, `d2l-courseselector-wrapper`); a Brightspace UI update could break it.
- The hidden-course list is stored per browser/profile via Tampermonkey storage — it does not sync across machines.
- The "Show All / Show Only Marked" toggle state is not persisted across page loads.

## License

MIT — see [LICENSE](LICENSE).
