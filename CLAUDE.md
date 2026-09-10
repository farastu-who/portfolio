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

Deployment is GitHub Pages at https://farastu-who.github.io/portfolio/, which serves `index.html` directly as a static file. There is no Jekyll front matter anywhere and no `_config.yml`, so nothing is templated or preprocessed — what is in the repo is what ships.

Do not add a Jekyll theme or front matter to `index.html`. Its `<html>`/`<head>`/`<body>` wrapper and custom stylesheets are the whole design; a theme layout would nest the page inside its own document and override it.

## Structure

Everything lives in three files:

- `assets/Paresha_Farastu_Resume.pdf` — the resume the navbar RESUME button links to. Replacing the resume means overwriting this file; the button href needs no change.
- `index.html` — all content, hardcoded. Sections in order: `#hero` (fixed navbar + profile), `#projects`, `#research`, `#others` (reuses the `.research-container` classes), `#footer`.
- `css/style.css` — CSS custom properties, reset, navbar, hero, the projects grid, research items, footer, and every media query (breakpoints at 1000px, 670px, 600px).
- `css/utilities.css` — buttons, theme toggle, `.container`, `.header-container`, and `.card` styling including project background images.
- `js/script.js` — hamburger menu, theme toggle, footer year, project detail dialog.

Each content section follows the same shape: a `.division` rule, a `.content-text` heading block, an `<article>` of items, then a "See More" `.btn-secondary`.

The split between the two stylesheets has drifted — `.content-text` and `.division` are defined in both files. `index.html` loads `style.css` first and `utilities.css` second, so **`utilities.css` wins** on equal specificity. Check both before adding a rule.

## Projects grid — card images

`article.project` is a CSS grid (3 columns, 2 under 1000px, 1 under 600px). Project cards carry **no `<img>` element**. Each card's image is bound to an explicit class in `css/utilities.css`:

```css
.card-gamification { background: url(../assets/project/gamification.png) center center/cover; }
```

The card in `index.html` carries that class alongside `.card`:

```html
<div class="card card-gamification">
```

This replaced an earlier `.card:nth-child(n)` scheme where images were assigned by DOM position, so inserting or reordering a project silently reassigned every image after it. Reordering is now safe. **When you add a project, add its class rule in the same commit** — a card with no image class gets no background.

The EliseAI cards additionally carry `<img class="card-logo">` — the official EliseAI wordmark, saved to `assets/project/eliseai-logo.svg` from their site CDN. The supplied file is a **black** mark, so `.card-logo` inverts it to white over the dark cards, and `.detail-logo` inverts it again under `[data-theme="dark"]` inside the dialog. If you replace the asset with a white or coloured variant, drop those `filter: invert(1)` rules.

Card internals: an empty `.card-wrapper` overlay and a `.project-info` block absolutely pinned to the card bottom holding the title and tags. Note that `.project-bio` paints over `.project-link`, so the `href="#"` icon placeholders on the older cards are invisible as well as unwired.

## Project detail dialog

Cards that open a detail dialog carry `data-details="<key>"` plus `role="button"` and `tabindex="0"`, and contain a `<template data-details-for="<key>">` holding the detail copy. The `#project-modal` shell sits just before `<footer>`; `js/script.js` clones the matching template into it on click or Enter/Space, and handles Escape, backdrop click, scroll lock, focus return, and a Tab focus trap.

**All detail copy lives in `index.html` inside those templates** — it is plain markup, edit it directly. A card without `data-details` is simply not clickable — currently only Polar Bear, which has no sourced write-up.

Styling hooks: `.detail-eyebrow`, `.detail-title`, `.detail-list`, `.detail-metrics` / `.detail-metric`, `.detail-links`, `.detail-tags`. The `.detail-metrics` and `.detail-links` blocks are optional — omit them for a project with no headline numbers or no public repo.

Accent colour: the dialog sets `--detail-accent` (and `--detail-soft`) and every detail rule reads from it. It defaults to the site teal; a card with `data-brand="elise"` has that value copied onto the dialog by `script.js`, and `.project-modal[data-brand="elise"]` swaps in the EliseAI violet. To add another brand accent, add a `data-brand` value and one CSS block — do not hardcode a colour into the `.detail-*` rules. Because `.project-modal` sets `display: flex`, it also needs an explicit `.project-modal[hidden] { display: none; }` rule — do not remove it.

## Theming

Light/dark runs entirely on CSS variables. `:root` in `css/style.css` holds the light palette; the `[data-theme="dark"]` block below it overrides the same names. `switchTheme` in `js/script.js` sets `data-theme` on `<html>` and persists the choice to `localStorage` under the key `theme`, which is re-applied on load.

Add new colors as variables in **both** blocks rather than hardcoding hex values, or the element will not respond to the toggle. The EliseAI brand accent follows this: `--elise-violet` is tuned per theme (`#7638fb` light, `#a880ff` dark) while `--elise-violet-static` stays fixed for use on the always-dark project cards. Note that `switchTheme` is defined twice in `script.js`; the second definition (the one that writes to `localStorage`) is the one that runs.
