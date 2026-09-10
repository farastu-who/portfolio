# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow rules

**All changes go on a new branch. Never commit directly to `main`.** Branch first (`git checkout -b <name>`), commit there, and open a PR against `main`. This applies even to one-line content edits.

**Always report the work in detail.** When finishing a change, state:

- **Steps taken** — the sequence actually followed, in order.
- **What changed** — the concrete edits, not a summary of intent.
- **Why** — the reason each change was made.
- **Where** — the file and line or section for every change.

Do this for every change, however small. Do not collapse multiple edits into a single vague sentence, and do not report a step as done unless it was actually run.

## Project

Personal portfolio site for Paresha Farastu — a single static page with no framework, no build step, and no test suite. Customized from the CommunityPro `portfolio-html` template, so some template leftovers remain (the footer copyright still reads "Communitypro"; the Open Graph and Twitter meta tags in `<head>` are commented out — see `Metatags.md` for the template's instructions on regenerating them).

There is no `package.json`, no bundler, and nothing to install. The only external dependencies are two CDN links in `index.html`: Font Awesome 5.15.4 for icons, and Google Fonts Raleway (imported at the top of `css/style.css`).

## Running it

Open `index.html` in a browser, or serve the directory:

```sh
python3 -m http.server 5501
```

`.vscode/settings.json` pins VS Code Live Server to port 5501. `.gitpod.yml` is an unmodified template stub (both tasks are `echo 'TODO'`) and does not build or run anything.

Deployment is GitHub Pages. `_config.yml` sets `theme: jekyll-theme-cayman`, but since `index.html` sits at the repo root it is served as-is and the Jekyll theme has no visible effect.

## Structure

Everything lives in three files:

- `index.html` — all content, hardcoded. Sections in order: `#hero` (fixed navbar + profile), `#projects`, `#research`, `#others` (reuses the `.research-container` classes), `#footer`.
- `css/style.css` — CSS custom properties, reset, navbar, hero, the projects grid, research items, footer, and every media query (breakpoints at 1000px, 670px, 600px).
- `css/utilities.css` — buttons, theme toggle, `.container`, `.header-container`, and `.card` styling including project background images.
- `js/script.js` — hamburger menu, theme toggle, footer year.

Each content section follows the same shape: a `.division` rule, a `.content-text` heading block, an `<article>` of items, then a "See More" `.btn-secondary`.

The split between the two stylesheets has drifted — `.content-text` and `.division` are defined in both files, and `style.css` (loaded second) wins. Check both before adding a rule.

## Projects grid — image coupling

`article.project` is a CSS grid (3 columns, 2 under 1000px, 1 under 600px). Project cards carry **no `<img>` element**. Each card's image is assigned by DOM position in `css/utilities.css`:

```css
.card:nth-child(1) { background: url(../assets/project/gamification.png) center center/cover; }
/* … through nth-child(9) */
```

**Reordering, inserting, or removing a project silently reassigns the image of every card after it.** When changing the project list, update the matching `nth-child` block in the same commit.

Card internals: an empty `.card-wrapper` overlay, a `.project-info` block absolutely pinned to the card bottom holding the title and tags, and two `.project-link` icons. Those icons are all `href="#"` placeholders and are not wired to real URLs.

## Theming

Light/dark runs entirely on CSS variables. `:root` in `css/style.css` holds the light palette; the `[data-theme="dark"]` block below it overrides the same names. `switchTheme` in `js/script.js` sets `data-theme` on `<html>` and persists the choice to `localStorage` under the key `theme`, which is re-applied on load.

Add new colors as variables in **both** blocks rather than hardcoding hex values, or the element will not respond to the toggle. Note that `switchTheme` is defined twice in `script.js`; the second definition (the one that writes to `localStorage`) is the one that runs.
