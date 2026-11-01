# Decisions

Recorded 21 October 2026. These decisions describe the intended implementation,
not evidence that a build or external requirement has passed.

| Decision                                                                    | Reason                                                                            | Alternative considered                                                   | Consequence                                                                                         |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| npm workspaces, one root lockfile                                           | Small monorepo with ordinary npm commands                                         | Task orchestrator                                                        | No extra build orchestration; build dependencies explicitly                                         |
| Publish as `@rachitp72/foundation-ui` under the MIT licence (1 Nov 2026)    | Owner's npm scope; a descriptive name; permissive licence for a portfolio project | Keeping the `@foundation-local/ui` working name (scope not owned on npm) | Private `tokens` and `demo` workspaces keep the `@foundation-local` scope; they are never published |
| Node 24 LTS target                                                          | Supported runtime for current tools                                               | Existing EOL Node 23.1.0                                                 | Owner must install/use LTS; current-runtime tests do not prove LTS compatibility                    |
| React 19, strict TypeScript 5.9                                             | Explicit contracts and forwardRef support                                         | Custom polymorphic abstraction                                           | Simple native element APIs                                                                          |
| Vite 6.4.3 and React plugin 4.7.0                                           | Compatible known cached toolchain                                                 | Latest Vite major                                                        | Deliberately older major; review maintenance/security status before release                         |
| Tailwind 4, namespaced components, no Preflight                             | Compile styles without resetting a consumer page                                  | Consumer-side Tailwind scanning                                          | One CSS import includes all library styles                                                          |
| Style Dictionary 5 and legacy value/type schema                             | Straightforward CSS transforms and validation                                     | Mixed exporter-specific formats                                          | Normalize genuine Figma export before using it                                                      |
| Native controls first, Radix for demanding interaction, DayPicker for dates | Preserve browser behavior; avoid implementing focus systems prematurely           | Fully custom behavior                                                    | Supporting-library permission is assumed; attribute dependency work honestly                        |
| Jest 29.7 and Babel transform                                               | Required test stack with cached matching versions                                 | Replacing it with Vitest                                                 | Separate TypeScript command is mandatory                                                            |
| Native disabled loading buttons                                             | Prevent duplicate activation consistently                                         | Focusable aria-disabled buttons                                          | Loading button leaves tab order; forms handle focus after async work                                |
| Explicit theme attributes                                                   | Simple nested theme boundary                                                      | Global dark class                                                        | Future portals must receive the correct boundary explicitly                                         |
| FormField render function (planned)                                         | Preserve explicit control ID/description associations                             | Cloning arbitrary children                                               | Consumer spreads supplied attributes onto its control                                               |
| DataGrid native table semantics (planned)                                   | Sorting/search/paging without spreadsheet promises                                | ARIA grid                                                                | Stable IDs, filter-sort-page order, visible-page selection                                          |
| Date-only YYYY-MM-DD or null (planned)                                      | Avoid timezone shifts                                                             | UTC timestamps                                                           | Validate real calendar dates and test multiple timezones                                            |
| UNLICENSED and no external publication                                      | Ownership/access unresolved                                                       | Assuming public MIT ownership                                            | Publication remains blocked until actual owner decision                                             |

Official references checked during setup:
[Vite 6](https://v6.vite.dev/guide/),
[Storybook install](https://storybook.js.org/docs/get-started/install),
[Tailwind without Preflight](https://tailwindcss.com/docs/preflight),
[Style Dictionary 5](https://styledictionary.com/versions/v5/migration/),
[Jest setup](https://jestjs.io/docs/getting-started),
[Node release lifecycle](https://nodejs.org/en/about/previous-releases).

Dependency ranges in manifests are a setup proposal. A successful registry-backed
install and lockfile are still required to establish the exact compatible set.
Do not equate a web documentation check with a successful package installation.
