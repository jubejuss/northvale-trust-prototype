#!/usr/bin/env node
/* ==========================================================================
   Diff a fresh Figma capture against the committed snapshot.
   Usage:  node figma-sync/diff.mjs <current-capture.json> [snapshot.json]
   Default snapshot: figma-sync/design-snapshot.json (next to this file).

   Prints token + per-screen text changes so you can see exactly what moved
   in Figma since the last sync, then update the code to match.
   ========================================================================== */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const curPath = process.argv[2];
const snapPath = process.argv[3] || resolve(here, "design-snapshot.json");

if (!curPath) {
  console.error("Usage: node figma-sync/diff.mjs <current-capture.json> [snapshot.json]");
  process.exit(2);
}

const cur = JSON.parse(readFileSync(curPath, "utf8"));
const snap = JSON.parse(readFileSync(snapPath, "utf8"));

let changes = 0;
const line = (s) => { console.log(s); };

// --- tokens ---
const st = snap.tokens || {}, ct = cur.tokens || {};
const tokenKeys = [...new Set([...Object.keys(st), ...Object.keys(ct)])].sort();
const tokenDiffs = [];
for (const k of tokenKeys) {
  if (!(k in ct)) tokenDiffs.push(`  - removed  ${k} (was ${st[k]})`);
  else if (!(k in st)) tokenDiffs.push(`  + added    ${k} = ${ct[k]}`);
  else if (String(st[k]) !== String(ct[k])) tokenDiffs.push(`  ~ changed  ${k}: ${st[k]} -> ${ct[k]}`);
}
line("\n=== TOKENS ===");
if (tokenDiffs.length) { changes += tokenDiffs.length; tokenDiffs.forEach(line); }
else line("  (no changes)");

// --- screens (multiset text diff) ---
const ss = snap.screens || {}, cs = cur.screens || {};
const screenNames = [...new Set([...Object.keys(ss), ...Object.keys(cs)])].sort();
line("\n=== SCREENS ===");
for (const name of screenNames) {
  if (!(name in cs)) { line(`\n[${name}]  - screen removed`); changes++; continue; }
  if (!(name in ss)) { line(`\n[${name}]  + screen added`); changes++; continue; }
  const countOf = (arr) => arr.reduce((m,s)=>(m[s]=(m[s]||0)+1,m),{});
  const a = countOf(ss[name]), b = countOf(cs[name]);
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  const removed = [], added = [];
  for (const t of keys) {
    const d = (b[t]||0) - (a[t]||0);
    if (d < 0) for (let i=0;i<-d;i++) removed.push(t);
    else if (d > 0) for (let i=0;i<d;i++) added.push(t);
  }
  if (removed.length || added.length) {
    changes += removed.length + added.length;
    line(`\n[${name}]`);
    removed.forEach(t => line(`  - "${t}"`));
    added.forEach(t => line(`  + "${t}"`));
  }
}

line(`\n=== ${changes} change(s) total ===`);
process.exit(changes ? 1 : 0);
