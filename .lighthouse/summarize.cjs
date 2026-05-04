const path = require("path");
const files = ["en-mobile-prod", "en-desktop-prod", "th-mobile-prod", "th-desktop-prod"];
for (const f of files) {
  const r = require(path.join(__dirname, f + ".json"));
  console.log("\n=== " + f + " ===");
  for (const [k, v] of Object.entries(r.categories)) {
    console.log("  " + k.padEnd(18) + Math.round(v.score * 100));
  }
  for (const cat of ["performance", "best-practices", "accessibility", "seo"]) {
    const failures = [];
    for (const ref of r.categories[cat].auditRefs) {
      const a = r.audits[ref.id];
      const skip = ["manual", "notApplicable", "informative"];
      if (a && a.score !== null && a.score < 1 && !skip.includes(a.scoreDisplayMode)) {
        failures.push([Math.round(a.score * 100), ref.id, (a.title || "").slice(0, 60)]);
      }
    }
    if (failures.length) {
      console.log("  --- " + cat + " failing audits ---");
      for (const [score, id, title] of failures) {
        console.log("    " + String(score).padStart(3) + "  " + id.padEnd(40) + " " + title);
      }
    }
  }
}
