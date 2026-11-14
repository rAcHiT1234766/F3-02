# Individual reflection

> Written with an AI assistant on 2 November 2026 from the project's records (commits, test
> results, review logs) and my answers to its questions about my own experience.

## 1. What I owned, implemented and reviewed

The code was mostly written by an AI coding assistant working under my direction. My part
was deciding what to build, and running and reviewing the checks that a tool cannot do on its
own.

- **Design tokens:** set up the Figma file with Tokens Studio and Variables, and exported
  the tokens the build uses (https://www.figma.com/design/SP7lRRZBFGGODBBi8uLCDk/I01).
- **Screen-reader review:** ran the NVDA 2026.3 review on the employee dashboard in Chrome
  myself (1 November 2026). All 18 of 18 checks passed ([manual review](manual-review.md)).
- **Visual review in Chromatic:**
  - Build 2: denied the 57 changes caused by the deliberate CSS regression.
  - Build 5: accepted 15 changes.
  - Build 6: accepted 8 changes (the new DataGrid story and the hidden checkbox labels).
- **Release:** created the npm account and published 0.1.0 and 0.2.0 with two-factor
  sign-in. Set up the GitHub repository and the Chromatic secret for CI.
- **Code review:** reviewed the code, and chose to fix DataGrid's two biggest gaps in 0.2.0:
  the app could not read the selection, and nothing was memoised.

## 2. A component API or behaviour decision

DataGrid selection in 0.2.0. In 0.1.0 the grid kept its selection to itself, so an app could
not act on the selected rows. 0.2.0 adds `selectedIds` and `onSelectionChange`, following
React's controlled-input pattern. Apps that don't pass the props keep working unchanged, so
it was a minor release with no migration. Selected ids are reported in data order, and rows
removed from the data are dropped from the selection.

I chose it because it was the top gap in the code review. It's the first thing a real app
would hit: you could tick rows in the grid but not do anything with them.

## 3. Code and behaviour from third-party libraries

- **Radix UI primitives:** accordion, alert dialog, dialog, dropdown menu, popover, tabs,
  toast and tooltip. Focus trapping, dismissal and much of the keyboard behaviour of these
  overlays come from Radix, not from this project.
- **react-day-picker:** the calendar grid in Calendar and DatePicker.
- **Style Dictionary:** turns the token JSON into CSS variables.
- **Tailwind CSS 4:** compiled inside the library with a `fui:` prefix.

The project's own work is the public APIs, styling and tokens, composition, and the
components built on native elements: Button, Input, Checkbox, Select, Table, DataGrid,
Combobox and others.

## 4. A real defect: evidence, hypothesis, fix, retest

**Evidence.** The first version of the 0.2.0 DataGrid memoisation was measured with the
project's performance harness (10,000 rows, median of 7 runs). Mount time went from 5.8 ms to
17.7 ms: the change meant to speed the grid up had made it slower to load.

**Hypothesis.** The new search index was being built when the grid first rendered, so every
mount paid for lowercasing every searchable value, even when nobody searched.

**Fix and retest.**

1. Built the index only once a search term exists. Mount dropped back to 4.6 ms, but the
   first keystroke cost 22.4 ms.
2. Joined each row's values first and lowercased the joined string once, with
   `toLowerCase()` instead of a locale-aware call. The first keystroke dropped to 4.9 ms.
3. Final numbers against 0.1.0: search 15.7 → 4.9 ms, refining a search 16.5 → 3.0 ms,
   selecting a row 5.6 → 1.8 ms.
4. A unit test now counts how many rows are read, so the regression can't come back
   unnoticed ([test results](test-results.md#datagrid-020-memoisation)).

**My role.** I asked for the speed-up. The assistant found the slower mount in its timings and
fixed it, and I checked the final numbers before releasing 0.2.0. It showed me that a change
meant to be faster has to be measured: without the timings, this one would have shipped
slower.

## 5. What the keyboard and screen-reader review changed

Each row checkbox in DataGrid has its label ("Select Employee 01") hidden visually but kept
for assistive technology. The visible text only repeated the name column, but a screen reader
still needs the label to say which row the checkbox belongs to. Chromatic build 6 showed this
change against the old baseline, and NVDA read the labels correctly.

Using NVDA was hard at first. It talks fast, and I had to learn the keys before the checklist
made sense, but it got easier once I knew them. The review covered only the dashboard
(15 of 44 components).

## 6. Where AI assisted, and how I verified it

An AI coding assistant wrote most of the code, tests, scripts and
documentation. I checked its output through:

- **Automated checks**, run locally and on GitHub Actions for every push: lint, type
  checks, 72 Jest tests at 97.4 % coverage, 13 Storybook interaction tests and axe scans
  of all 204 stories.
- **Human checks the AI could not do itself:** the NVDA review and every Chromatic visual
  review.
- **Measurements, not claims:** the before-and-after timings. These caught the slower
  mount described in section 4.
- **Installing the published package** from npm into a clean app and testing it there.

Next time I'd write more of the code myself, so I learn more from it, and use the assistant
mainly for review and tests.

## 7. What remains incomplete, and next priorities

- The screen-reader review covered the dashboard only, not all 44 components.
- Component visuals are not drawn in Figma; only the tokens are.
- The demo has no backend: its data lives in the browser and resets when the page reloads.
- The development tools have 35 open audit advisories (none in the published package).
- The API is not yet settled enough for a 1.0 release.

With another week, I'd start by drawing the components in Figma. At the moment the design
covers only the tokens, so the components can't be compared with a design. Once they're in
Figma, design and code would match fully.
