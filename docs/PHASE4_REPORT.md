# Phase 4 verification and packaging — 2026-11-26

Local review package ready. Phase 3 UI and Phase 4 browser/privacy/package work performed. Full product acceptance remains open: Phase 2 recurrence recall misses its target and labels lack independent review. No commit, push, hosting or public release performed.

## Deliverable
release/ChatShelf.html: 16,594 bytes, a single self-contained file opened and exercised directly in Chrome on macOS via file://. SHA-256:

```
17fdf7d3e605cedd5ad68429c797b6a6d34f3c34fef54fa30bc1d9bf2052a026
```

release/SHA256SUMS contains this checksum. Two consecutive package builds produced the same digest; `shasum -a 256 -c SHA256SUMS` passed from the release folder.

## Exact commands and results
Run from repository root:

```sh
npm test
# 11 passed, 0 failed
npm run typecheck
# passed
npm run build:browser-checks
# strict test-harness typecheck and test-page build passed
npm run package
# built HTML and checksum
shasum -a 256 release/ChatShelf.html
npm run package
shasum -a 256 release/ChatShelf.html
# identical digests above
git diff --check
# passed
```

Open dist/qa/browser-checks.html in Chrome. Actual observed result: **15/15 passed**, captured in browser-checks.png. The harness instruments application network/storage APIs and console methods before loading the UI. It outputs fixed test names only. The harness is excluded from the deliverable.

## Real Chrome checks
| Check | Result |
| --- | --- |
| Empty startup | Passed |
| Sample library renders four books | Passed |
| Detail contains fixed prompt and checklist | Passed |
| Clear removes books and dialog contents | Passed |
| Synthetic import and recurrence | Passed |
| File input filename cleared | Passed |
| Raw ID/title/name/filename/markup canaries absent from rendered UI | Passed |
| Sensitive-content suppression | Passed |
| Malformed JSON gives fixed error | Passed |
| File count limit enforced | Passed |
| Clear cancels stale in-flight import | Passed |
| No application network/storage API calls during UI flows | Passed |
| No application console calls during UI flows | Passed |
| No external subresources during UI flows | Passed |
| Chrome enforces connect-src CSP | Passed |

The separate deliberate network probe to example.invalid was blocked by Chrome before connection, confirmed through a securitypolicyviolation event. A browser-generated CSP diagnostic from this test is expected; it is not an application log.

Native checks additionally verified actual OS file-picker import of tests/synthetic-export.json (four books, three conversations each), Clear reset, empty state after reload, Escape dismissal and restored book focus. Visual review confirmed desktop two-column shelves at approximately 1239 CSS px and narrow single-column shelves at approximately 631 CSS px. Window width was restored. Screenshots are cropped to app content to exclude personal browser chrome. Reduced-motion CSS and focus styling are implemented; no screen-reader or full WCAG audit claimed.

The browser attachment API was unavailable due to desktop compatibility. The synthetic browser suite ran as a local page in actual Chrome through native controls; no headless run claimed. HTTP preview on 127.0.0.1:4173 returned 200; temporary server was stopped. The standalone app remains open in Chrome with synthetic sample data. No real user exports were used.

## Remaining acceptance gaps and limitations
Original metrics unchanged: topic macro F1 .928571, recurrence precision 1.00, recurrence recall .50 (target .75 unmet). Author annotations are stored separately but lack independent review. Improve on new development scenarios and evaluate against a fresh independently labeled corpus before claiming accuracy acceptance.

Closed output vocabulary prevents verbatim imported text from being rendered. Sensitive-content heuristics remain incomplete; approved categories/counts can reveal broad activity. JavaScript memory is not securely erased. Browser extensions and OS file-picker recents are outside the app's no-persistence boundary. CSP blocks network connections; source/test guards verify absence of application storage use, rather than claiming CSP disables storage APIs. Large valid JSON imports can still pause synchronous parsing. Synthetic tests do not establish all-export/all-version Chrome compatibility.
