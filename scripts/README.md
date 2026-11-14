# Keeping the Showcase page current

The page is `showcase.html`. It draws every bike from `data/showcase.json`, so updating the page
means updating that one file. Nothing else needs to change.

Two kinds of bike are on it:

- **New** (`"isNew": true`): the brand itself calls it new: a “New” label, an “all-new” range, or a
  2027 (current model-year) page. These get the orange New tag.
- **Available now** (`"isNew": false`): on sale in Canada from the brand or a Canadian shop, with a
  live product page. No tag.

Rules that never bend (they come from the project's data-integrity rule):

- Never add a bike you have not seen on a live product page, from the brand or a Canadian seller.
- Never tag a bike New on a guess. The brand's own “New” label, “all-new” wording or 2027 page is the test.
- Never invent a URL, a price, or a photo. If a field cannot be verified, leave the bike out.
- Show a price only if it is in CAD. If the page shows no Canadian price, leave `price` out and the
  card says “price on <seller>'s page”.
- Only list brands you can say are sold in Canada. US-only brands (Priority, Guardian, Aventon,
  Ride1Up, Tumbleweed, Quintana Roo) are left out.
- Photos are linked from the seller's own site, never copied into the repo. (A few older photos were
  already hosted in `images/` for the quizzes; those are reused, not re-copied.)
- Skip any bike with a recall that covers the listed model and year, a 404, a “coming soon” page, or
  only a banner/placeholder photo. Record each skip in `_meta.skipped` with the reason; the page
  shows that list under “Left off for now”.

## The quarterly update (run on the 1st of Jan, Apr, Jul, Oct)

1. **Check what is already listed.** `node scripts/verify-showcase.mjs`
   - `FAIL` = remove the bike, or fix its link/photo if the seller moved it.
   - `??` = the seller blocked this network; not proof of a problem. Confirm by opening the page.
   - Read every “Health Canada recalls” advisory *and the notice it links to*. Most concern an older
     generation (a 2021 Tarmac SL7 recall says nothing about the SL9). Remove the bike only if the
     recall's model and model years cover the bike listed; if you cannot tell the year, remove it and
     say so in `_meta.skipped` (this is what was done for the Sirrus X 3.0 and X 5.0 in Q4 2026).
2. **Find new and newly available bikes.** Cheapest sources first; none needs a paid service:
   | Source | How | Notes |
   |---|---|---|
   | Kona Canada | `https://en-ca.konaworld.com/products.json?limit=250&page=N` | Tag `2027a` = new 2027 line; skip tag `Archive` and products with no available variant. CAD prices, 2048px photos. |
   | Giant Canada | `https://static.giant-bicycles.com/sitemaps/sitemap-giant-en-ca.xml`; URLs ending `-2027` | Read each page's `og:title`, `og:image` and `product:price:*` meta tags (unquoted attributes). Swap `h_600%2Cq_80%2Cw_800` in the photo URL for `h_1067%2Cq_80%2Cw_1600`. |
   | Rad Power Bikes Canada, Panorama Cycles, Cycling Elements | `…/products.json` | CAD stores. Cycling Elements is a multi-brand shop (Specialized, Kona, Opus, Evo). |
   | Cannondale, Specialized, Norco | Their Canadian listing pages (a scraping service or a browser) | Cannondale: “New” label on `cannondale.com/en-ca/bikes`; `/2025`-style URLs are last year. Specialized: `resources.specialized.com/image/<file>?bg=ffffff&w=1600&h=1600&q=75` (not `www.`). Norco: URLs starting `2027-`/`27-`; read `norco.com/now/notice/` for recalls first. |
   | Trek, Canyon, Cervélo, Scott, Santa Cruz, others | Not listed yet | Add when Canadian product pages and real photos can be verified. |
   Also search `"<brand> recall <model>"` for each new candidate and read the brand's own safety-notice
   page. The Health Canada list lags behind a brand's own announcement (the 2027 Norco Fluid recall was
   on Norco's site but not in the list).
3. **Add the bike** to `data/showcase.json` (copy an existing entry for the shape). Set `firstListed`
   and `verifiedOn` to today. New bikes need `isNew: true` and a plain-words `newReason`; others need a
   `note`. If a photo has its own coloured background, set `image.blend` to `false` (white-background
   photos blend into the page; coloured ones are shown as tiles). `soldBy` is the brand or shop name.
   Keep a spread of categories (`racing`, `bikepacking`, `mountain`, `commute`, `kids`) and brands;
   no single brand should dominate (Kona and Giant were capped at 24 and 28 in Q4 2026).
4. **Re-run** `node scripts/verify-showcase.mjs --stamp`. Every new bike must pass.
5. **Publish.** Open `showcase.html` locally and look at it. If every check passed and nothing looked
   wrong, commit to `main` (GitHub Pages deploys itself). If anything is uncertain — a recall
   advisory you cannot rule out, a photo that will not load, a “new” claim you cannot see on the
   seller's page — do NOT publish: put the change on a branch, open a pull request that lists what
   is uncertain and why, and leave it for the owner to approve.

Retire bikes that are no longer on sale. Retire a New tag once the brand stops calling it new.

## Files

- `data/showcase.json` — the list, and `_meta.skipped` (the “left off” reasons).
- `scripts/verify-showcase.mjs` — links, photo sharpness (>= 1000px), recall wording near the model
  name, Health Canada advisories. `--stamp` records today's date for bikes that pass; `--json` for machines.
- `scripts/lib/imginfo.mjs` — reads a photo's true pixel size from its file header.
- `scripts/seed-showcase-2026q4.mjs`, `scripts/expand-showcase-2026q4.mjs` — how the first 130 bikes
  were found and checked in Q4 2026 (a record; later quarters edit the JSON directly). The expansion
  script can take `SHARP_DIR=<folder with node_modules/sharp>` to detect photo backgrounds.
- `.github/workflows/showcase-check.yml` — a read-only check on the 8th of the quarter's first month
  that opens an issue if something broke.

## The five quizzes' catalogs (`data/*-bikes.json`)

The quizzes (kids, commute, racing, mountain, bikepacking) rank the bikes in these files. Every claim the
results make about a bike is something recorded here, and anything not recorded is shown as unconfirmed.

Fields added to each bike by the scripts (never edit these by hand):

- `check` — written by `node scripts/verify-catalogs.mjs --write`. `status` is `ok` (the seller page loaded and
  shows this model), `mismatch`, `dead` (the link fails: the bike is left out of results), `blocked` (the seller
  refuses automated checks: shown as "open the page to confirm") or `no-link`. It also records a price and
  currency only when the page states them, and `canada: 'confirmed'` only for a Canadian listing (a .ca site, a
  `/ca/` or `en-ca` locale, or a CAD price). It sets no `canada` guess.
- `recall` — from Health Canada's recall list, same run. `match: 'exact'` means every distinguishing word of the
  model is in the notice; `'family'` means the model's name is but not its trim or year. Shown to shoppers as a
  prompt to read the notice, never as proof the bike is affected.
- `canada: {sold: false, source}` — `node scripts/mark-availability.mjs`. Only with a citable source (REI's own
  policy that it cannot ship bikes outside the U.S.; the U.S.-only brands in the Q4 2026 availability review).
- `discontinued: {source}` — the brand's own page says it is no longer sold new (e.g. Surly files the Long Haul
  Trucker under "Archive"). Left out of results.

Finding links for bikes with none (`no-link`): use a Canadian shop's public `products.json`, a brand's own
sitemap (Giant Canada), or a search of the brand's own site; record what you found in
`scripts/apply-found-links.mjs`, then re-run the verifier. Never build a URL from a pattern. Do not get round a
seller's block on automated access: leave it `blocked`.

Prices: the schema says an unlabelled price is USD. The quizzes show every price as US$ or C$, and compare a US
price to the shopper's Canadian-dollar budget at the Bank of Canada's published daily rate (fetched in the
browser; if it cannot be loaded, the listed number is compared as it is and the page says so).

Where the shared behaviour lives: `match-ui.js` (cards, trust lines, compare table, share link, live refresh),
`quiz-flow.js` (essentials first, "See my matches now").

## French (Québec)

Every page loads `i18n.js` (the engine), `i18n-fr-core.js` (navigation, footer, letter, mini-game), and its own
`i18n-fr-<page>.js`; the five quizzes also load `i18n-fr-quiz.js` (quiz steps, info cards, results layer). English
is the default; the EN | FR switch in the navigation stores the choice in `localStorage`. Terms and typography rules
are in `i18n-glossary.md`.

The French is written by an AI translator and has had no native-speaker review. A string with no French entry stays
in English on purpose (nothing is machine-translated on the fly).

Adding or changing English text on a page means adding its French to that page's file: the English text is the key,
copied exactly. Sentences built in a page's script use `SV.T('Template with {n}', {n: 3})` (from `match-ui.js`) so
the French can reorder the words. To find what is missing, open a page with `?i18n-debug` while in French and read
the browser console after using the page (and press the quiz's "i" buttons): it lists every string with no French.
Bike, brand and shop names are never translated.
