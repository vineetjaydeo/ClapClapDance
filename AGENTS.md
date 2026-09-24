# Project operating instructions

- ClapClapDance serves families with children aged 0–7. Videos show kids and parents dancing together. Preserve this positioning in research and production.
- Start from README.md, program.md, the latest research cycle, and git status. Read the relevant operations document before making a production or measurement decision.
- The owner requested that work stay updated in https://github.com/vineetjaydeo/ClapClapDance. Update relevant documentation and records alongside changes. Commit the task's reviewed files, push without force, and verify remote HEAD. Do not include unrelated edits. If push fails, report local and remote status separately.
- The repository is public. Never commit secrets, private Studio exports, identifiable family feedback, releases, personal contact data, or raw browser activity. Store these under .private/ when needed. Project media uses Git LFS and the checksum manifest. Verify changed media remotely before updating its verified status; do not change billing limits.
- Distinguish official policy, observed facts, inference, hypothesis, and experimental findings. Cite dated primary sources. Public view counts do not reveal competitors' CTR, retention, RPM, or causes of success.
- Keep the measurement protocol stable during an experiment. Do not change its metric, time window, comparison, or success rule after seeing results. Corrections require a logged protocol revision and usually a restart.
- Missing/suppressed metrics are null, not zero. Never fabricate results, evidence, audience sizes, statistical significance, or causal effects.
- Channel publishing, metadata edits, paid campaigns, spending, and messages to other people need scope-specific user authorization. Repository synchronization is already authorized. Read-only channel inspection and local research are within scope.
- Do not resume rejected Blender/local-3D work. Existing source is archival context unless the owner explicitly chooses to revisit it. Preserve supplied music and verify finished output audio, not only the input file.
- New tools that influence measurement need meaningful boundary checks. Run `python3 scripts/lab.py check`; for Python lab changes also run `python3 -m unittest discover -s tests`. Do not run the legacy render pipeline as part of research validation.
- No unattended schedule is implied by these files. Record when a cycle was actually run; do not promise ongoing monitoring without a configured automation.
