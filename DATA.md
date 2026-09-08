# Maintaining the VeloMatch bike catalogs

Each quiz category has its own catalog file under `data/`:

- `data/kids-bikes.json` — used by `index.html` (kids' first bike)
- `data/commute-bikes.json` — used by `commute.html` (daily commute)
- `data/bikepacking-bikes.json` — used by `bikepacking.html` (bikepacking), 28 bikes, grounded in bikepacking.com's own route/bike taxonomy (terrain and bike-type categories) plus domain knowledge. First category with a real known-frame-size question (asks the number, e.g. 54cm, before falling back to height) and an `availability` field that defaults scoring toward mainstream/widely-sold brands unless the rider says they're open to boutique builders — both added per direct user feedback while building it. Validated against the user's own real trip: "mixed terrain (Iceland Ring Road) + adventure + carbon" correctly surfaces the Specialized Diverge Comp, which is the bike they actually rode.

These files are the **single source of truth** for what each quiz can recommend. When you add a new category page (a third use case, a fourth, etc.), give it its own `data/<category>-bikes.json` following the same pattern.

## Catalog scope — what "24 commute bikes" actually means

The commute catalog (24 models as of this writing, including real Canadian brands — Norco, Opus, Kona, Devinci, Batch Bicycles, Supercycle) is a **curated, well-researched set**, not a scrape of every Canadian retailer. Most entries' specs come from real-world product knowledge of that actual model rather than a live-verified spec sheet; a few carry an explicit `_verified` field noting exactly what was confirmed live and when (see the Supercycle entry for an example).

That distinction matters more now that the quiz asks purchase-influencing questions (frame material, brakes, groupset). Two things this catalog deliberately does **not** do, and why:

- **It doesn't invent model-year variants.** A bike doesn't get separate 2022/2023/2024/2025/2026 entries unless there's a real, known difference between them — most models don't change every year, and fabricating "the 2025 version" of a bike down to specific spec differences would risk misleading someone who's about to actually spend money.
- **It isn't a scrape of every Canadian bike shop.** A truly exhaustive retailer-level catalog (every SKU, every store, every year) needs either a real data feed/API from retailers, or manually extracting listings from pages you point me at. Both are realistic next steps — just not something to fabricate wholesale in one pass.

### Why live scraping isn't the growth engine here

I tried pulling a real listing from a major Canadian retailer's site directly. The search page worked and gave a genuine, verifiable result (name, price, SKU). The individual product page did not — it's rendered client-side behind JavaScript that didn't execute in a way that exposed the actual spec sheet, so instead of frame material/gearing/brake details I got a page of legal boilerplate. Guessing a direct product URL to route around that isn't an option — that's exactly the kind of guessed URL this project avoids, and it also just doesn't work reliably against modern e-commerce sites. So one verified fact (name, price, SKU) cost a very large amount of effort, and that ratio doesn't scale to "exhaustive."

**What actually scales, in priority order:**
1. **My own product knowledge**, for breadth — fast, consistent, reasonably accurate for real, well-known current/recent models. This is how most of the catalog was built and remains the main growth engine.
2. **You send me specific pages** (a product page you have open, a spec sheet, a retailer's category listing, a screenshot) — I can extract from content directly in front of me far more reliably than I can navigate a retailer's site blind.
3. **Targeted live verification** for a specific fact that matters (like the Supercycle price/SKU above) — worth doing occasionally, not as the default way to add every bike.

### Coverage tracker (update this as the catalog grows)

**Canadian brands represented:** Norco, Opus, Kona, Devinci, Batch Bicycles, Supercycle (Canadian Tire house brand).
**Canadian brands known but not yet added:** Rocky Mountain, Miele (adult line — a kids model is already in the kids catalog), CCM, Marinoni, Six Fifty, Panorama Cycles, Envo. (Sites for Envo/Panorama weren't reachable in this pass — worth another attempt, or send me their current product pages directly.)
**International brands already represented (sold in Canada):** Trek, Specialized, Cannondale, Giant, Priority, Brompton, Tern, Rad Power Bikes, Aventon, Ride1Up, Marin, Surly, State Bicycle Co. — all USA/UK/Taiwan.
**Next planned phase, per direction from the user:** once Canadian-market coverage feels reasonably broad, extend deliberately into other countries' domestic brands, starting with the USA (e.g. more from Fuji, Raleigh USA, Diamondback, Electra) before moving further afield.

**To grow this responsibly:** send me links to specific store/category pages, a spec sheet, or a spreadsheet you already have, and I'll extract real entries from them — that's more reliable than me navigating retailer sites blind. I can also do a browsing pass to verify or refresh specific existing entries if something looks off.

**Kids catalog:** the same approach applies — the Hyper Bicycles 20" Spinner BMX (Walmart.ca) was added this way, with `_verified` marking exactly what the page confirmed (name, brand, wheel size, frame material, height/age range, brake type, price) versus what's estimated (origin, terrain type, experience fit, seat range).

### Currency

Both catalogs' `price` field is face-value in whatever `currency` says; a bare number with no `currency` field means USD (every entry added before this field existed). **The budget slider does not convert between currencies** — a $198 CAD entry and a $198 USD entry look identically "within budget" to the scoring, even though they aren't really the same price. This is an accepted, disclosed limitation for now (per the user's choice: label honestly rather than guess an exchange rate or silently blend). If the catalog ends up with a meaningful mix of currencies, revisit this — either add real conversion, or split budget questions per currency/region.

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
| Moderate (~8–12 pts) | frame material, groupset, foldability-for-portability, riding position, weather/fenders, disc brakes | Real quality/comfort/convenience factors, but rarely a dealbreaker on their own — a rider can live with the "wrong" answer here. |
| Light (~5–8 pts) | color, brand origin, flat-tire worry, rough-road suspension, new-rider low-maintenance nudge | Pure preference or a soft nudge for people who don't know what to ask for — should only ever break a tie, never beat a functionally-better bike. Suspension in particular stays light because almost nothing in the catalog has one; weighting it heavily would make most riders see near-random results instead of their best real option. |

When you add a new preference question, ask "if this is wrong, does the bike become unusable, annoying, or just not-ideal?" and weight it in that tier. That one judgment call is most of what makes the ranking feel right.

### Bugs this review caught (fixed 2025 data/scoring pass)

- **Cargo capacity was underweighted.** A rider who selected "heavy loads" could still get a zero-cargo-capacity bike as the #1 pick, because a modest price/weight advantage outweighed a cargo mismatch that should have been disqualifying in practice. Fixed by doubling the per-level penalty.
- **Portability only looked at weight.** An actual folding bike (Brompton, Tern) could lose to a non-folding hybrid that was merely a kilogram lighter, even at maximum "portability matters" — but foldability is what actually determines whether a bike fits up a stairwell or in a closet. Added a `foldable` field and weighted it directly, separate from raw weight.
- **E-bike preference was too soft.** A rider who explicitly chose "want e-assist" could still get a pedal-only bike as the top pick if it was cheaper. Fixed by roughly doubling the power-type weight.

The lesson in all three: when a preference is close to a hard requirement in real life, its weight needs to be large enough that budget/weight/other soft factors can't casually overrule it. Worth re-checking with real quiz answers any time a new question or a new bike is added — a quick way is to script a handful of representative answer combinations and eyeball whether the #1 result actually makes sense for that rider.
