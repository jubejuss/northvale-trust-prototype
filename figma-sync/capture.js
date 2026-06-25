/* ==========================================================================
   Figma capture script — paste this BODY into the figma-console
   `figma_execute` tool (Desktop Bridge plugin must be running on the file).
   It returns { fileKey, tokens, screens } describing the CURRENT design,
   in the same shape as design-snapshot.json.

   Token-free: reads live plugin state, no FIGMA_ACCESS_TOKEN needed.
   Page/section IDs below are for file KfvtRlhJhxJYM0ic2HXmPe; update the
   DESKTOP_PAGE_ID if the file structure changes.
   ========================================================================== */
const DESKTOP_PAGE_ID = "1:86"; // page "🖥 Screens · Desktop"

await figma.loadAllPagesAsync();
function hex(c){const f=x=>('0'+Math.round((x||0)*255).toString(16)).slice(-2);return '#'+f(c.r)+f(c.g)+f(c.b);}

// --- tokens (file-wide variables) ---
const vars = await figma.variables.getLocalVariablesAsync();
const byId = {}; vars.forEach(v=>byId[v.id]=v);
function resolveValue(v){
  const modes = Object.keys(v.valuesByMode);
  let val = v.valuesByMode[modes[0]];
  let guard = 0;
  while (val && val.type === 'VARIABLE_ALIAS' && guard < 6){
    const ref = byId[val.id]; if(!ref) break;
    const m = Object.keys(ref.valuesByMode); val = ref.valuesByMode[m[0]]; guard++;
  }
  return val;
}
const tokens = {};
for (const v of vars){
  const val = resolveValue(v);
  tokens[v.name] = (v.resolvedType === 'COLOR' && val && typeof val === 'object' && 'r' in val) ? hex(val) : val;
}

// --- screen text content, top-to-bottom / left-to-right per frame ---
async function screenTexts(pageId){
  const page = await figma.getNodeByIdAsync(pageId);
  const frames = page.findAllWithCriteria({types:['FRAME']}).filter(f => f.parent && f.parent.type === 'SECTION');
  const out = {};
  for (const fr of frames){
    const texts = fr.findAllWithCriteria({types:['TEXT']});
    texts.sort((a,b)=>{
      const ay=a.absoluteTransform[1][2], by=b.absoluteTransform[1][2];
      if (Math.abs(ay-by) > 4) return ay-by;
      return a.absoluteTransform[0][2]-b.absoluteTransform[0][2];
    });
    out[fr.name] = texts.map(t=>t.characters);
  }
  return out;
}
const screens = await screenTexts(DESKTOP_PAGE_ID);

return { fileKey: figma.fileKey || "KfvtRlhJhxJYM0ic2HXmPe", tokens, screens };
