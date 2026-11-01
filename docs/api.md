# Public API and data contracts

## Button

Native `ButtonHTMLAttributes<HTMLButtonElement>` with a forwarded DOM ref.

| Prop       | Default        | Contract                                                         |
| ---------- | -------------- | ---------------------------------------------------------------- |
| `variant`  | `primary`      | `primary`, `secondary`, `danger`                                 |
| `size`     | `md`           | `sm`, `md`, `lg`                                                 |
| `loading`  | `false`        | Native disabled plus busy state; children retain accessible name |
| `type`     | `button`       | Explicit `submit` is needed for form submission                  |
| `disabled` | native default | Disables focus and activation                                    |
| `onClick`  | none           | Native React mouse event                                         |

Enter and Space activate enabled buttons. Text must identify the action.
Loading spinners are decorative and do not create duplicate live announcements.
The button does not own async work or automatically announce completion.

## Input

Native `InputHTMLAttributes<HTMLInputElement>` with a forwarded DOM ref.
`controlSize` defaults to `md` and accepts `sm`, `md`, `lg`. Native `size` still
controls the input's character-width hint; library CSS supplies full container width.
`type` defaults to text. Controlled `value/onChange` and uncontrolled `defaultValue`
follow React's native contracts. Do not switch between controlled/uncontrolled modes.

Provide a visible label using `htmlFor`/`id` or wrapping. Supply existing help/error
IDs in `aria-describedby` and set `aria-invalid` after validation. The component
preserves these attributes exactly. Placeholder is not a label.

## Current demo data

`name: string`, `email: string`, field error strings, and one feedback string.
Validation runs on submit, focuses the first invalid field, and retains user input.
Email validation is illustrative; no backend verifies or stores an address.

## Planned employee contract

```ts
type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'on-leave' | 'archived';
  startDate: string; // valid YYYY-MM-DD
};
```

All 44 inventory components are exported from `@rachitp72/foundation-ui`; their prop
types ship in `dist/**/*.d.ts` and each has Storybook examples. The employee
dashboard in `apps/demo` uses the `Employee` shape above with fictional data.
Contracts remain provisional until Figma reconciliation and manual review.
