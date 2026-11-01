# Verification results

Date: 23 October 2026. Revision: initial commit `d03714a` on `main`. Scope: the 44-component library and
employee dashboard, with design tokens exported from Figma. Automated results only.

## Environment

Windows 10.0.26200; Node 24.16.0; npm 11.13.0; Chrome 155 (headless, puppeteer-core).
Installed with `npm ci` from the root lockfile; `npm audit` reports 0 vulnerabilities.

Observed versions: React/ReactDOM 19.3.0, TypeScript 5.9.3, Vite 6.4.5, Tailwind 4.3.3,
Jest 30.5.2, ESLint 9.39.5, axe-core 4.14.0, Puppeteer Core 25.16.0, Storybook 10.6.3,
Style Dictionary 5.7.0, Radix primitives (dialog 1.3.1 and siblings), react-day-picker
10.0.2. Exact pins are in package.json files. These are tested versions, not a claim
to be the latest toolchain.

## Results

| Check                                  | Observed result                                                                                                                                                                                                                                                     | Limitations                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Token validation and Figma round trip  | 10 tests passed                                                                                                                                                                                                                                                     | Keys, references, cycles, dimensions, schema                                         |
| Figma import                           | `radius.md` 0.625rem → 0.75rem imported; cards render 12px corners in Chrome                                                                                                                                                                                        | Tokens Studio 2.13.2 single-file export, kept at `packages/tokens/figma/tokens.json` |
| Token contrast                         | 28 pairs passed                                                                                                                                                                                                                                                     | Opaque sRGB pairs; rendered contrast is covered by browser axe                       |
| Jest/RTL                               | 69 tests in 11 suites passed                                                                                                                                                                                                                                        | jsdom has no layout; positioning and gestures are browser-checked                    |
| Date conversion                        | Included above; runs in separate timezone processes                                                                                                                                                                                                                 | Gregorian YYYY-MM-DD only                                                            |
| Coverage                               | 97.25% stmts, 90% branches, 99.25% funcs, 98.33% lines                                                                                                                                                                                                              | Thresholds in jest.config.cjs                                                        |
| ESLint / TypeScript                    | Passed                                                                                                                                                                                                                                                              | Source, stories, tests, scripts and demo                                             |
| UI, demo and Storybook builds          | Passed                                                                                                                                                                                                                                                              | Storybook built from the owner's environment                                         |
| Browser workflows                      | Passed (`artifacts/browser-check.json`)                                                                                                                                                                                                                             | Headless Chrome; see checks list in the report                                       |
| Browser axe                            | Passed: workbench, dashboard, gallery, dialogs, drawer, popover, menu; both themes                                                                                                                                                                                  | Menu scan disables only `region` (portalled to body)                                 |
| Storybook interaction tests            | 12 play-function tests passed in headless Chrome (`npm run test:storybook`, `artifacts/storybook-check.json`)                                                                                                                                                       | Keyboard, focus, selection and date flows for 12 interactive components              |
| Storybook axe                          | 203/203 stories scanned in Chrome, 0 violations                                                                                                                                                                                                                     | Each story in its default state plus the play-function end state                     |
| Independent archive consumer           | Passed: install, types, build, browser interaction                                                                                                                                                                                                                  | Separate temp app; no Tailwind or source aliases                                     |
| Tree-shaking                           | Button-only and DataGrid-only bundles: 0 calendar modules                                                                                                                                                                                                           | Measured in the independent consumer                                                 |
| Screen reader / keyboard / zoom review | Not run                                                                                                                                                                                                                                                             | Requires a person with real assistive technology                                     |
| Chromatic visual baseline              | Baseline build 1 (191 snapshots), updated by reviewed builds since; interaction stories snapshot open overlays. Clock frozen to 2026-10-23 during Chromatic runs so calendars do not change daily. Storybook: https://main--6adb1ea72d119416b1620b45.chromatic.com/ | See regression demonstration below                                                   |
| Package publication / demo hosting     | Not run                                                                                                                                                                                                                                                             | Access, destinations and authorization unresolved                                    |

## Visual regression demonstration (Chromatic)

A deliberate regression (`border-radius: 0` on `.fui-button`) was committed on a
throwaway branch `chromatic-regression-demo` (`9fd8b48`) and uploaded as build 2.
Chromatic compared it with baseline build 1 and reported **57 visual changes** across
components that contain buttons (AlertDialog, Button, Card, DataGrid, DatePicker,
DropdownMenu, Pagination, Popover, SearchInput and others). The owner reviewed the
side-by-side diffs, commented on AlertDialog/Default, and denied the changes:
0 accepted, 56 denied, 0 unreviewed. Build 1 remains the baseline; the branch was
deleted and `main` never contained the regression. Screenshots:
`artifacts/chromatic-screenshots/` (local, not committed).

## Chromatic build 5 review

Build 5 (commit `dbb2a53` on `main`, 203 stories, ancestor build 4) reported 16 changes.
The owner reviewed it on 1 November 2026: **15 accepted, 0 denied, 0 unreviewed**, and the
build is the current baseline.

- **12 new stories**, all accepted: the interaction stories that snapshot open overlays
  (Combobox, DataGrid, DatePicker, AlertDialog, Drawer, Modal, Popover, Tooltip, Accordion,
  DropdownMenu and Tabs keyboard interactions, and Toast "Shows a notification").
- **3 changed stories**, all accepted: Tooltip Default, Dark and Narrow, whose trigger
  icon was corrected.
- **1 unstable story, auto-ignored by Chromatic:** Progress/Indeterminate. A `<progress>`
  element with no value is animated by the browser itself, not by CSS, so Chromatic cannot
  pause it and repeated captures differ. This is expected behaviour, not a regression, but it
  means that story has no visual baseline.

## Reproduction

```powershell
npm ci
npm run check
npm run test:coverage
npm run test:browser     # needs Chrome/Edge, or set BROWSER_EXECUTABLE
npm run pack:check
npm run build:storybook
```

## Measurements

All numbers below come from scripts in this repository and can be reproduced. Machine:
Intel Core i5-4440 (2013, 4 threads), Windows, Chrome 155.

### Library size (`npm run pack:check`)

Packed archive: 26,620 bytes. Library JavaScript: 50 modules, 52,762 bytes raw /
24,368 gzip in total; React, Radix and react-day-picker are external. Library CSS:
25,760 bytes raw / 5,162 gzip (one complete stylesheet, intentional).

What a component adds to an app, measured against an app that renders a plain React
button. The check fails if a budget is exceeded.

| Import        | Adds (JS, gzip) | Budget | Calendar modules bundled |
| ------------- | --------------- | ------ | ------------------------ |
| Button only   | 0.3 KB          | 1 KB   | 0                        |
| DataGrid only | 2.8 KB          | 5 KB   | 0                        |

| Consumer bundle (includes React)    | JS raw    | JS gzip   |
| ----------------------------------- | --------- | --------- |
| React only (baseline)               | 223,869 B | 69,492 B  |
| Button only                         | 224,440 B | 69,785 B  |
| DataGrid only                       | 231,259 B | 72,334 B  |
| Button, Input, DataGrid, DatePicker | 350,740 B | 108,711 B |

Dashboard production build: 474,079 bytes JS and 35,375 bytes CSS raw, including React,
all overlays and the calendar.

### DataGrid interaction speed (`npm run perf`)

Production build in headless Chrome. Each value is the time for React to update the DOM
plus layout, median of 7 runs (worst run in brackets), page size 10. The harness checks
that every action had its effect (result count, sort state, page, selection).

| Rows   | Mount      | Search      | Clear search | Sort number | Sort text | Next page | Select row |
| ------ | ---------- | ----------- | ------------ | ----------- | --------- | --------- | ---------- |
| 100    | 5.4 (7.7)  | 4.0 (4.8)   | 2.9 (5.6)    | 2.9 (4.4)   | 2.9 (7.1) | 3.9 (4.4) | 1.6 (1.9)  |
| 1,000  | 4.1 (7.6)  | 5.5 (8.7)   | 3.1 (4.9)    | 3.8 (6.1)   | 4.0 (5.9) | 4.7 (6.7) | 2.3 (3.2)  |
| 10,000 | 5.2 (10.9) | 18.1 (32.4) | 2.8 (4.6)    | 6.9 (10.8)  | 7.6 (8.1) | 7.6 (8.2) | 6.7 (7.2)  |

All values in milliseconds. Even at 10,000 rows on a 2013 CPU, every interaction stays
far below the 200 ms "good" responsiveness threshold (INP) and below the 50 ms long-task
threshold; search is the most expensive because every row is lower-cased and compared.
Paging keeps the DOM small, so cost grows with data processing, not rendering.

### Lighthouse 13.5.0 (`npm run perf:lighthouse`)

| Profile | Performance | Accessibility | Best practices | SEO | First paint | Largest paint | Blocking time | Layout shift |
| ------- | ----------- | ------------- | -------------- | --- | ----------- | ------------- | ------------- | ------------ |
| Desktop | 100         | 100           | 100            | 100 | 0.4 s       | 0.4 s         | 0 ms          | 0            |
| Mobile  | 99          | 100           | 100            | 100 | 1.7 s       | 1.8 s         | 40 ms         | 0            |

The first run scored 96 for best practices and 82 for SEO: a missing favicon logged a
404, the page had no meta description, and `robots.txt` returned the app's HTML. All
three were fixed.

Reports: `artifacts/package-check.json`, `artifacts/perf-datagrid.json`,
`artifacts/lighthouse-*.json`, `artifacts/token-contrast.json`,
`artifacts/jest-results.json`, `artifacts/storybook-check.json`, `coverage/`.

## Failures and fixes (23 October 2026)

- Link accessibility lint error: fixed.
- Dark-theme contrast failure in the browser: background colors faded during a theme
  change while text changed immediately. The transition was removed.
- Calendar day buttons announced ordinals ("24th"); labels now include the displayed
  number and the full date.
- Combobox and DatePicker lost a controlled value when the owner rejected a change;
  the controlled value now stays authoritative (tests added).
- Single-file library build kept every component in a Button-only consumer (95
  calendar modules, 389 KB). Switched to per-module output; now 0 modules, 224 KB.
- Dashboard browser test clicked a button covered by other content; the helper now
  centers targets before clicking. A missing wait for the edit dialog was added.
- Workspace view switcher sat outside any landmark (axe `region`); it is now a
  labelled `<nav>`.
- Open DropdownMenu aria-hid focusable page content (axe `aria-hidden-focus`); the
  menu is now non-modal.
- Earlier environment blockers (Storybook ancestor-directory access, browser GPU
  launch crashes) did not recur in the owner's environment.
- `npm run test:storybook` (new) found the Skeleton "Profile loading" story using
  `aria-label` on an element without a role (axe `aria-prohibited-attr`), so the
  label was never announced. The example now uses a visually hidden status message.
- The DropdownMenu `label` prop had no effect: Radix labels the menu by its trigger,
  which overrides `aria-label`, so screen readers heard "Actions" instead of "Employee
  actions". Found by an interaction test; fixed, and the unit test that missed it
  (its label matched the trigger text) now fails without the fix.
- Two stories displayed a literal "?" where "·" and a download arrow had been lost to
  an encoding error; restored.
- Splitting the DataGrid result count into several text nodes shifted rendering by
  0.016px, which Chromatic flagged on six stories (build 3); it is one string again.
