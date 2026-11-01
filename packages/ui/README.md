# @rachitp72/foundation-ui

Accessible, token-driven React components: 44 components with light and dark themes
generated from Figma design tokens. Ships compiled CSS and one ES module per component,
so you need no Tailwind setup and only bundle what you import.

**[Documentation and live examples (Storybook)](https://main--6adb1ea72d119416b1620b45.chromatic.com/)**

## Install

```sh
npm install @rachitp72/foundation-ui
```

Peer dependencies: `react` and `react-dom` 19.2 or later (major version 19). ES modules only.

## Usage

Import the components you need and the stylesheet once, then set a theme on a container.

```tsx
import { Button, DatePicker, FormField, Input } from '@rachitp72/foundation-ui';
import '@rachitp72/foundation-ui/styles.css';

export function NewStarter() {
  return (
    <form data-ui-theme="light">
      <FormField id="name" label="Full name" help="As it appears on payroll." required>
        {(props) => <Input {...props} name="name" autoComplete="name" />}
      </FormField>
      <DatePicker id="start" label="Start date" min="2026-01-01" />
      <Button type="submit">Save</Button>
    </form>
  );
}
```

## Components

| Group          | Components                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| Basics         | Button, IconButton, Link, Text, Heading, Badge, Avatar, Separator, Spinner, Skeleton, Progress, VisuallyHidden |
| Layout         | Box, Stack, Grid, Container, Card                                                                              |
| Forms          | Input, Textarea, Checkbox, RadioGroup, Switch, Select, FormField, Fieldset, SearchInput, Slider                |
| Navigation     | Tabs, Accordion, Breadcrumbs, Pagination, DropdownMenu                                                         |
| Overlays       | Modal, AlertDialog, Drawer, Tooltip, Popover, Toast (`ToastProvider` / `useToast`), Alert                      |
| Data and dates | Table, DataGrid (sort, search, paging, row selection), Calendar, DatePicker, Combobox                          |

Props, examples and usage guidance for each component are in the
[Storybook documentation](https://main--6adb1ea72d119416b1620b45.chromatic.com/).

## Theming

Set `data-ui-theme="light"` or `"dark"` on any container; themes can be nested. Dialogs,
menus and other overlays follow the theme of the element that opened them. Every colour
is a semantic CSS variable (such as `--fui-color-action`), so you can override tokens on
your own container. Styles use a `fui:` prefix and include no global reset, so your
app's own styles are left alone.

## Accessibility

The components target WCAG 2.2 AA: labelled fields, announced errors, focus trapping and
restoring in dialogs, and keyboard-operable menus, tabs, calendar and combobox. axe runs
on every Storybook story and in browser tests in both themes, and a manual review with the
NVDA screen reader passed all 18 of its checks. Neither is a WCAG certification.

## Versioning

Follows semantic versioning. Before 1.0, breaking changes increase the minor version and
compatible fixes increase the patch version.

## Licence

MIT
