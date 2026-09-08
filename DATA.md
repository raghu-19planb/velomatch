# Maintaining the VeloMatch bike catalogs

Each quiz category has its own catalog file under `data/`:

- `data/kids-bikes.json` — used by `index.html` (kids' first bike)
- `data/commute-bikes.json` — used by `commute.html` (daily commute)

These files are the **single source of truth** for what each quiz can recommend. When you add a new category page (a third use case, a fourth, etc.), give it its own `data/<category>-bikes.json` following the same pattern.

## How to update a catalog

1. Open the relevant file in `data/`.
2. Add, edit, or remove an entry in the `"bikes"` array. Each file's `"_schema"` block at the top documents exactly what every field means and what values it accepts.
3. Commit and push. Netlify redeploys automatically in about a minute — no other code changes needed.

There's no build step and no database: it's a plain JSON file, readable and diffable in a normal git history, which also means anyone (or anything) reading the repo — including an AI helping to pick or reason about a bike — has one unambiguous, documented place to look.

## Adding real photos

Every bike entry has an `"image"` field. Leave it as `""` to show the pencil-sketch placeholder (the current default for every bike — none of them have real sourced photos yet). To add a real one:

- **Recommended:** drop the image file into `images/kids/` or `images/commute/` (folders already exist, currently empty) and set `"image"` to that relative path, e.g. `"images/kids/cleary-gecko.jpg"`. This keeps photos versioned with the rest of the site and needs no external account.
- **Alternative:** set `"image"` to a full URL, if you have one you know you have the rights to use (your own product photography, a licensed stock photo, or a brand's official press/media kit image — many bike brands provide these for retailers and affiliates on request).

I can't fabricate real photo URLs for specific bike models myself — that risks linking to the wrong image, a broken link, or someone else's copyrighted photo without rights. If you gather a batch of photos (files or licensed URLs), send them my way and I'll wire them into the catalog.

A photo that fails to load (bad path, taken-down URL) automatically falls back to the sketch placeholder, so a bad `image` value never breaks the page.

## Optional: live editing via Google Sheets

Each quiz page also has a `SHEET_CSV_URL` constant near the top of its `<script>` block. If you publish a Google Sheet (File → Share → Publish to web → CSV) with the same column names as the JSON schema, pasting its CSV link there makes the sheet override the JSON catalog at load time — useful if you want someone to update bikes without touching git at all. It's optional; leaving it as the placeholder value just uses the JSON file.

## On "AI picking the right bike"

Today the matching is a transparent scoring formula (in each page's `<script>` block) — not a live AI call. It's fast, free, fully explainable ("why did this bike win?" always has a traceable answer), and needs no API key or backend. The documented JSON schema above is exactly the kind of clean, structured data you'd want if you later swap in a real AI-based ranking step (e.g. an LLM call from a serverless function) — that's a bigger change (it needs somewhere to run server-side, since a static site can't safely hold an API key), so it's worth doing deliberately if/when you want it, rather than folding into this data cleanup.

### How it always finds the *closest* bike, even when nothing matches perfectly

Every quiz question adds or subtracts points — nothing ever excludes a bike outright. That's deliberate: real preferences conflict (someone wants a carbon frame **and** a $500 budget; someone wants heavy-cargo capacity **and** an e-bike, but the only e-bikes in stock top out at rack-and-panniers). A hard filter would return zero results in exactly those cases. Weighted scoring instead always ranks *every* bike and returns the top 3 — so the "closest available alternative" falls out of the math automatically, with no special-case code needed for the no-perfect-match scenario.

The weights aren't arbitrary — they're sized by how much getting that dimension wrong actually costs the rider in practice:

| Weight | Question | Why |
|---|---|---|
| Heaviest (~16–20 pts) | power type (pedal/e-assist), distance fit | Get these wrong and the bike is functionally unusable for the commute — not a comfort issue, a can't-do-it issue. |
| Heavy (~12 pts/level, scales with gap) | cargo capacity | A bike with no rack mounts literally cannot carry groceries, however good it is otherwise — this used to be underweighted (see below) and let a zero-cargo bike outrank real cargo bikes. |
| Moderate (~10–15 pts) | frame material, groupset, foldability-for-portability | Real quality/ride-feel/convenience factors, but rarely a dealbreaker on their own. |
| Light (~6 pts, small penalty) | color, brand origin | Pure preference — should only ever break a tie, never beat a functionally-better bike. |

When you add a new preference question, ask "if this is wrong, does the bike become unusable, annoying, or just not-ideal?" and weight it in that tier. That one judgment call is most of what makes the ranking feel right.

### Bugs this review caught (fixed 2025 data/scoring pass)

- **Cargo capacity was underweighted.** A rider who selected "heavy loads" could still get a zero-cargo-capacity bike as the #1 pick, because a modest price/weight advantage outweighed a cargo mismatch that should have been disqualifying in practice. Fixed by doubling the per-level penalty.
- **Portability only looked at weight.** An actual folding bike (Brompton, Tern) could lose to a non-folding hybrid that was merely a kilogram lighter, even at maximum "portability matters" — but foldability is what actually determines whether a bike fits up a stairwell or in a closet. Added a `foldable` field and weighted it directly, separate from raw weight.
- **E-bike preference was too soft.** A rider who explicitly chose "want e-assist" could still get a pedal-only bike as the top pick if it was cheaper. Fixed by roughly doubling the power-type weight.

The lesson in all three: when a preference is close to a hard requirement in real life, its weight needs to be large enough that budget/weight/other soft factors can't casually overrule it. Worth re-checking with real quiz answers any time a new question or a new bike is added — a quick way is to script a handful of representative answer combinations and eyeball whether the #1 result actually makes sense for that rider.
