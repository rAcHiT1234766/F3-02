# Project status

Last updated: 1 November 2026 · Deadline: 20 November 2026

**Summary:** the build is complete, tested, published to npm and reviewed with a real
screen reader, the latest Chromatic build is reviewed and accepted, and the code is on GitHub
with passing CI. What remains is submission material that needs the project owner: the demo
recording, the reflection and rehearsing the presentation.

Links: [GitHub](https://github.com/rAcHiT1234766/F3-02) · [Live Storybook](https://main--6adb1ea72d119416b1620b45.chromatic.com/) · [npm package](https://www.npmjs.com/package/@rachitp72/foundation-ui) ·
[Figma tokens file](https://www.figma.com/design/SP7lRRZBFGGODBBi8uLCDk/I01) ·
[Test results](docs/test-results.md) · [Component inventory](docs/component-inventory.md)

## Assignment steps

| #   | Step                                          | Status                                                                                                                                                           |
| --- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Design tokens in Figma → Style Dictionary     | ✅ Done. The Figma file is the source of truth; a change made in Figma was verified in the app.                                                                  |
| 2   | Monorepo with TypeScript, Tailwind, Storybook | ✅ Done                                                                                                                                                          |
| 3   | Core and composite components                 | ✅ Done: 44 components                                                                                                                                           |
| 4   | WCAG 2.2: axe and a real screen reader        | ✅ Done. axe passes on all 204 stories and in browser tests; NVDA 2026.3 review of the dashboard: 18 of 18 checks pass ([manual review](docs/manual-review.md)). |
| 5   | Light and dark themes from tokens             | ✅ Done                                                                                                                                                          |
| 6   | Jest/RTL and Chromatic                        | ✅ Done: 72 unit tests (97% coverage), 13 interaction tests, Chromatic baseline with reviewed changes                                                            |
| 7   | Storybook docs and publish with semver        | ✅ Done. Documentation site is live; published to npm as [`@rachitp72/foundation-ui@0.2.0`](https://www.npmjs.com/package/@rachitp72/foundation-ui) (MIT).       |

## Submission deliverables

| Deliverable                                     | Status                                                                                                                                                                                  |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Working demo (deployed or screen-recorded)      | ⚠️ Runs locally (`npm run dev:demo`); a screen recording is still needed                                                                                                                |
| GitHub repository: clean commits, README, setup | ✅ Public: [rAcHiT1234766/F3-02](https://github.com/rAcHiT1234766/F3-02); CI passed on the first push. History restarts at 1 Nov 2026 (earlier history was lost)                        |
| Architecture diagram and API documentation      | ✅ [docs/architecture.md](docs/architecture.md), [docs/api.md](docs/api.md)                                                                                                             |
| Test results and performance numbers            | ✅ Test results, Lighthouse scores, DataGrid speed and size budgets ([docs/test-results.md](docs/test-results.md))                                                                      |
| 10-minute presentation                          | ⚠️ Deck drafted: 8 timed slides plus 4 backup slides, with speaker notes ([slides](https://claude.ai/artifact/FGaSo73479RsuYscMwmfqw)); owner to personalise slide 4 notes and rehearse |
| Individual reflection                           | ❌ To be written by the owner ([docs/reflection.md](docs/reflection.md))                                                                                                                |

## Verified results (latest run)

- `npm run check`: lint, typecheck, 10 token tests, 28 contrast pairs, 72 Jest tests, builds: all pass (0.2.0, 1 Nov 2026)
- Coverage: 97.4% statements, 90.4% branches, 99.3% functions, 98.4% lines
- `npm run test:storybook`: 204 stories; 13 of 13 interaction tests pass; 204 of 204 axe scans with no violations
- `npm run test:browser`: dashboard workflows, focus handling, 320px reflow and axe in both themes: pass
- `npm run pack:check`: packed library installs, type-checks, builds and works in a separate app (rerun 1 Nov 2026); the published 0.1.0 and 0.2.0 also install from npm and pass the same browser check.
- Chromatic: baseline established; a deliberate regression (57 changes) was caught and denied
- Lighthouse 13.5.0: desktop 100 / 100 / 100 / 100, mobile 99 / 100 / 100 / 100 (performance / accessibility / best practices / SEO)
- DataGrid at 10,000 rows: every interaction under 6 ms in 0.2.0, search included; 0.1.0 took 16 ms to refine a search and 5.6 ms to tick a row on the same laptop ([before and after](docs/test-results.md#datagrid-020-memoisation))
- Size budgets: Button adds 0.3 KB and DataGrid 3.0 KB of gzipped JavaScript to an app (limits 1 KB / 5 KB)
- GitHub Actions on Ubuntu (1 Nov 2026): `npm ci`, `check`, coverage, Storybook build, Storybook interaction and axe tests, and `pack:check` all pass

## Waiting on the owner

1. ✅ **Chromatic build 5:** reviewed and accepted 1 Nov 2026. 15 changes accepted (12 new
   interaction stories and 3 Tooltip stories with a corrected icon). The 16th was
   Progress/Indeterminate, auto-ignored by Chromatic as unstable because the browser animates
   a value-less `<progress>` bar itself; not a regression
   ([details](docs/test-results.md#chromatic-build-5-review)). **Build 6** (0.2.0, the first
   upload from GitHub Actions) was reviewed and accepted 2 Nov 2026: the new Bulk action story
   and 7 DataGrid stories whose hidden checkbox labels had not been accepted since build 1
   ([details](docs/test-results.md#chromatic-build-6-review-020)).
2. ✅ **NVDA screen-reader review:** done 1 Nov 2026. 18 of 18 checks pass with no defects ([docs/manual-review.md](docs/manual-review.md)).
3. ✅ **npm publication:** done 1 Nov 2026. `@rachitp72/foundation-ui@0.1.0` is live; 0.2.0 followed the same day (DataGrid controlled selection and faster updates, [release notes](docs/release.md)). A clean install of each from npm builds and passes the browser check.
4. ✅ **GitHub:** pushed 1 Nov 2026 to [rAcHiT1234766/F3-02](https://github.com/rAcHiT1234766/F3-02); CI passes.
5. **Presentation and reflection.**

## Enhancements

| Enhancement                                                    | Status                                                         |
| -------------------------------------------------------------- | -------------------------------------------------------------- |
| Storybook as a design-system site (foundations, guides)        | ✅ Done; every row of all 44 props tables has a description    |
| Interaction tests and axe on every story                       | ✅ Done; found and fixed four real defects                     |
| Performance numbers (DataGrid speed, Lighthouse, size budgets) | ✅ Done                                                        |
| Polish: toasts covering table actions, row checkbox labels     | ✅ Done; browser test proves toasts never cover keyboard focus |
| Official `@tokens-studio/sd-transforms` in the token build     | ⏳ Planned                                                     |

## Suggested next steps

- **Build:** optional: official `@tokens-studio/sd-transforms` in the token build.
- **Owner:** a demo recording (or a hosted demo), the individual reflection, and personalising
  and rehearsing the presentation.
- **Final week:** presentation, reflection and rehearsal.
