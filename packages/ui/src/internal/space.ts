export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export function spaceValue(space: Space) {
  return space === 0 ? '0' : `var(--fui-space-${space})`;
}
