// Structural accessibility scan (axe-core in jsdom) of every page on a running build.
// Usage: node scripts/a11y.mjs [base=http://localhost:3100]. Colour contrast needs a real browser and is skipped.
import fs from "node:fs";
import { JSDOM } from "jsdom";
const axeSrc = fs.readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const BASE = process.argv[2] || "http://localhost:3100";
const urls = fs.readFileSync("docs/migration/urls.txt", "utf8").split("\n").map((s) => s.trim()).filter((u) => u && !u.includes("firewood"));
let total = 0;
for (const u of urls) {
  const html = await (await fetch(BASE + u)).text();
  const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true, url: BASE + u });
  dom.window.eval(axeSrc);
  const r = await dom.window.axe.run(dom.window.document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"], rules: { "color-contrast": { enabled: false } } });
  const v = r.violations;
  total += v.length;
  console.log(`${u.padEnd(62)} ${v.length ? "✗ " + v.map((x) => `${x.id}(${x.impact})×${x.nodes.length}`).join(", ") : "✓"}`);
  for (const x of v) for (const n of x.nodes.slice(0, 2)) console.log(`     ${x.id}: ${n.target.join(" ")} :: ${n.html.slice(0, 110)}`);
  dom.window.close();
}
console.log(total ? `\n${total} violation group(s)` : "\nNo violations.");
