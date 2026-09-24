# ClapClapDance autoresearch program

Objective: learn which music, parent-child choreography, packaging, and distribution choices create repeat family use at sustainable production cost, for families with children aged 0–7.

The owner-selected business milestone is 1,000 subscribers and 4,000 qualifying public watch hours. Read `operations/ypp-growth-plan.md` for the current plan and separate Studio/Earn eligibility totals from diagnostic Analytics watch time. The owner confirmed one polished original per week, five hours weekly and $50–80 monthly; production feasibility still needs evidence. Scenario rates and the 26-week horizon are provisional assumptions, not measured results or a guaranteed finish date.

Inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch/tree/228791f). This is a domain adaptation, not the upstream LLM-training program. The human-readable protocol is executed by the agent; `scripts/lab.py` validates records and prepares descriptive reviews. It does not autonomously publish, run an LLM, or infer causality.

## Fixed evaluation contract

Read `operations/measurement.md`. Preserve its version for an experiment. Use one preregistered primary metric, comparable observation windows, format and traffic scope, explicit guardrails, and a stop date. Retain failed and inconclusive attempts. Production quality and child-appropriate participation constrain optimization; maximizing passive screen time is not the objective.

## One research cycle

1. Read AGENTS.md, latest cycle, hypotheses, results, channel audit, and git status. Fetch remote state before editing. Do not overwrite other work.
2. Select the highest-priority uncertainty that can change the next production decision. Default to one question per cycle. Check current primary documentation when a platform rule is involved.
3. Inspect authorized live evidence or local exports. Record source, capture time, reporting period, timezone, filters, maturity, and missingness. Store private inputs in `.private/`; publish only safe summaries. Run `lab.py review` on normalized observations when available.
4. If evidence is missing or immature, record that and prepare the next brief or preregistration. Do not substitute synthetic data or repeatedly recheck unchanged counters. Stop the cycle with a concrete next observation date or dependency.
5. For a production test, write an experiment document from the template before release. Define the changed variable, control, comparable videos, main metric, minimum useful effect, observation floor, guardrails, maximum duration, and confounders. Link the production brief and eventual video IDs. Actual publication follows the owner's authorization.
6. At the planned review, apply the original rules. Use `keep_provisional`, `discard`, `inconclusive`, or `invalid`. Cross-video evidence remains observational even after replication. A single viral upload does not prove a mechanism.
7. Add completed experiment decisions to `experiments/results.tsv` without overwriting older rows. Log research-only progress in `research/cycles/`; never put an unrun experiment into results. Revise a prior decision with a new row that names the earlier record.
8. Update source ledger, audit, hypotheses, and next actions as appropriate. Run checks, review the diff for private data and oversized files, commit, push, and verify the remote SHA. Report what is established and what remains uncertain.

## Keep/discard translation

In upstream autoresearch, evaluation is fast and controlled. Here, audience composition, recommendation exposure, song appeal, and time all change. A `keep_provisional` decision means use the idea in the next production block while gathering replication evidence. It never means the YouTube algorithm or a developmental benefit was scientifically proven.

Prefer the simpler, cheaper production method when quality and measured outcomes are practically indistinguishable. Do not erase production history with `git reset --hard`, delete poor-performing public videos, or relabel child-directed content to unlock restricted features.

## Boundaries

Research, local authoring, read-only inspection, and repository updates can proceed. New video releases, changes to live titles/thumbnails/settings, payments, outreach, and collecting family feedback require the relevant user instruction. Do not collect children's identities, recordings, or direct responses for this program; any optional pilot uses adults' voluntary, anonymous observations.

Complete one cycle per invocation unless the user requests a longer research session. A scheduled cycle is a separate app automation and is not installed by this program.
