import { useState } from 'react';
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Calendar,
  Card,
  Checkbox,
  Combobox,
  Drawer,
  DropdownMenu,
  Fieldset,
  FormField,
  Grid,
  Heading,
  IconButton,
  Input,
  Popover,
  Progress,
  RadioGroup,
  Select,
  Separator,
  Skeleton,
  Slider,
  Spinner,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
  Tooltip,
} from '@rachitp72/foundation-ui';
export function Gallery() {
  const [volume, setVolume] = useState(50);
  const [feedback, setFeedback] = useState('Explore the controls below.');
  return (
    <Stack gap={5}>
      <Heading level={1} size="lg">
        Component gallery
      </Heading>
      <Text tone="muted">Small examples of the building blocks behind this workspace.</Text>
      <Grid columns={2}>
        <Card header={<Heading level={2}>Forms & choices</Heading>}>
          <Stack>
            <FormField label="Notes" help="Resize the field vertically.">
              {(props) => <Textarea {...props} />}
            </FormField>
            <Fieldset legend="Preferences">
              <Checkbox label="Send weekly digest" />
              <Switch label="Desktop notifications" />
            </Fieldset>
            <RadioGroup
              legend="Work location"
              defaultValue="remote"
              options={[
                { value: 'remote', label: 'Remote' },
                { value: 'office', label: 'Office' },
              ]}
            />
            <Combobox
              label="Manager"
              options={[
                { id: 'alex', label: 'Alex Rivera' },
                { id: 'sam', label: 'Sam Chen' },
                { id: 'casey', label: 'Casey Patel', disabled: true },
              ]}
            />
            <Slider
              label="Notification volume"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              aria-valuetext={`${volume} percent`}
            />
            <FormField label="Priority">
              {(props) => (
                <Select {...props}>
                  <option>Normal</option>
                  <option>High</option>
                </Select>
              )}
            </FormField>
          </Stack>
        </Card>
        <Card header={<Heading level={2}>Feedback & progress</Heading>}>
          <Stack>
            <Alert tone="success" title="Ready to go">
              Everything is saved for this session.
            </Alert>
            <Stack direction="row">
              <Badge>Neutral</Badge>
              <Badge tone="success">Active</Badge>
              <Badge tone="warning">On leave</Badge>
              <Badge tone="danger">Needs attention</Badge>
            </Stack>
            <Progress label="Import progress" value={65} />
            <Spinner label="Loading preview" />
            <Skeleton height="3rem" />
            <Separator />
            <Text>Loading shapes are decorative; the status announces progress.</Text>
          </Stack>
        </Card>
        <Card header={<Heading level={2}>Overlays & actions</Heading>}>
          <Stack>
            <Text>{feedback}</Text>
            <Stack direction="row">
              <Drawer title="Details" trigger={<Button variant="secondary">Open drawer</Button>}>
                <Text>Content stays readable on a narrow screen.</Text>
                <Input aria-label="Drawer note" />
              </Drawer>
              <Popover
                title="Quick settings"
                trigger={<Button variant="secondary">Open popover</Button>}
              >
                <Checkbox label="Show archived records" />
              </Popover>
              <DropdownMenu
                label="Preview actions"
                trigger={<Button variant="secondary">Actions</Button>}
                items={[
                  {
                    id: 'copy',
                    label: 'Copy example',
                    onSelect: () => setFeedback('Example action selected.'),
                  },
                  { id: 'separator', separator: true },
                  {
                    id: 'disabled',
                    label: 'Unavailable',
                    disabled: true,
                    onSelect: () => undefined,
                  },
                ]}
              />
              <Tooltip content="More information about this example">
                <IconButton label="Information" variant="secondary">
                  i
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Card>
        <Card header={<Heading level={2}>Calendar</Heading>}>
          <Calendar defaultMonth="2026-10-01" defaultValue="2026-10-23" />
        </Card>
      </Grid>
      <Tabs
        label="Documentation examples"
        items={[
          {
            value: 'usage',
            label: 'Usage',
            content: <Text>Import the component and its stylesheet from the UI package.</Text>,
          },
          {
            value: 'behavior',
            label: 'Keyboard',
            content: <Text>Use arrow keys between tabs. Enter or Space toggles disclosures.</Text>,
          },
        ]}
      />
      <Accordion
        items={[
          {
            value: 'storage',
            title: 'Where is the data stored?',
            content: <Text>In local React state. Refreshing restores the fictional fixture.</Text>,
          },
          {
            value: 'themes',
            title: 'Do popups follow the theme?',
            content: (
              <Text>
                Portaled content follows its nearest explicit light or dark boundary, including
                changes while it is open.
              </Text>
            ),
          },
        ]}
      />
    </Stack>
  );
}
