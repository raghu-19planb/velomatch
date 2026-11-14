# How SelectVelo curates and recommends bikes

This is the rulebook for every recommendation the site makes: the quizzes, the "What fits you" explainer, the Describe box, the Current bikes page. If code and this file disagree, fix one of them.

## 1. The standing rule (set by the owner, November 2026)

**All bike recommendation and curation logic must take into account what is already known about bikes in that specific category, from:**

- past **Reddit** threads and other **forums**
- **social media** posts, including **Instagram**
- **blogs** and **expert reviews**
- **YouTube** videos
- **OEM product marketing**: brochures, product pages and product descriptions

"That specific category" matters: what people say about a kids' first bike (sizing, weight, brakes, resale) is not what they say about a bikepacking rig (racks, bags, reliability far from a shop), a mountain bike (suspension, geometry), a racing bike (aero, fit, weight) or a casual bike (comfort, tire width, price). Each category gets its own list of sources and its own questions to ask of them (section 5).

The rule changes what we are allowed to ship. A new bike, a new scoring rule, a new "step up" suggestion or a new explainer sentence is not finished until it has been checked against these sources for its category. The checking is recorded (section 4), so nobody has to take our word for it.

## 2. What each kind of source is for

Sources are not interchangeable. Use each for what it is good at, and never let a weaker source overrule a stronger one on the same question.

| Source | Good for | Not good for | Weight |
|---|---|---|---|
| **OEM spec sheet / product page** | Specs, sizes, geometry, tire clearance, mounts, weight, price, what is sold in Canada now | Durability, comfort, real-world fit, honest downsides (it is marketing) | The authority for **facts about the bike** |
| **OEM brochure / marketing copy** | What the maker says the bike is *for*, new-model naming | Anything it does not state; superlatives are not data | Intent, not proof |
| **Expert reviews, blogs** | Ride quality, trade-offs, comparisons, what the reviewer would change | Specs (take those from the OEM); old reviews of a changed model | Strong for **how a bike behaves**, if dated and for the same model year |
| **YouTube** | Long-term ownership, real setups, loaded touring, sizing on real riders | Anything that cannot be read from a transcript; sponsored content | Good signal, cite the video and date |
| **Reddit and forums** | What owners actually buy, recurring problems, sizing quirks, "I regret this" threads, what people choose instead | Small samples, brigading, old threads about a different generation | Strong for **patterns**, weak for any single claim |
| **Instagram and social posts** | Real builds and loadouts, how a bike is used in the wild (for example a trip a model is commonly ridden on) | Specs, reliability, any number | Weakest: an illustration, never evidence on its own |
| **Regulators (Health Canada recalls)** | Safety | Everything else | Overrides everything: a bike with an open recall is flagged on its card |
| **The owner's and riders' own experience** | Corrections (the Diverge Comp Carbon, November 2026) | Generalising from one rider | Triggers a check against the OEM page, then a fix |

Rules that follow from the table:

1. **Facts come from the OEM or a seller page.** Community and social sources never supply a spec, a price or a size. If a forum says a bike takes racks and the OEM page does not, the card says "not confirmed", it does not say yes.
2. **Opinions come from many places, and only patterns count.** A recommendation or a warning that rests on community or review evidence needs several independent sources saying the same thing. One thread, one video or one post is a lead to check, not a finding.
3. **Recency matters twice:** the date of the source, and whether it is about the same model year. A review of a previous generation does not describe the current bike (this is exactly how the catalog's Diverge Comp went stale).
4. **Marketing is read as marketing.** "Race-tuned, adventure-approved" is not a spec.
5. **Say what is verified and what is estimated.** The two must stay distinguishable on every card and in every data field (see `DATA.md`). Nothing is invented to fill a gap: a missing fact is shown as "not listed".

## 3. Where the evidence enters the logic

| Part of the system | What the sources inform |
|---|---|
| **Catalog entries** (`data/*-bikes.json`) | Specs and prices from OEM/seller pages; the `_verified` note records which source confirmed what, and when |
| **Quiz questions and their options** | The questions riders in that category actually argue about (the bikepacking quiz asks about racks, tires and shifting because forums and reviews keep raising them) |
| **Scoring weights** | What matters in that category: how heavily to count fit, budget, surface, distance, durability. A weight that has no evidence behind it is a guess and is marked as one in the code comment |
| **The "What fits you" explainer** (type of bike, trade-off, step up) | Review and forum consensus about bike *types*: a gravel-capable hybrid for relaxed road-and-gravel riding, a gravel bike if you want speed. Written as general guidance, never as a claim about a listed bike |
| **The Describe box's vocabulary** | The words riders really use ("robust", "bombproof", "rack-and-fender ready"), mapped onto questions the quiz actually has |
| **Card notes** ("Misses: …", "Not listed: …", recall notices) | Only recorded data, never inference |
| **Current bikes page** | OEM and Canadian-seller pages only; current model years only (rolls forward each year; checked in CI) |

## 4. How the evidence is recorded (the standard to meet)

Each catalog entry already carries `_verified` (what was confirmed, where, when) and a link `check`. To honour the standing rule, an entry also needs, over time, an `evidence` record:

```
"evidence": {
  "oem":       [ { "url": "...", "read": "2026-11-14", "confirmed": ["price", "groupset", "tire clearance"] } ],
  "reviews":   [ { "url": "...", "date": "2026-03-02", "model_year": 2026, "themes": ["comfortable on long days", "Future Shock stiffer than expected"] } ],
  "community": [ { "kind": "reddit|forum|youtube|instagram", "url": "...", "date": "...", "themes": ["..."] } ],
  "signals":   { "themes": [ { "text": "...", "sources": 5, "stance": "positive|negative|mixed" } ], "updated": "2026-11-14" }
}
```

- A theme appears in `signals` only when at least three independent sources back it, and it is shown to riders as "What riders and reviewers say", with the number of sources and links, never as our own claim.
- Quote nothing at length: paraphrase, and keep any quotation under 15 words with its source.
- A signal can nudge a ranking only through a rule written down here, with its weight and the evidence for that weight. It never changes a fact on a card.

## 5. Sources to consult, by category

Starting points, not a closed list. Add what turns out to be good; drop what turns out to be noise.

| Category | Typical questions to ask of the sources | Examples of where to look |
|---|---|---|
| **Kids' first bike** | Weight relative to the child, brakes a small hand can use, sizing by height and inseam, what holds resale value, what parents wish they had bought | Parent forums and Canadian parenting groups, the maker's size charts, reviews from kids' bike specialists |
| **Commuting** | Fenders, racks, disc vs rim in wet and salt, theft-proof parts, e-assist reliability, winter use, folding vs full-size | Commuting subreddits and forums, city cycling blogs, long-term e-bike reviews, Canadian winter-riding guides |
| **Casual and fitness** | Comfort vs speed, tire width for mixed surfaces, what first-time buyers regret, hybrid vs gravel bike | General cycling forums, beginner-buying guides, reviews of hybrids and light gravel bikes |
| **Bikepacking and bike touring** | Rack and bag mounts, load rating, tire durability and clearance, repairability far from a shop, drivetrain choice (including electronic shifting and charging), real trips (such as Iceland) | Bikepacking and touring forums and subreddits, route guides, long-term reviews, trip reports and YouTube build videos |
| **Mountain biking** | Suspension feel and travel for the discipline, geometry, frame durability, parts that wear, what riders on the same trails choose | Trail-riding forums, mountain bike review sites, rider videos |
| **Racing** | Aero vs weight vs comfort, fit and sizing, tire clearance, ultra-distance suitability (audax, long races), what the field actually rides | Racing forums, performance reviews, wind-tunnel and test data, long-distance event reports |

## 6. Limits we keep (they protect riders, the sources and us)

- **Follow each platform's terms.** No scraping that a site forbids or that needs getting around a login, a block or bot protection. Instagram in particular has no open search for this purpose: its posts enter only as links a person has chosen, or through a permitted API. Reddit is used through its permitted access.
- **Copyright:** summarise, attribute, link. Do not reproduce reviews, posts, captions or brochure text.
- **Privacy:** never store or show a username, photo of a person or personal detail from a post. Themes and counts only.
- **No fake consensus.** If we have not read it, we do not say riders say it.
- **No pay-to-rank.** Affiliate links never change a score. A sponsored review counts as marketing.
- **Say when there is no evidence.** "We could not find enough about this bike" is a valid result.

## 7. Where we are today (honest status)

- **In place:** OEM and Canadian-seller verification for the catalog entries (see `scripts/verify-catalogs.mjs`, the per-entry `_verified` notes), Health Canada recall checks, the freshness report (`scripts/catalog-freshness.mjs`, weekly in CI), the strict "exact model" rule for fit ranges on the Current bikes page, and the type-of-bike explainer on the casual quiz.
- **Partly in place:** the quizzes' questions and weights were built from category knowledge (for example the bikepacking taxonomy from bikepacking.com) and from the owner's own trips, but the sources are not yet recorded per entry.
- **Not yet built:** the `evidence` and `signals` records in section 4, a documented source list that has been worked through for each category, and "What riders and reviewers say" on cards. Until these exist, no card claims community consensus.

## 8. Next steps, in order

1. For each category, work through its section 5 sources and write down the five to ten themes that matter most, with links. Check each existing quiz question and weight against them; adjust the ones the evidence contradicts.
2. Add `evidence` to catalog entries as they are touched (every freshness fix is a chance), starting with the bikes people actually ask about.
3. Build the "What riders and reviewers say" block on result cards, shown only for themes with three or more independent sources.
4. Add the evidence check to the freshness job: flag any entry whose only evidence is older than a review cycle, or whose model year has changed since the reviews were written.
5. Review this file whenever a recommendation looks wrong to a rider: the rider is a source too.
