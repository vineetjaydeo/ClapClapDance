# ClapClapDance

Kids music for families with children aged **0–7**, with videos showing **children and parents dancing together**. The aim is to build a repeatable, enjoyable family activity and a sustainable channel through documented experiments.

[YouTube channel](https://www.youtube.com/@ClapClapDance) · [First public song](https://www.youtube.com/watch?v=6Q0uL2WM_5E)

## Start here

1. [Research and strategy](research/2026-09-24-foundations.md): what the evidence supports, what remains a hypothesis, and what to prioritize.
2. [Channel audit](research/channel-audit.md): verified starting state and specific opportunities.
3. [Plan for 1,000 subscribers / 4,000 hours](operations/ypp-growth-plan.md): a 26-week working horizon, scenario math, release calendar and weekly decisions. The [90-day outline](operations/90-day-plan.md) covers its first phase.
4. [Production standard](operations/production-standard.md): music, choreography, family characters, rights, and release checks.
5. [Measurement protocol](operations/measurement.md): comparable windows, definitions, and decision rules.
6. [Agent program](program.md): the autoresearch-inspired workflow for future work.

## Research status — 2026-09-24

The initial research pass and live channel inspection are complete. Public observation: one video, 4 subscribers, and 12 views at approximately 12:12 UTC. Counters are snapshots, not growth evidence. Private Studio inspection found retention still processing and too little reach to assess packaging. No growth experiment has completed and no winning format has been established.

The owner confirmed the 0–7 audience, parent-child dancing theme, 1,000-subscriber / 4,000-qualifying-hour YPP route, **one polished song per week, five hours weekly and $50–80 monthly**. The growth plan uses a 26-week working horizon and prioritizes weekly originals; extra formats are conditional on spare capacity. English, primary geography and the first active experiment remain to be confirmed. Scenario rates and checkpoint targets are planning assumptions, not forecasts or measured channel performance. The first two productions must establish whether accepted quality fits the time/cash envelope.

## How autoresearch is used

This project adapts the experiment discipline from [karpathy/autoresearch](https://github.com/karpathy/autoresearch) at commit `228791f`: a clear objective, a fixed evaluation protocol, isolated changes, a permanent results log, and keep/discard decisions. Its original NVIDIA training runtime does not perform YouTube research. No GPU experiment was run here. Codex executes this repository's [program.md](program.md), using web evidence and real channel observations.

YouTube feedback arrives over days or weeks and audiences are not randomly assigned. A research cycle must be allowed to end with **insufficient evidence**. This is an agent workflow with local tools, not a background service.

```sh
python3 scripts/lab.py check
python3 scripts/lab.py status
python3 scripts/lab.py review --metrics .private/analytics/observations.csv
python3 scripts/lab.py inventory
python3 -m unittest discover -s tests
```

To resume with an agent: **Read program.md and run one research cycle. Review the latest evidence, update the experiment records, and sync this repository.**

## Repository map

| Path | Purpose |
| --- | --- |
| `research/sources.json` | Dated primary-source evidence ledger |
| `research/benchmark-study.md` | Competitor patterns and a reproducible future sampling protocol |
| `experiments/hypotheses.json` | Prioritized, unproven hypotheses |
| `experiments/results.tsv` | Append-only completed experiment decisions; initially empty |
| `research/cycles/` | Completed research cycles, including inconclusive ones |
| `research/ypp-plan-model.json` | Explicit illustrative inputs, calculations and checkpoint targets for the growth plan |
| `templates/` | Video brief, experiment, adult feedback, observation CSV, weekly review |
| `operations/` | Production, measurement, release, and storage rules |
| `assets/manifest.json` | Media sizes, SHA-256 hashes and remote verification status |
| `Oats and Beans/` | Preserved legacy lyrics, timings, source, and production notes |
| `.private/` | Ignored private analytics and local review outputs |

The GitHub repository is public. Research, source, project media, approved summaries and experiment decisions are versioned here. Video/audio/image files use **Git LFS**; install Git LFS before cloning or pulling media. Keep raw Studio exports, family feedback, private contracts and credentials outside Git. Remote media verification is recorded separately from the inventory; see [storage](operations/storage.md).

Legacy render notes and technical checks do not certify creative acceptance. Do not confuse `oats-n-beans-v1.mp4` with the separate local 1080p render or restart the rejected Blender experiment.
