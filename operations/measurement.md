# Measurement protocol — v1

Freeze this version in each experiment before release. A later protocol correction must be recorded and must not quietly change the rule used to judge existing outcomes.

## Primary outcomes and diagnostics

| Metric | Definition and source | Decision use and limit |
| --- | --- | --- |
| Average percentage viewed (APV) | Studio-reported APV for the specified video, format, period and filters | Compare song engagement within similar lengths and formats. Rewatching can push it above 100%; it is not the share of children dancing |
| Returning viewers | Studio's estimated returning viewers in a fixed channel period, when available | Directional channel repeat-use proxy. Not unique families, not a child-age count, and not additive across videos |
| Production cost and hours | Direct cash spend and logged labor per accepted finished song; record currency | Sustainability. Include rejected generation attempts; do not treat unpaid labor as free |
| 30-second retention | Studio's percentage still watching at 30 seconds, when available | Primary metric for opening tests. A diagnostic for the channel, not a universal success threshold |
| Thumbnail CTR and impressions | Studio-reported CTR and eligible thumbnail impressions in the same cohort | Diagnose packaging with traffic/source context. Never divide all views by impressions |
| Watch time per 1,000 impressions | `watch_time_from_impressions_hours × 60 × 1000 / impressions` = minutes per 1,000 impressions | Only calculate from the same impressions-funnel cohort. All-view watch time is invalid as this numerator |
| Shorts engaged views | Studio Engaged views, accompanied by stayed-to-watch and duration if available | Separate Shorts reporting. Do not compare raw Shorts starts with long-form views |

YouTube's [retention definitions](https://support.google.com/youtube/answer/9314415?hl=en), [CTR guidance](https://support.google.com/youtube/answer/7628154?hl=en), and [Shorts metric change](https://support.google.com/youtube/answer/10059070?hl=en) govern platform fields. Missing, unavailable, suppressed and still-processing values remain blank/null. Zero requires an actual reported zero.

## Observation grain and windows

One row is one video, one reporting window, one traffic scope, one format, one capture. The CSV template includes a unique observation ID, capture timestamp with timezone, reporting timezone, period bounds, window basis and source reference. Store private normalized data in `.private/analytics/observations.csv`; keep public snapshots in research notes.

- Baseline/launch snapshots are `since_publish` and `processing`; never compare them with complete 7-day windows.
- Preferred experiment window: first **7 complete reporting days after the publication day**, excluding that partial day (`first_7_complete_days`). Retain the reporting timezone shown by the source; do not assume it equals the creator's timezone. Export once reporting is available, generally at least two days after the window ends.
- If the preregistered floor is missed, use a predeclared **28 complete reporting day** fallback (`first_28_complete_days`) for every arm. Do not compare a 7-day control with a 28-day treatment.
- Capture 48-hour snapshots for troubleshooting, 7-day windows for directional comparison and 28-day windows for maturation. These are different rows, never summed.
- `window_start` and `window_end` are inclusive dates; `window_days` must match. `availability=complete` describes processed report availability, not statistical sufficiency.
- Retention may use a different lifetime period from the export. If it cannot be filtered to match, keep it in its own row and state the mismatch. Do not join it into a matched-window experiment.
- Keep long-form originals, compilations, Shorts, language and lead activity level distinct. Retain paid/external/organic and device/region mix where available. Do not mix funnel dates with headline lifetime cards.
- For repeated exports, preserve the snapshots but select exactly one preregistered capture per video/window for a review. The tool rejects duplicate cohorts in the review input.

## Decision rules

1. Quality, rights, policy and child-appropriate participation are release constraints. Failed guardrails override a favorable engagement change.
2. Each test gets one primary metric and a minimum useful effect before release. Example proposal: +5 percentage points in 30-second retention for H01/H02, with no APV fall greater than 3 points. These are business decision thresholds, not established benchmarks.
3. Default exploratory floor: at least 200 views per video and, for packaging comparisons, at least 1,000 eligible impressions per video. These are conservative workflow choices, **not guarantees of adequate statistical power**. Revisit them only before a future experiment using the observed variance and intended effect size.
4. At least three matched pairs for an upload-level comparison, with similar duration, activity band, language and production quality. Counterbalance A/B order across pairs before release. New songs remain a confounder; do not publish near-duplicate versions just to simulate randomization.
5. If all three pairs move in the preregistered direction, the median difference meets the useful-effect rule, and guardrails pass, record `keep_provisional`. Replicate in the next block before broad rollout. This is directional evidence, not statistical significance.
6. If effect is consistently adverse or costs/quality outweigh the benefit, record `discard`. Mixed, underpowered, missing or immature data gives `inconclusive`. Broken measurement or major uncontrolled changes gives `invalid`.
7. Stop at the declared maximum (normally 28 days after the last comparison upload's publication day, plus reporting delay). Do not extend selectively to find a winner. Repeated looks are diagnostics; decision dates remain fixed.

The CLI provides validation and descriptive rows only. It does not calculate a causal effect, p-value, confidence interval, or automatically label a winner. Aggregate views are not independent randomized participants. Repeated viewers and recommendation feedback violate a simple independent-trials interpretation.

## Small-channel diagnostics

| Observed pattern | Next investigation, not automatic conclusion |
| --- | --- |
| Low impressions; little usable retention/CTR | Check indexing/metadata and audience fit; build a coherent small library; gather opt-in adult usability feedback |
| Adequate impressions; weaker CTR within comparable sources | Review whether title/thumbnail clearly promises the actual family activity |
| Clicks but early drop | Compare opening to the promised activity, music start, cue clarity and production defects |
| Stronger opening but later drop | Inspect transitions, confusing choreography, repeated empty sections and ending |
| One strong upload with weak follow-up | Test repeatable theme/series; inspect source mix and timing before attributing a cause |
| Good viewing signals but unsustainable production | Reduce revision cost and complexity while holding creative acceptance constant |

## Data collection

Use Studio Analytics → Advanced mode/See more → selected video/group, fixed dates, metrics and filters → Export current view. Keep the raw file unchanged and log its hash beside the normalized row. Manually capture exact retention values with their own source/period when they are not present in the export. [Export instructions](https://support.google.com/youtube/answer/9717005?hl=en-GB)

Never collect identifiable child-level data for this workflow. Optional adult feedback is not a representative survey or a controlled developmental study. Store anonymous summaries; omit names, contacts and recordings from Git.
