# Phase 5 release instructions — authorization update

Latest user instruction authorizes commit/push/release with documented remaining accuracy shortfalls. The earlier hold and requirement to pass every accuracy/annotation gate before publication are superseded for v0.1.0. Targets and historical findings remain unchanged.

1. Read AGENTS.md, SPEC.md, INDEPENDENT_REVIEW.md and PHASE5_REPORT.md. Preserve UI and uncommitted work; synthetic inputs only.
2. Run npm run check:release; retain its measured failures. Run npm run check:release:documented to record the authorized quality exception while requiring tests/typechecking. Never call that exception an accuracy pass.
3. Build browser checks and verify in Chrome file://; record actual results and limitations.
4. Build/package twice, compare hashes, verify SHA256SUMS. Review README, architecture, release notes and synthetic screenshots; inspect staged files for real exports/secrets and generated junk.
5. Verify remote state, commit reviewed project files using Conventional Commits, push without force, set GitHub description/topics and publish v0.1.0 with HTML/checksum assets and disclosed quality limits. Verify published digests and update tracker.

Fresh independently labeled validation remains future quality work; do not tune against the exposed original corpus or imply it is fresh.
