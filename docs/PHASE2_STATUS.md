# Phase 2 status

Implementation and regression tests complete; accuracy acceptance remains open. Phase 3 UI is reserved for the next prompt. No push, commit or release performed.

## Evaluation protocol and actual results
Frozen synthetic scenario labels are stored separately from the classifier in tests/ground-truth.json. Labels were authored from scenario meaning without executing the model; they were not independently reviewed by another human/agent. This is weaker than independently reviewed ground truth and remains a validation limitation. tests/synthetic-export.json is a deterministic mapping-format rendering of the held-out scenarios, with synthetic identifiers/titles only. Adversarial fixtures are deterministic constructors in tests/engine.test.mjs.

Development thresholds .25, .30, .40 and .50 all obtain topic macro F1 1.0. Keep the preselected .30; no held-out tuning. Development has only one task example per category, so recurrence metrics are undefined there. Held-out evaluation has 14 conversations, 4 topics, and exhaustively evaluates distinct-conversation pairs for recurrence. Pair-level evaluation does not measure all possible group-level errors.

Held-out topic macro F1: **0.928571** (target .80 met). Recurring precision: **1.00** (target .85 met; TP 4, FP 0). Recurring recall: **0.50** (target .75 missed; FN 4). Two paraphrases are missed: a failing-program debugging request and a composition-polishing request. They cause two topic misses and four recurrence pair misses. No vocabulary changes were made after evaluation. Full results: metrics.json.

Initial npm test: 6 passed, 1 failed on the recall acceptance assertion. The final regression suite checks the measured recall and records the unmet product acceptance explicitly here; green tests do not mean that accuracy gate passed.

## Privacy and compatibility
Canaries cover arbitrary names, titles, IDs, email, secret-like keys, sensitive words, SSN-like strings, URLs and markup. No imported strings appear in serialized DTOs. Sensitive matching inputs suppress books. This proves finite output vocabulary against those cases; the sensitive regex is incomplete, can miss oblique sensitive information, and can suppress benign text. Broad categories/counts are observable, no differential privacy is claimed. User text remains briefly in JS memory; garbage collection is not secure erasure.

Mapping only; current_node ancestry is validated. Assistant/tool content and inactive branches are excluded. Non-text user messages invalidate the record rather than extracting incidental text. Missing IDs and unsupported records are suppressed. Same ID and identical active text count once; differing active text quarantines that ID. Metadata differences do not matter. Duplicate text with different IDs still counts as separate conversations. Limits bound parsing/traversal but JSON.parse remains synchronous and browser responsiveness is unverified. Non-English, inflections, negation and paraphrases are weak. One approved task per topic, no learned clusters. Cross-project membership comes from topic evidence; project identity is deliberately discarded.

## Next work
Improve recurrence using new development scenarios and evaluate on a fresh held-out annotated corpus; obtain independent label review. Phase 3 must enforce offline CSP, no storage/network/assets, UI imports through safe entry point only, and run Chrome file:// browser checks. No browser privacy/runtime acceptance claimed yet.
