# course-hider

Tampermonkey userscript that adds per-course hide/unhide buttons to the MyLS (D2L Brightspace) course selector dropdown, plus a toggle at the bottom that switches between hiding the marked courses and showing everything. Useful for decluttering the course list once a term ends.

## Install

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension.
2. Tampermonkey dashboard → **Create a new script** → delete the template → paste the contents of `script.js` → save.
3. Open MyLS and click the course selector. Each course row gets a 🚫 button to hide it (👁️ to unhide). The button at the bottom of the dropdown reads "Show Hidden Courses" while marked courses are hidden and "Hide Marked Courses" while everything is visible.

The `@include` pattern matches `https://mylearningspace.*.ca/*`. That covers institutions that host D2L under a `mylearningspace` subdomain (WLU, for one); schools on a different hostname will need the pattern changed.

## How it works

- D2L renders the course selector as a single-page app, so a `MutationObserver` on `document.body` re-runs `init()` when the DOM changes, coalesced to one pass per animation frame. Each pass is idempotent: buttons are only injected into rows and wrappers that don't already have one.
- Hidden courses are identified by their `data-org-unit-id` attribute and persisted via `GM_setValue`/`GM_getValue`, so the list survives reloads. Rows without that attribute are left alone, and a corrupted stored list is treated as empty.
- Hiding is done by setting `display: none` on the `li.d2l-datalist-item` row; the dropdown width is also relaxed so long course names aren't truncated.

## Known limitations

- Depends on D2L's internal class names (`d2l-datalist-item`, `d2l-course-selector-item`, `d2l-courseselector-wrapper`); a Brightspace UI update could break it. If the toggle container inside a row goes missing the hide button is appended to the end of the row instead.
- The hidden-course list is stored per browser/profile via Tampermonkey storage — it does not sync across machines.
- The show/hide toggle state is not persisted across page loads; every load starts with marked courses hidden.

## License

MIT — see [LICENSE](LICENSE).
