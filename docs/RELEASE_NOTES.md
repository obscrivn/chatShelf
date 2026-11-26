# ChatShelf v0.1.0

Download **ChatShelf.html** below, save locally and open in Chrome. No server, account, API key or internet connection is required. Try the synthetic sample library or import extracted conversation JSON files together. Reimport each session; Clear session removes the displayed library. Verify the download with SHA256SUMS.

Four predefined topic shelves connect distinct conversations; recurring approved tasks provide static prompts and checklists. The bookshelf design is unchanged. No raw titles, IDs, filenames, conversation text or generated labels appear. No runtime dependencies, uploads, network requests, telemetry or application persistence.

## Known accuracy and privacy limitations

The user authorized publication with these disclosed quality limitations on 2026-11-26, superseding the earlier hold-release decision. This is an initial release, not an all-acceptance-targets-passed claim.

| Original synthetic metric | Before | Release | Target |
| --- | --- | --- | --- |
| Macro topic F1 | 0.928571 | 0.928571 | 0.80 |
| Recurring pair precision | 1.00 | 1.00 | 0.85 |
| Recurring pair recall | 0.50 | **0.50 — below target** | **0.75** |

Measured on the original 14-case corpus; recurrence TP=4, FP=0, FN=4. Exact vocabulary misses debugging/program and composition-polishing paraphrases. No held-out vocabulary tuning was performed. The original annotations are same-author synthetic labels, not independently reviewed. These exposed examples now provide regression evidence; no new independent held-out validation or real-user accuracy claim is made. Pair metrics do not measure all book/group errors.

This release fixes unrelated/negated task evidence, adds explicit chemotherapy/cancer suppression, preserves user-turn boundaries, quarantines differing turn sequences sharing an ID, rejects malformed authors and stops unrelated topics diluting multi-label scores. Quoted/hypothetical clauses abstain conservatively. New challenge cases are development regressions, not accuracy validation. Clause splitting, quoting and exact English vocabulary still miss legitimate requests and can misclassify other ambiguities. Only four topics and one task per topic are supported.

Sensitive detection is a finite English keyword heuristic and may miss oblique or other-language sensitive content or suppress benign code. Fixed output vocabulary prevents verbatim imported-string leakage; categories/counts still reveal broad activity. No guarantee of perfect sensitive-topic detection or secure memory erasure. Browser extensions and operating-system file recents are outside the app boundary. Large imports can pause synchronous parsing; no latency benchmark was measured.

## Verification

14/14 Node tests and strict application/browser-harness compilation passed. Latest synthetic harness in actual Chrome file://: 15/15 passed, including instrumented no-network/storage/console checks, privacy canaries, Clear/stale-import cancellation and CSP connection blocking. Standalone startup/sample/Clear/reload checked. Historical synthetic desktop/narrow screenshots are in docs; no UI redesign, fresh accessibility audit or universal export-compatibility claim.

The strict numeric release check still fails on recall. The separately named documented-limitations check records the authorized exception and requires tests/typechecking to pass. Deterministic HTML and SHA-256 checksums accompany the release. See docs/INDEPENDENT_REVIEW.md, docs/PHASE5_REPORT.md and docs/ARCHITECTURE.md for provenance and details.
