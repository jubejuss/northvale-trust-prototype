# Figma → code sync (snapshot-based, no token)

A lightweight way to see what changed in Figma since the last sync and update
the code to match. Uses the **figma-console Desktop Bridge** (live plugin
state) — no `FIGMA_ACCESS_TOKEN` required.

## Files
- `design-snapshot.json` — the design state the code is currently synced to
  (tokens + per-screen text). The baseline for every diff.
- `capture.js` — script body to run in Figma to read the **current** state.
- `diff.mjs` — compares a fresh capture against the snapshot.

## What it tracks
- **Token values** — every Figma variable (colour/space/radius/semantic).
- **Text content** — every text layer per desktop screen, in reading order.
  New/removed/edited copy and added/removed sections show up here.

## What it does NOT track (still needs a screenshot eyeball)
- Pure visual geometry: exact paddings, font sizes, positions, corner radii on
  raw nodes, image swaps. For layout-level redesigns, also capture a screenshot
  (`figma_capture_screenshot`) and compare visually.

## Sync procedure
1. Open the file in Figma Desktop with the figma-console Desktop Bridge plugin
   running. Confirm with `figma_get_status`.
2. **Capture**: run the body of `capture.js` via the `figma_execute` tool. Save
   its `{ fileKey, tokens, screens }` result to `figma-sync/current.json`.
3. **Diff**: `node figma-sync/diff.mjs figma-sync/current.json`
   → prints added / removed / changed tokens and per-screen text.
4. **Apply** the diff to the code:
   - token change → `assets/css/tokens.css`
   - copy change on a page → that page's `.html` (or `assets/js/app.js` for the
     NEWS array / quiz questions)
   - new/removed section → page structure + `styles.css`
5. **Verify** locally (`python3 -m http.server`, or render with headless Chrome).
6. **Re-baseline**: replace `design-snapshot.json` with the new capture
   (keep the `capturedAt` / `note` keys, refresh the date).
7. **Commit & push** — Pages redeploys in ~1–2 min.

## Promote to automatic (optional)
If you later add a `FIGMA_ACCESS_TOKEN` to the figma-console MCP config, you can
swap step 2–3 for real version history: `figma_get_file_versions` +
`figma_get_changes_since_version` to diff against a labelled version instead of
this snapshot. The snapshot approach keeps working with zero setup in the
meantime.
