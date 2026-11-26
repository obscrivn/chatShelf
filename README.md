# ChatShelf

A quiet, offline bookshelf for topics and tasks you return to in ChatGPT. Open **release/ChatShelf.html** in Chrome. No installation, account, server or internet connection is needed to use it.

## Use your bookshelf

1. Download the HTML file and save it locally. Open it in Chrome.
2. Try **Explore a sample library** to see synthetic books.
3. Extract your ChatGPT data export locally. Choose **Import JSON files** and select the conversation JSON files together, including split files when applicable (up to 20 files, 10 MB each). ZIP and HTML input are unsupported.
4. Select a book for its predefined prompt and checklist. Recurring tasks require two distinct conversations.
5. Choose **Clear session** when finished. Reimport after reload or reopening.

No raw conversation titles, IDs, text or filenames are rendered. Only four approved topic categories, predefined guides and aggregate counts appear. The app does not upload or save imported data. Browser extensions and the operating system are outside its boundary; JavaScript memory is not securely erased. Sensitive/unknown content may be excluded, but sensitive-topic detection is heuristic and incomplete.

## Release and known limitations

v0.1.0 is the initial downloadable release. [Download ChatShelf.html](https://github.com/obscrivn/chatShelf/releases/download/v0.1.0/ChatShelf.html) and [SHA256SUMS](https://github.com/obscrivn/chatShelf/releases/download/v0.1.0/SHA256SUMS). Save the HTML and open it locally in Chrome.

Original 14-case synthetic results before and after fixes: topic macro F1 **.928571**, recurrence pair precision **1.00**, recurrence pair recall **.50**, below its **.75 target** (4 TP, 0 FP, 4 FN). The user authorized release with this disclosed limitation. Exact English vocabulary misses paraphrases; ambiguous/quoted/negated clauses may abstain. Labels lack independent reviewer validation; no fresh held-out or real-user accuracy claim. Sensitive screening is incomplete.

See [release notes](docs/RELEASE_NOTES.md), [critical review](docs/INDEPENDENT_REVIEW.md), [Phase 5 report](docs/PHASE5_REPORT.md), [architecture](docs/ARCHITECTURE.md) and [tracker](docs/PROJECT_TRACKER.md). Historical Phase 2–4 reports preserve earlier evidence. The approved UI is unchanged; synthetic screenshots: [desktop](docs/bookshelf-desktop.png), [narrow](docs/bookshelf-narrow.png).

The strict `npm run check:release` still fails on recall. `npm run check:release:documented` records the authorized exception while requiring passing regression tests and typechecking. A documented exception is not a metric pass.

## Development and verification

Node 21+ and npm. Build-only dependencies are pinned; runtime has no dependencies.

```sh
npm ci --ignore-scripts
npm test
npm run typecheck
npm run build:browser-checks
npm run package
```

Open `dist/qa/browser-checks.html` in Chrome to run the synthetic browser integration suite. It reports results in the page; it is not included in the delivered HTML. The suite deliberately probes a forbidden example.invalid connection to verify the CSP blocks it before network access. Engine tests and metrics use synthetic fixtures only. No real exports should enter development tooling or this repository.

The package command writes the standalone HTML and `release/SHA256SUMS`. Verify its checksum from the release folder with `shasum -a 256 -c SHA256SUMS`. Build twice and compare hashes to verify deterministic output. See [SPEC.md](SPEC.md), [AGENTS.md](AGENTS.md), and [export compatibility research](docs/EXPORT_RESEARCH.md).
