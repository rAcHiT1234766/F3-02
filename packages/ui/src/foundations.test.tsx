import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Avatar } from './components/Avatar/Avatar';
import { IconButton } from './components/IconButton/IconButton';
import { Link } from './components/Link/Link';
import { Heading } from './components/Heading/Heading';
import { Text } from './components/Text/Text';
import { Badge } from './components/Badge/Badge';
import { Separator } from './components/Separator/Separator';
import { Spinner } from './components/Spinner/Spinner';
import { Progress } from './components/Progress/Progress';
import { Skeleton } from './components/Skeleton/Skeleton';
import { VisuallyHidden } from './components/VisuallyHidden/VisuallyHidden';
import { Box } from './components/Box/Box';
import { Container } from './components/Container/Container';
import { Grid } from './components/Grid/Grid';
import { Stack } from './components/Stack/Stack';
import { Card } from './components/Card/Card';
import { Breadcrumbs } from './components/Breadcrumbs/Breadcrumbs';
import { Alert } from './components/Alert/Alert';

test('avatar has an accessible name, recovers from image failure and resets for a new source', () => {
  const { container, rerender } = render(<Avatar name="Alex Morgan" src="first.png" />);
  expect(screen.getByRole('img', { name: 'Alex Morgan' })).toBeInTheDocument();
  fireEvent.error(container.querySelector('img')!);
  expect(screen.getByText('AM')).toBeInTheDocument();
  rerender(<Avatar name="Alex Morgan" src="second.png" />);
  expect(container.querySelector('img')).toHaveAttribute('src', 'second.png');
  rerender(<Avatar name="Lee" />);
  expect(screen.getByText('L')).toBeInTheDocument();
  rerender(<Avatar name="" />);
  expect(screen.getByRole('img', { name: 'Unknown person' })).toHaveTextContent('?');
  rerender(<Avatar name="Alex Morgan" decorative fallback="A" />);
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});
test('icon-only actions retain a name while loading and links preserve safe native semantics', async () => {
  const click = jest.fn();
  const ref = createRef<HTMLButtonElement>();
  const { rerender } = render(
    <IconButton label="Delete" ref={ref} onClick={click}>
      ×
    </IconButton>,
  );
  ref.current?.focus();
  await userEvent.keyboard('{Enter}');
  expect(click).toHaveBeenCalledTimes(1);
  rerender(
    <IconButton label="Delete" loading onClick={click}>
      ×
    </IconButton>,
  );
  expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
  rerender(
    <>
      <Link href="https://example.com" target="_blank" rel="author">
        Reference
      </Link>
      <Link href="#details">Details</Link>
    </>,
  );
  expect(screen.getByRole('link', { name: 'Reference' })).toHaveAttribute(
    'rel',
    'author noopener noreferrer',
  );
  expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute('href', '#details');
});
test('layout composition preserves heading levels, content order and noninteractive cards', () => {
  render(
    <Container>
      <Box padding={4}>
        <Stack>
          <Heading level={1} size="sm">
            Employees
          </Heading>
          <Text>Team directory</Text>
          <Grid columns={2}>
            <Card
              header={<Heading level={2}>Profile</Heading>}
              footer={<Link href="#edit">Edit profile</Link>}
            >
              <Stack direction="row" align="center" justify="between" wrap={false}>
                <Badge tone="success">Active</Badge>
                <Text as="small" tone="muted">
                  Engineering
                </Text>
              </Stack>
            </Card>
            <Card>
              <Text>Second card</Text>
            </Card>
          </Grid>
        </Stack>
      </Box>
    </Container>,
  );
  expect(screen.getByRole('heading', { level: 1, name: 'Employees' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: 'Profile' })).toBeInTheDocument();
  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
test('loading and decorative elements avoid duplicate announcements', () => {
  render(
    <>
      <Spinner />
      <Spinner label="Loading employees" />
      <Skeleton />
      <Separator />
      <Separator decorative orientation="vertical" />
      <button>
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden="true">×</span>
      </button>
    </>,
  );
  expect(screen.getAllByRole('status')).toHaveLength(1);
  expect(screen.getByRole('status')).toHaveTextContent('Loading employees');
  expect(screen.getAllByRole('separator')).toHaveLength(1);
  expect(screen.getByRole('button')).toHaveAccessibleName('Close');
});
test('progress exposes valid bounds and omits value for indeterminate state', () => {
  const { rerender } = render(<Progress label="Upload" value={200} max={100} />);
  expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveAttribute('value', '100');
  rerender(<Progress label="Upload" value={-5} max={0} />);
  expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0');
  expect(screen.getByRole('progressbar')).toHaveAttribute('max', '100');
  rerender(<Progress label="Upload" />);
  expect(screen.getByRole('progressbar')).not.toHaveAttribute('value');
});
test('breadcrumbs identify current location and alerts only announce on request', () => {
  const { rerender } = render(
    <>
      <Breadcrumbs
        items={[{ label: 'Home', href: '#home' }, { label: 'Workspace' }, { label: 'People' }]}
      />
      <Alert title="Preview">Local data</Alert>
    </>,
  );
  expect(screen.getByText('People')).toHaveAttribute('aria-current', 'page');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  rerender(
    <Alert announce="polite" tone="success">
      Saved
    </Alert>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Saved');
  rerender(
    <Alert announce="assertive" tone="danger">
      Failed
    </Alert>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Failed');
});
