# Phase 5 release preparation — 2026-11-26

User instruction on this turn explicitly replaces the earlier hold-release decision: release with documented residual accuracy failures after careful fixes. Original targets remain .80/.85/.75; recall remains a measured failure, not a pass. Independent annotation remains unavailable and is disclosed, rather than blocking this authorized initial release.

Changes: parser retains user-turn arrays instead of flattening task evidence; duplicate comparison preserves turn boundaries; malformed/unknown authors reject records. Task assignment abstains on quotes/hypotheticals/additional negation. Per-topic cosine prevents other topics diluting evidence. No vocabulary expansion against exposed held-out misses. Earlier explicit-treatment suppression retained. UI source/design untouched.

Validation: 14/14 Node tests; application and browser-harness strict compilation pass. Chrome file:// synthetic harness rerun on final engine: 15/15 passed. Standalone HTML reload starts empty and synthetic sample renders four shelves; Clear verified. Browser tests instrument selected network/storage/console APIs; CSP blocks connection probe. No real exports used. Regression challenge tests are not fresh held-out evidence. Original metrics remain macro F1 .928571, pair precision 1.00, pair recall .50 (TP4/FP0/FN4).

Original independent review and Phase 2/4 reports remain historical evidence; their hold/checksum/build-status statements are superseded by this report, current release notes and SHA256SUMS. Existing synthetic screenshots retained because UI is unchanged. README, architecture and release notes describe the shipped behavior/limitations. Strict numeric check remains nonzero; documented-limitations route requires passing tests/typecheck and records the user-authorized exception explicitly.

Publication status is recorded in PROJECT_TRACKER.md; do not infer publication from build success.

Final HTML: 17,021 bytes; two consecutive package builds produced SHA-256 `5bdef7d4840a6ba7900590dbde92c19ced35ca4b419e5cabbc2db3904387f168`. Release checksum verification passed.
