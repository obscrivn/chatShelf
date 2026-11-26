# ChatShelf specification

## Approved scope and roadmap
1. Phase 1: this specification and AGENTS.md.
2. Phase 2: documented export research, synthetic fixtures, private parser, controlled classification, recurrence, safe DTO, mock UI data, tests and evaluation.
3. Phase 3 (next prompt): accessible Chrome bookshelf UI and single self-contained downloadable HTML built from TypeScript. No UI implementation in Phase 2.
4. Phase 4: offline browser/privacy verification, packaging and review. No push or release until requested.

## Privacy and data contract
Runtime is fully offline: no LLM, API, server, network, telemetry, storage, cookies, service worker or persistence. Reimport each session. Raw data exists transiently in engine memory only; never display/log/export raw text, conversation IDs, titles, filenames, snippets or computed labels. Output contains only static approved taxonomy/template strings and aggregate distinct-conversation counts. Counts and approved categories still reveal broad activity; sensitive categories are excluded entirely. A closed output vocabulary guarantees no verbatim leakage, not perfect semantic sensitivity detection. Unknown content produces no book. Sensitive conversations are conservatively suppressed before classification. Ignore titles and metadata. No real exports in tests or repository.

Import JSON arrays, single mapping records, and {conversations: [...]} envelopes, including multiple split files selected together. Only mapping/current_node parent ancestry is authoritative; reject missing parents, missing current node, cycles, inconsistent IDs and conflicting duplicate records. Identical duplicate IDs count once. Do not guess leaves or use flat API messages. Only plain text user messages count as evidence; assistant/tool/system and multimodal payloads are excluded. Limits: 20 files, 10 MB/file, 10,000 records, 2,000 active nodes and 100,000 user-text characters per conversation. Malformed input yields fixed codes, never native exceptions. No ZIP/HTML execution.

## Engine and books
Controlled topics: Programming, Writing, Learning, Planning. Controlled tasks: Debug code, Revise writing, Design lesson, Plan project. Multi-label books span conversations and projects; project names are never retained. Deterministic normalized controlled-vocabulary cosine classification with evidence gate; no generated labels. Recurrence means at least two distinct conversations with the same approved task within a topic, never repeated turns. Generalized prompts/checklists are fixed constants. Safe DTO exposes approved topic/task enums, static labels/templates and counts only. Raw parser types stay private; UI imports only public entry point.

## UI wireframe (Phase 3)
[ChatShelf] [Import JSON files] [Clear session]
[Offline · data stays in this tab]
| Programming shelf ======================== |
| [book spine: Debug code · 3 conversations] |
| Writing shelf ============================ |
| [book spine: Revise writing · 2]           |
Select a book -> approved generalized prompt + checklist + count.
Empty state explains import and suppression. Accessible keyboard navigation, reduced motion, responsive shelf/spine layout; no raw search, source preview or title display. Check-in feature deferred to v2.

## Acceptance
Strict TypeScript build and synthetic-only tests pass. Active branches, cycles, malformed input, split deduplication, multi-label evidence, distinct counts, unknown/sensitive suppression and privacy canaries tested. Report macro topic F1 >= .80 and recurring precision >= .85 / recall >= .75 on frozen independently authored labels; report misses and small-corpus limitations honestly. Threshold sweep uses development data, final metrics use held-out cases; no claims of real-user validation. Phase 3 must verify Chrome file:// offline operation, blocked network/storage, clear-session state removal and no console leakage. Phase 2 does not establish browser acceptance.

## Phase 3 implementation update
Phase 3 was subsequently authorized, including continuation through Phase 4 without an intermediate approval pause. Local packaged artifact: release/ChatShelf.html. No publication/push authorization was added. The original Phase 2 accuracy gates remain unchanged.

## Phase 5 authorization — 2026-11-26
The user authorizes commit/push/GitHub release after careful parsing/ambiguity fixes, with any remaining accuracy shortfall explicitly documented. This supersedes the previous hold on publication and independent-annotation acceptance prerequisite for this initial release. Numeric targets are unchanged and failed values must remain reported as failures. No UI redesign. Per-topic controlled-vocabulary cosine avoids dilution by unrelated topics; task evidence preserves user-turn boundaries and abstains on ambiguous clauses.
