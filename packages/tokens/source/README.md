# Design tokens

Source of truth: the Figma file below, where the tokens
are stored with the Tokens Studio for Figma plugin and published as Figma Variables
(collections `primitives`, `light`, `dark`).

- Figma file: https://www.figma.com/design/SP7lRRZBFGGODBBi8uLCDk/I01 (view access for anyone with the link)
- Exporter: Tokens Studio for Figma 2.13.2, single-file export, all token sets
- Last export: 23 October 2026, kept unmodified at `../figma/tokens.json`
- Change made in Figma and verified in the app: `radius.md` 0.625rem → 0.75rem
  (cards in the dashboard render with 12px corners)

The original values were authored in code on 20 October 2026 and loaded into Figma
from `../figma/tokens-studio-import.json`. Every colour, spacing, radius and type
value now round-trips through Figma.

Schema: Style Dictionary `value`/`type`. `primitives.json` holds shared values;
light/dark semantic sets have identical keys. Generated CSS is not an authoring source.

## Updating tokens

1. Edit tokens in Figma with Tokens Studio, then export a single file with all sets.
2. Save it as `packages/tokens/figma/tokens.json`.
3. Run `npm run tokens:import`. It validates the export, prints each changed value
   and rewrites `source/*.json`.
4. Run `npm run check` (rebuilds CSS with Style Dictionary, runs contrast and tests).

To send code-side changes to Figma, run `npm run tokens:figma-export` and load
`figma/tokens-studio-import.json` with Tokens Studio's **Load from file**.
