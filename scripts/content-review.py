#!/usr/bin/env python3
"""Regenerate docs/final-content-review.md from the `flags` arrays in
content/blog/*.ts and content/legal/*.ts. Run from the repo root."""
import glob, re, datetime

def flags_of(path):
    s = open(path).read()
    title = re.search(r'\n  title: "(.*?)",', s).group(1)
    src = re.search(r'Source: (\S+)', s).group(1)
    block = re.search(r'\n  flags: \[\n(.*?)\n  \],', s, re.S)
    items = [eval(l.strip().rstrip(',')) for l in block.group(1).strip().split('\n') if l.strip()] if block else []
    return title, src, items

today = datetime.date.today().isoformat()
out = [
    "# Final content review — flagged wording", "",
    "Everything below is reproduced **as published on WordPress** and is live on",
    "the preview exactly that way. Each line needs an owner decision (keep,",
    "change, remove) before launch. The same flags are shown in the preview's",
    "reviewer notice and stored in each content file's `flags` array — edit the",
    "content file when a decision is made, delete the flag, and rerun",
    "`python3 scripts/content-review.py`.", "",
    f"Generated from `content/blog/*.ts` and `content/legal/*.ts` on {today}.", "",
]
for label, paths in [("Blog posts", sorted(glob.glob('content/blog/*.ts'))), ("Legal documents", sorted(glob.glob('content/legal/*.ts')))]:
    out += [f"## {label}", ""]
    for p in paths:
        if p.endswith(('index.ts', 'types.ts')):
            continue
        title, src, items = flags_of(p)
        out += [f"### {title}", f"Source: {src} · file `{p}`", "", "| # | Flag | Decision |", "|---|---|---|"]
        out += [f"| {i} | {f} | ⬜ |" for i, f in enumerate(items, 1)]
        out.append("")
out += [
    "## Cross-cutting", "",
    "| Item | Where | Decision |", "|---|---|---|",
    "| Blog byline \"Tom Dombrowski\" (WordPress author account, Compass Marketing) | all three posts; emitted as BlogPosting `author` | ⬜ keep · byline to the business · byline to Dan |",
    "| Canonical host `www` vs bare — both legal documents cite `https://www.showmeelectrical.com` | privacy §1, §11; terms §1, §14 | ⬜ |",
    "| Cookies / analytics / ad-platform wording vs. a rebuild that sets no tags | privacy §2, §7 | ⬜ |",
    "| Street address in legal contact blocks (Hegee/Heege still unconfirmed) | privacy §11 | ⬜ |",
    "",
]
open('docs/final-content-review.md', 'w').write("\n".join(out))
print("wrote docs/final-content-review.md")
