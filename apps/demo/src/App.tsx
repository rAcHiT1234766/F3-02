import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  Alert,
  AlertDialog,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Container,
  DataGrid,
  DatePicker,
  FormField,
  Grid,
  Heading,
  Input,
  Link,
  Modal,
  Select,
  Stack,
  Text,
  ToastProvider,
  useToast,
  type GridColumn,
} from '@rachitp72/foundation-ui';
import { createEmployees, departments, type Employee } from './employees';
import { Workbench } from './Workbench';
import { Gallery } from './Gallery';
import './dashboard.css';

type Theme = 'light' | 'dark' | 'system';
type Errors = { name?: string; email?: string; startDate?: string };
export function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [systemDark, setSystemDark] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemDark(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  if (new URLSearchParams(window.location.search).get('view') === 'foundation')
    return <Workbench />;
  const resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
  return (
    <div className="employee-app" data-ui-theme={resolved}>
      <ToastProvider>
        <Dashboard theme={theme} onThemeChange={setTheme} />
      </ToastProvider>
    </div>
  );
}

function Appearance({
  theme,
  onChange,
  id,
}: {
  theme: Theme;
  onChange: (value: Theme) => void;
  id: string;
}) {
  return (
    <div className="appearance">
      <label htmlFor={id}>Appearance</label>
      <Select id={id} value={theme} onChange={(event) => onChange(event.target.value as Theme)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </Select>
    </div>
  );
}

function Dashboard({
  theme,
  onThemeChange,
}: {
  theme: Theme;
  onThemeChange: (value: Theme) => void;
}) {
  const [employees, setEmployees] = useState(() =>
    createEmployees(
      Number(new URLSearchParams(window.location.search).get('rows')) === 1000
        ? 1000
        : Number(new URLSearchParams(window.location.search).get('rows')) === 100
          ? 100
          : 50,
    ),
  );
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [view, setView] = useState<'people' | 'gallery'>('people');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formDepartment, setFormDepartment] = useState(departments[0]!);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const nextId = useRef(employees.length + 1);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const { notify } = useToast();

  function edit(employee: Employee | null, trigger: HTMLElement) {
    returnFocusRef.current = trigger;
    setEditing(employee);
    setName(employee?.name ?? '');
    setEmail(employee?.email ?? '');
    setFormDepartment(employee?.department ?? departments[0]!);
    setStartDate(employee?.startDate ?? null);
    setErrors({});
    setOpen(true);
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const rawDate = String(new FormData(event.currentTarget).get('startDate') ?? '');
    const next: Errors = {
      name: name.trim() ? undefined : 'Enter a full name.',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ? undefined
        : 'Enter a valid email address.',
      startDate: rawDate && rawDate === startDate ? undefined : 'Choose a valid start date.',
    };
    setErrors(next);
    if (next.name) {
      nameRef.current?.focus();
      return;
    }
    if (next.email) {
      emailRef.current?.focus();
      return;
    }
    if (next.startDate) {
      dateRef.current?.focus();
      return;
    }
    const employee: Employee = {
      id: editing?.id ?? `employee-${nextId.current++}`,
      name: name.trim(),
      email: email.trim(),
      department: formDepartment,
      status: editing?.status ?? 'active',
      startDate: startDate!,
    };
    setEmployees((previous) =>
      editing
        ? previous.map((row) => (row.id === employee.id ? employee : row))
        : [employee, ...previous],
    );
    setDepartment('all');
    setStatus('all');
    setOpen(false);
    notify({
      title: editing ? 'Employee updated' : 'Employee added',
      message: `${employee.name} was saved in this session.`,
      tone: 'success',
    });
  }
  function archive(employee: Employee) {
    setEmployees((previous) =>
      previous.map((row) => (row.id === employee.id ? { ...row, status: 'archived' } : row)),
    );
    notify({
      message: `${employee.name} was archived.`,
      tone: 'neutral',
      action: {
        label: 'Undo',
        altText: 'Restore this employee to their previous status',
        onClick: () =>
          setEmployees((previous) =>
            previous.map((row) =>
              row.id === employee.id ? { ...row, status: employee.status } : row,
            ),
          ),
      },
    });
  }
  const columns: GridColumn<Employee>[] = [
    {
      id: 'name',
      header: 'Employee',
      value: (row) => row.name,
      sortable: true,
      render: (row) => (
        <div className="employee-person">
          <Avatar name={row.name} size="sm" decorative />
          <div>
            <strong>{row.name}</strong>
            <Text size="sm" tone="muted">
              {row.email}
            </Text>
          </div>
        </div>
      ),
    },
    { id: 'department', header: 'Department', value: (row) => row.department, sortable: true },
    {
      id: 'status',
      header: 'Status',
      value: (row) => row.status,
      render: (row) => (
        <Badge
          tone={
            row.status === 'active' ? 'success' : row.status === 'on-leave' ? 'warning' : 'neutral'
          }
        >
          {row.status === 'on-leave' ? 'On leave' : row.status === 'active' ? 'Active' : 'Archived'}
        </Badge>
      ),
    },
    { id: 'date', header: 'Start date', value: (row) => row.startDate, sortable: true },
    {
      id: 'actions',
      header: 'Actions',
      value: () => null,
      searchable: false,
      render: (row) => (
        <div className="employee-actions">
          <Button
            size="sm"
            variant="secondary"
            aria-label={`Edit ${row.name}`}
            onClick={(event) => edit(row, event.currentTarget)}
          >
            Edit
          </Button>
          <AlertDialog
            title={`Archive ${row.name}?`}
            description="Their status will change to Archived in this local session. You can undo this action from the notification."
            trigger={
              <Button
                size="sm"
                variant="secondary"
                disabled={row.status === 'archived'}
                aria-label={`Archive ${row.name}`}
              >
                Archive
              </Button>
            }
            confirmLabel="Archive employee"
            onConfirm={() => archive(row)}
          />
        </div>
      ),
    },
  ];
  const filtered = employees.filter(
    (row) =>
      (department === 'all' || row.department === department) &&
      (status === 'all' || row.status === status),
  );
  return (
    <>
      <a className="skip-link" href="#employee-main">
        Skip to content
      </a>
      <header className="employee-header">
        <a className="employee-brand" href="./">
          <span aria-hidden="true">f.</span> foundation <small>WORKSPACE</small>
        </a>
        <Appearance id="appearance" theme={theme} onChange={onThemeChange} />
      </header>
      <Container>
        <nav className="employee-tabs" aria-label="Workspace views">
          <Button
            variant={view === 'people' ? 'primary' : 'secondary'}
            aria-pressed={view === 'people'}
            onClick={() => setView('people')}
          >
            People
          </Button>
          <Button
            variant={view === 'gallery' ? 'primary' : 'secondary'}
            aria-pressed={view === 'gallery'}
            onClick={() => setView('gallery')}
          >
            Component gallery
          </Button>
          <Link href="?view=foundation">Foundation preview</Link>
        </nav>
        <main id="employee-main">
          {view === 'gallery' ? (
            <Gallery />
          ) : (
            <>
              <Breadcrumbs items={[{ label: 'Workspace', href: './' }, { label: 'People' }]} />
              <div className="employee-title">
                <div>
                  <Text size="sm" tone="muted">
                    YOUR ORGANIZATION, AT A GLANCE
                  </Text>
                  <Heading level={1} size="lg">
                    People & possibilities.
                  </Heading>
                  <Text tone="muted">A shared place for the people who make things happen.</Text>
                </div>
                <Modal
                  title={editing ? 'Edit employee' : 'Add employee'}
                  description="Fictional demo data. Changes reset when you refresh."
                  open={open}
                  onOpenChange={setOpen}
                  initialFocusRef={nameRef}
                  returnFocusRef={returnFocusRef}
                  trigger={
                    <Button id="add-employee" onClick={(event) => edit(null, event.currentTarget)}>
                      + Add employee
                    </Button>
                  }
                >
                  <form onSubmit={save} noValidate className="employee-form">
                    <FormField id="employee-name" label="Full name" error={errors.name} required>
                      {(props) => (
                        <Input
                          {...props}
                          name="name"
                          ref={nameRef}
                          autoComplete="name"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                        />
                      )}
                    </FormField>
                    <FormField
                      id="employee-email"
                      label="Work email"
                      help="Use an example.com address for fictional records."
                      error={errors.email}
                      required
                    >
                      {(props) => (
                        <Input
                          {...props}
                          type="email"
                          name="email"
                          ref={emailRef}
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                        />
                      )}
                    </FormField>
                    <FormField id="employee-department" label="Department">
                      {(props) => (
                        <Select
                          {...props}
                          value={formDepartment}
                          onChange={(event) => setFormDepartment(event.target.value)}
                        >
                          {departments.map((name) => (
                            <option key={name}>{name}</option>
                          ))}
                        </Select>
                      )}
                    </FormField>
                    <DatePicker
                      id="employee-date"
                      label="Start date"
                      name="startDate"
                      ref={dateRef}
                      value={startDate}
                      onValueChange={setStartDate}
                      defaultMonth="2026-10-01"
                      min="2020-01-01"
                      max="2030-12-31"
                      required
                      aria-invalid={!!errors.startDate}
                      aria-describedby={errors.startDate ? 'employee-date-error' : undefined}
                    />
                    {errors.startDate && (
                      <p className="fui-error" id="employee-date-error">
                        {errors.startDate}
                      </p>
                    )}
                    <Appearance id="dialog-appearance" theme={theme} onChange={onThemeChange} />
                    <div className="fui-dialog-footer">
                      <Button variant="secondary" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save employee</Button>
                    </div>
                  </form>
                </Modal>
              </div>
              <Grid columns={3} gap={4}>
                <Card>
                  <Text size="sm" tone="muted">
                    TOTAL PEOPLE
                  </Text>
                  <p className="employee-metric">{employees.length}</p>
                  <Text size="sm">Across {departments.length} departments</Text>
                </Card>
                <Card>
                  <Text size="sm" tone="muted">
                    ACTIVE
                  </Text>
                  <p className="employee-metric">
                    {employees.filter((row) => row.status === 'active').length}
                  </p>
                  <Text size="sm">Making things happen</Text>
                </Card>
                <Card>
                  <Text size="sm" tone="muted">
                    ON LEAVE
                  </Text>
                  <p className="employee-metric">
                    {employees.filter((row) => row.status === 'on-leave').length}
                  </p>
                  <Text size="sm">Taking time to recharge</Text>
                </Card>
              </Grid>
              <section className="employee-directory" aria-label="Employee directory">
                <Stack direction="row" align="end" justify="between">
                  <div>
                    <Heading level={2}>Your team</Heading>
                    <Text tone="muted" size="sm">
                      Find a colleague, update details, or welcome someone new.
                    </Text>
                  </div>
                  <div className="employee-filters">
                    <FormField id="department-filter" label="Department">
                      {(props) => (
                        <Select
                          {...props}
                          value={department}
                          onChange={(event) => setDepartment(event.target.value)}
                        >
                          <option value="all">All departments</option>
                          {departments.map((name) => (
                            <option key={name}>{name}</option>
                          ))}
                        </Select>
                      )}
                    </FormField>
                    <FormField id="status-filter" label="Status">
                      {(props) => (
                        <Select
                          {...props}
                          value={status}
                          onChange={(event) => setStatus(event.target.value)}
                        >
                          <option value="all">All statuses</option>
                          <option value="active">Active</option>
                          <option value="on-leave">On leave</option>
                          <option value="archived">Archived</option>
                        </Select>
                      )}
                    </FormField>
                  </div>
                </Stack>
                <DataGrid
                  data={filtered}
                  columns={columns}
                  getRowId={(row) => row.id}
                  getRowLabel={(row) => row.name}
                  caption="Employee directory"
                  searchLabel="Search employees"
                />
              </section>
              <Alert title="A place to explore">
                These are fictional records. Your changes stay in this browser session and reset on
                refresh.
              </Alert>
            </>
          )}
        </main>
        <footer className="employee-footer">
          <Text size="sm">foundation UI · 44 components</Text>
          <Text size="sm" tone="muted">
            Local demo · Design tokens from Figma
          </Text>
        </footer>
      </Container>
    </>
  );
}
