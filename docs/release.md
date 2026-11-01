# Release checklist

Publication is not authorized by the handover. No upload or release has occurred.

- [ ] Establish Node 24 and a successful install; record exact versions in lockfile.
- [ ] Complete the Button/Input workflow including a real Storybook build.
- [ ] Complete all 44 inventory rows and required behavior.
- [ ] Reconcile genuine Figma foundations/export and source provenance.
- [ ] Run lint, types, Jest coverage, tokens, UI/demo/Storybook production builds.
- [ ] Run independent archive type/build/browser checks including a complex widget.
- [ ] Complete real keyboard, contrast and screen-reader review.
- [ ] Run and review actual Chromatic baselines and changes.
- [ ] Measure minimal Button, DataGrid and demo bundles, plus table interactions.
- [ ] Resolve owner scope, package availability, repository URL and license.
- [ ] Obtain destination-specific publication/deployment authorization.
- [ ] Publish the exact tested candidate; install the published package independently.
- [ ] Verify reviewer access to actual demo/docs/Figma/repository/submission links.

Initial proposed release: 0.1.0. Before 1.0, breaking API changes increment minor;
compatible bug fixes increment patch. Document each change and migration.

CI is prepared but unexecuted. It requires a real GitHub repository and committed
lockfile. Chromatic is a separate manually triggered workflow; its token comes
from a GitHub secret. Missing credentials fail clearly. No automatic baseline
acceptance is configured. Require reviewed visual checks in branch protection
once the project exists; CLI success alone is not visual approval.

The independent consumer helper retains its temporary directory for inspection.
It installs the actual archive, has no Tailwind config or workspace source aliases,
and records actual file sizes. Browser interaction is a separate recorded check.
