# The Northvale Trust – clickable prototype

Static HTML/CSS/JS prototype built to match the Figma file
(`KfvtRlhJhxJYM0ic2HXmPe`) — both the UI Kit and the
**Screens · Desktop / Mobile** page designs. No build step, no dependencies.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Pages (all 8 Figma screens)

```
index.html         Home (navy hero, Our Categories, Applying-for-funding band, News & Blogs)
about.html         About Us (page header, intro + Trustees, Meet Our Team)
faq.html           FAQ (Our Funding + Our Application Process accordions)
news.html          Latest News (6-card grid)
news-article.html  News article (February Grants List blog post)
contact.html       Contact Us (enquiry form + contact details)
eligibility.html   Eligibility Quiz (5-step interactive quiz with result)
404.html           Page not found
assets/
  css/tokens.css   Design tokens → CSS custom properties (1:1 from Figma variables)
  css/styles.css   BEM component + layout styles
  js/components.js Shared navbar + footer (single source of truth)
  js/app.js        News rendering, FAQ accordion, contact form, quiz logic
  img/news.jpg     Featured image (exported from Figma)
```

## Prototype navigation

- Navbar / logo / footer link to the correct pages; active page is highlighted
  via `<body data-page="...">`.
- Home hero **Apply for funding → Eligibility Quiz**.
- Applying-for-funding band: **Apply for funding → Eligibility**, **FAQ → FAQ**.
- News cards **Read more →** the article (first card) / news list.
- FAQ **Check your eligibility → Eligibility**, **Ask a question → Contact**.
- Eligibility quiz: Back/Next through 5 questions → eligible/not-eligible result
  linking on to Contact or FAQ.
- Contact form → in-page success message (no backend).
- 404 **Back to home → Home**.
- Mobile: hamburger menu + responsive grids (matches the Mobile frames).

## Design tokens

All colours, spacing and radii live in `assets/css/tokens.css` as CSS
variables, mirroring the Figma variables exactly — e.g. `--action-primary:
#0f7a6e`, `--accent: #1aa597`, `--bg-brand: #0f2540`, `--bg-mint: #dbf1ee`.
Change a token once and it propagates everywhere.

## Porting to WordPress

| Prototype                          | WordPress                                  |
| ---------------------------------- | ------------------------------------------ |
| `assets/css/tokens.css`            | `theme.json` settings (or enqueued as-is)  |
| `assets/css/styles.css`            | theme stylesheet (enqueue unchanged)       |
| navbar in `components.js`          | `header.php` / header template part        |
| footer in `components.js`          | `footer.php` / footer template part        |
| `.card`, `.btn`, `.category` …     | block / pattern markup, classes unchanged  |
| `data-news-grid` + NEWS array      | `WP_Query` loop over the `post` type       |
| `news-article.html`                | `single.php` template                      |
| contact form / quiz                | wire to a form plugin / custom handler     |

The markup is plain semantic HTML with stable class names, so the CSS carries
over without edits; only the data sources get wired to WordPress.
```

## UI Kit / design system

A living style guide lives in [`ui-kit/`](ui-kit/) (`/ui-kit/` when served).
It documents the colour tokens, spacing, radius, typography and every
component, rendered from the same `tokens.css` / `styles.css` as the site —
so it never drifts from the real components.
