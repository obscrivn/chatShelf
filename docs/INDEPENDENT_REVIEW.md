# Independent critical review — 2026-11-26

Historical decision (before the subsequent user instruction): **hold release**. **Superseded:** the user now authorizes release with documented residual accuracy failures; see PHASE5_REPORT.md and RELEASE_NOTES.md. Independent source/test inspection of the existing working tree, not independent authorship of the original labels. UI design unchanged. All inputs exercised here are synthetic. Repo origin is https://github.com/obscrivn/chatShelf.git; checkout is nested at chatShelf/chatShelf. Existing README modification and all untracked implementation deliverables were preserved. No remote publication performed.

## Findings, severity and disposition

1. **High — recurrence acceptance fails.** `src/index.ts:2–6,41–48` uses exact vocabulary, at least two topic hits and an exact task verb. “Discuss debugging a failing program” and “Polish my composition” both return no topics. No stemming/paraphrase recognition; lowering cosine threshold cannot overcome the two-hit gate. Programming and Writing each have TP=3, FP=0, FN=1 (F1 .857143); Learning and Planning each TP=3, FP=0, FN=0 (F1 1). Recurrence pairs: debugging TP=1/FN=2; revision TP=1/FN=2; lesson and planning each TP=1/FN=0; all FP=0. Original macro F1 .928571, pair precision 1, pair recall .50. Blocker remains; do not tune against these now-exposed held-out examples.
2. **High — evaluation is insufficient for release claims.** `tests/engine.test.mjs:43–60` measures shared-task conversation pairs, not book/group correctness, and asserts recall equals .50 rather than enforcing acceptance. Four development cases provide no positive recurrence pairs. Fourteen held-out cases contain little ambiguity or negative task evidence; same-author annotations explicitly lack independent review. Multi-label cases have no expected tasks. The fixture test previously claimed matching independent labels but only checked determinism/four topics; renamed accurately. New `npm run check:release` enforces numeric targets and currently fails. Fresh separately annotated corpus and per-task confusion required; green regressions are not acceptance.
3. **High — ambiguous task assignment.** Original `src/index.ts:48` borrowed any matching verb from the entire conversation. Repeated “Explain python code and fix punctuation in an essay draft” created recurring Debug code; repeated “Do not debug python code” did too. Fixed conservatively by requiring affirmative task/topic evidence in a clause, splitting sentences and and/but. Both now have zero recurring tasks; positive two-topic/two-task regressions pass. This heuristic can abstain on coordinated legitimate requests and cannot resolve all ambiguity, quotations or long-range negation. These are development regressions, not new held-out accuracy evidence.
4. **High — explicit sensitive treatment bypass.** `src/index.ts:16` originally allowed “Plan project tasks for my chemotherapy appointments” to emit Planning and recurring Plan project with two IDs. Added chemotherapy/cancer suppression; now emits no books. This closes the measured example only. Sensitive detection remains a finite, English keyword heuristic, with false positives (e.g. code tokens/private methods) and oblique/other-language misses. Closed vocabulary prevents verbatim leaks, not sensitive semantic inference. Broader sensitivity challenge evaluation required.

## What holds up

Catalog labels, prompts and checklists are static, generic and approved; raw titles/project names cannot become label strings. Exactly four topics and one task each: controlled multi-label assignment, not open-ended discovery. `src/index.ts:17–39` follows current_node parents only and excludes assistant/tool/system evidence; missing parents/cycles and multimodal user payloads fail closed. `src/index.ts:70–87` deduplicates IDs, quarantines differing active text for the same ID and counts each accepted conversation once per topic/task. Different IDs with identical text still count separately by contract. Resource bounds exist, though cumulative 200 MB and synchronous JSON parsing can pause Chrome; no latency benchmark was supplied or measured.

UI imports only the safe entry point, renders fixed strings/counts through textContent and clears file input/details. Self-contained artifact tests verify matching CSP hashes, connect-src/default-src none and no external resources. Source scans support absence of runtime network/storage/logging; scans alone are not a universal proof.

## Measured before / after

| Measure | Before | After | Acceptance |
| --- | --- | --- | --- |
| Original topic macro F1 | .928571 | .928571 | >= .80 |
| Original recurrence pair precision | 1.00 (4 TP/0 FP) | 1.00 (4 TP/0 FP) | >= .85 |
| Original recurrence pair recall | .50 (4 TP/4 FN) | .50 (4 TP/4 FN) | >= .75 — FAIL |
| Negated debugging probe: recurring tasks | 1 | 0 | regression only |
| Unrelated punctuation fix probe: recurring tasks | 1 | 0 | regression only |
| Explicit treatment probe: books | 1 | 0 | regression only |
| Node tests | 11/11 | 12/12 | pass |

Strict application and browser-harness compilation pass. Rebuilt harness opened in actual macOS Chrome via file://: **15/15 passed**, observed through native accessibility on this review. It covers import, DTO/UI canaries, sensitivity example, Clear and stale import cancellation, no instrumented application network/storage/console calls, no external subresources, and a deliberately blocked connect-src probe. Browser extension control failed; native Chrome controls were used. No fresh OS-file-picker/viewport/screen-reader audit claimed; existing Phase 4 screenshots are historical synthetic evidence. The browser suite instruments selected APIs; it does not prove absence of every possible storage mechanism. Build checks cover the actual standalone artifact's CSP; harness executes the same UI source with its own test instrumentation.

No accuracy improvement claimed. No fresh held-out metrics claimed. The old PHASE4_REPORT checksum describes its earlier build; use current release/SHA256SUMS for the rebuilt local review artifact. Release remains blocked despite passing regression/browser checks.

Final local package verification: two consecutive builds produced identical SHA-256 `f2d5befbc2375d71d379baba0c2507a2be78acfcdf2e31e9549899bebe50748a` (16,824 bytes); checksum verification passed. `npm run check:release` was executed and exited 1 specifically on recall .50 < .75 after 12 passing tests and passing typecheck. `git diff --check` passed for tracked changes; most implementation files remain untracked as found.
