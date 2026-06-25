# CLAUDE.md – Northvale Trust prototype

Clickable HTML/CSS/JS prototype of a grant-making charity site, built from a
Figma UI kit + screen designs and deployed to GitHub Pages.

## Stack & hard constraints
- Plain **HTML/CSS/JS, no build step, no dependencies**. Do not introduce a
  bundler, framework, or Tailwind.
- Must stay **WordPress-portable**: stable BEM class names, CSS in separate
  files, layout parts isolated so they map to `header.php` / `footer.php`.
- CSS lives in `.css` files only – never inline `<style>` blocks or PHP-style
  inlining. Use en-dashes, never em-dashes.

## Brand is a deliberate placeholder
The site reads **"The Northvale Trust"**. This is a neutralised stand-in for a
real charity (renamed to remove identifiability). Keep all identity fictional:
name, founder ("Sir Edmund Hartley"), address (Northvale House, 40 Charterhouse
Street, London EC1M 6JN), phone (+44 (0) 20 7946 0321), email
(grants@northvale.org), reg numbers (8421006 / 1199240). **Never reintroduce the
original org's name or real data.**

## Design tokens (source of styling truth)
- `assets/css/tokens.css` holds every colour/space/radius/type value as CSS
  custom properties, mirroring the Figma variables.
- **Always reference `var(--token)`; never hard-code a hex or px value** in
  `styles.css` or markup.
- Key tokens: `--action-primary #0f7a6e`, `--accent #1aa597`,
  `--bg-brand #0f2540` (navy hero/header/footer), `--bg-mint #dbf1ee`,
  `--bg-card #f7f8fa`.

## Shared layout = single source of truth
`assets/js/components.js` renders the navbar + footer into `#site-header` /
`#site-footer` on every page (pure JS injection, works over `file://`). Active
nav is driven by `<body data-page="home|about|faq|news|contact">` (empty string
= no active item, e.g. eligibility/404). Edit the navbar/footer **here only**.

`assets/js/app.js` holds the NEWS data array, FAQ accordion, contact form, and
the eligibility quiz logic.

## Pages
`index` (home) · `about` · `faq` · `news` · `news-article` · `contact` ·
`eligibility` (JS quiz) · `404`. Plus `ui-kit/` = living design-system page,
rendered from the same `tokens.css` / `styles.css`.

## Figma is the design source of truth
- File key `KfvtRlhJhxJYM0ic2HXmPe`. Pages: `🎨 UI Kit`,
  `🖥 Screens · Desktop` (section `1:733`), `📱 Screens · Mobile` (`1:1217`).
- Desktop frame IDs: Home `1:168`, About `1:283`, FAQ `1:351`, News `1:429`,
  News Article `1:518`, Contact `1:566`, Eligibility `1:635`, 404 `1:691`.
- Read it via the **figma-console** bridge (`figma_capture_screenshot`,
  `figma_execute`). The official Figma MCP is rate-limited on the Starter plan.
- **Version history / diff needs a `FIGMA_ACCESS_TOKEN`** in the figma-console
  MCP config; the bridge alone only exposes current state.
- When the design and code both change, apply the same edits in both places
  (e.g. the rename was scripted across files *and* applied to Figma text nodes).

## Deploy
- Repo: `jubejuss/northvale-trust-prototype` (public). GitHub Pages from
  `main` / root. `.nojekyll` present.
- Publish updates: `git add <files>` → commit (end message with the
  `Co-Authored-By` trailer) → `git push origin main`. Pages rebuilds in ~1-2 min.
- Live: https://jubejuss.github.io/northvale-trust-prototype/ (+ `/ui-kit/`).

## Gotchas
- Shell is **zsh**: unquoted `$var` does NOT word-split. Use arrays
  (`files=( ... ); cmd "${files[@]}"`) when passing file lists to perl/sed.
- See `README.md` for the full structure and the WordPress porting table.
