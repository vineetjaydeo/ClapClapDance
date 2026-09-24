# Repository and media storage

This repository is the working record for research, lyrics/timings, production source, briefs, decisions and public-safe summaries. Routine task changes should be reviewed, committed, pushed and verified against origin/main.

Large generated media and source images/audio are versioned through Git LFS and listed in `assets/manifest.json` with file sizes and SHA-256 hashes. Python environments, caches, logs and private analytics are ignored. Bundled vendor source/fonts keep their existing license files.

Run `python3 scripts/lab.py inventory` after media changes. This does not upload, alter or delete media. A file is marked `verified_github_lfs` only when its hash appears in `assets/remote-verification.json`, a receipt from a fresh remote download and checksum check. New or changed hashes remain `remote_unverified` until checked. Verification is a dated observation, not a promise of perpetual availability or an independent disaster-recovery backup.

Install Git LFS before working with media, run `git lfs install --local` in the checkout, then `git lfs pull`. Ordinary clones without LFS may contain pointer files instead of the media. Upload changed media with a normal `git push`; the LFS hook transfers the objects. Use a fresh temporary LFS object store for remote verification so local cached objects cannot make a failed remote transfer appear successful.

The initial media inventory is approximately 302 MB. GitHub LFS accounts for every stored file version and download bandwidth. The existing account budget was checked read-only before setup and was configured to stop LFS overage usage; no billing limit was changed. Recheck allowance as the library grows. See [LFS storage](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage) and [billing](https://docs.github.com/en/billing/concepts/product-billing/git-lfs).

Private inputs go under `.private/` and never enter public Git by default. This includes Studio exports, detailed observation snapshots, financial/contract records, adult feedback, credentials and personal information. Publish only a reviewed summary appropriate for a public repository.

Never force-push over unrelated history. Before a push, fetch origin and inspect differences. If another task has updated the repository, reconcile the change safely and rerun applicable checks.
