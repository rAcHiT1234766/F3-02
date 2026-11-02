# Releases

Package: [`@rachitp72/foundation-ui`](https://www.npmjs.com/package/@rachitp72/foundation-ui)
on npm, MIT licence. Versions follow semantic versioning. Before 1.0, a new feature or a
breaking change increases the minor version (0.x.0) and a compatible bug fix increases the
patch version (0.x.y). Every release is listed here with what changed and what apps must do.

## 0.2.0 (1 November 2026)

**Added**

- DataGrid controlled selection: `selectedIds` and `onSelectionChange` let the app read and
  set the selected rows, for example to run a bulk action. `defaultSelectedIds` sets the first
  selection when the grid manages it. `onSelectionChange` reports every selected id in `data`
  order, including rows on other pages or hidden by the search.
- Storybook story "Bulk action on selected rows" with an interaction test.

**Changed**

- DataGrid memoises row ids, the search index and the sorted order. Ticking a checkbox,
  changing page and typing a search no longer re-read every row. See the before-and-after
  timings in [test results](test-results.md#datagrid-020-memoisation).
- DataGrid adds 3.0 KB of gzipped JavaScript to an app, up from 2.8 KB (budget 5 KB).
- Package page: links to the GitHub repository and issue tracker, and the current README.

**Migration:** none. Existing props and behaviour are unchanged. To get the full benefit, pass
the same `columns` array between renders.

## 0.1.0 (1 November 2026)

First public release: 44 components, light and dark themes from design tokens, one compiled
stylesheet, TypeScript types, ES modules with one file per component.

## How a release is made

1. Set the version: `npm version <x.y.z> -w @rachitp72/foundation-ui --no-git-tag-version`,
   and add an entry above.
2. Run `npm run check`, `npm run test:coverage`, `npm run build:storybook`,
   `npm run test:storybook`, `npm run test:browser` and `npm run pack:check`. GitHub Actions
   (`checks.yml`) runs the same checks on every push.
3. Run Chromatic (`chromatic.yml`, started by hand; the token is the repository secret
   `CHROMATIC_PROJECT_TOKEN`) and review every visual change in the Chromatic web app. The run
   is marked failed while changes are waiting for review, and a passing upload is not an approval.
4. `npm publish -w @rachitp72/foundation-ui --dry-run` and compare the file list. Then publish
   from an interactive terminal, because the npm account uses two-factor authentication.
5. Install the published version into a clean app and repeat the consumer browser check.
6. Tag the commit `v<x.y.z>` and push the tag.
