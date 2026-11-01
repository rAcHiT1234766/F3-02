import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button, Input } from '@rachitp72/foundation-ui';

type Theme = 'light' | 'dark' | 'system';
export function Workbench() {
  const [theme, setTheme] = useState<Theme>('light');
  const [systemDark, setSystemDark] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [saved, setSaved] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(media.matches);
    const update = () => setSystemDark(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
  function submit(event: FormEvent) {
    event.preventDefault();
    const next = {
      name: name.trim() ? undefined : 'Enter your full name.',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? undefined : 'Enter a valid email address.',
    };
    setErrors(next);
    setSaved('');
    if (next.name) nameRef.current?.focus();
    else if (next.email) emailRef.current?.focus();
    else setSaved(`Profile for ${name.trim()} saved in this preview.`);
  }
  return (
    <div className="demo-shell" data-ui-theme={resolved}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar" aria-label="Workbench">
        <a className="brand" href="#overview">
          <span className="brand-mark" aria-hidden="true">
            f.
          </span>
          foundation<span className="version">UI / 0.1</span>
        </a>
        <p className="nav-caption">DESIGN SYSTEM</p>
        <nav aria-label="Sections">
          <a href="#overview">
            Overview <span>01</span>
          </a>
          <a href="#actions">
            Actions <span>02</span>
          </a>
          <a href="#forms">
            Forms <span>03</span>
          </a>
          <a href="#tokens">
            Design tokens <span>04</span>
          </a>
        </nav>
        <div className="sidebar-note">
          <span className="status-dot" /> Foundation milestone
          <p>A small, dependable starting point for consistent interfaces.</p>
        </div>
      </aside>
      <div className="demo-body">
        <header className="topbar">
          <span>
            Workspace <span aria-hidden="true">/</span> <strong>Component workbench</strong>
          </span>
          <label className="theme-label">
            Appearance
            <select value={theme} onChange={(event) => setTheme(event.target.value as Theme)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </label>
        </header>
        <main id="main">
          <section className="hero" id="overview">
            <span className="eyebrow">FOUNDATION UI · COMPONENT PLATFORM</span>
            <h1>
              Good interfaces
              <br />
              start with good foundations.
            </h1>
            <p>
              A shared language for your product. Thoughtful defaults, clear interactions, and room
              to make it your own.
            </p>
            <div className="hero-meta">
              <span>
                <span className="status-dot" /> Local development preview
              </span>
              <span>React + TypeScript</span>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div />
              <div />
              <div />
              <span>f.</span>
            </div>
          </section>
          <div className="metrics">
            <div>
              <span>IMPLEMENTED</span>
              <strong>
                44 <small>components in source</small>
              </strong>
            </div>
            <div>
              <span>APPEARANCE</span>
              <strong>Light + dark</strong>
            </div>
            <div>
              <span>PACKAGE</span>
              <strong>One CSS import</strong>
            </div>
          </div>
          <section id="actions" className="demo-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">01 / ACTIONS</span>
                <h2>Make the next step clear.</h2>
              </div>
              <span className="section-tag">Button</span>
            </div>
            <div className="panel">
              <div className="panel-head">
                <h3>Actions with purpose</h3>
                <p>Choose the emphasis that matches the action.</p>
              </div>
              <div className="button-examples">
                <div>
                  <Button onClick={() => setSaved('Primary action activated.')}>
                    Save changes <span aria-hidden="true">↗</span>
                  </Button>
                  <span>Primary</span>
                </div>
                <div>
                  <Button
                    variant="secondary"
                    onClick={() => setSaved('Secondary action activated.')}
                  >
                    View details
                  </Button>
                  <span>Secondary</span>
                </div>
                <div>
                  <Button
                    variant="danger"
                    onClick={() => setSaved('Danger action preview; no data was removed.')}
                  >
                    Archive record
                  </Button>
                  <span>Danger</span>
                </div>
              </div>
              <div className="state-row">
                <span>EVERY STATE CONSIDERED</span>
                <Button size="sm">Small</Button>
                <Button loading>Saving changes</Button>
                <Button disabled>Unavailable</Button>
              </div>
            </div>
          </section>
          <section id="forms" className="demo-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">02 / FORMS</span>
                <h2>A little clarity goes a long way.</h2>
              </div>
              <span className="section-tag">Input</span>
            </div>
            <div className="form-layout">
              <form className="panel profile-form" onSubmit={submit} noValidate>
                <h3>Your profile</h3>
                <p>Try submitting an empty form to see associated errors.</p>
                <div className="field">
                  <label htmlFor="full-name">
                    Full name <span>(required)</span>
                  </label>
                  <Input
                    id="full-name"
                    name="fullName"
                    autoComplete="name"
                    required
                    ref={nameRef}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    placeholder="Alex Morgan"
                  />
                  {errors.name && (
                    <p className="error" id="name-error">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="email">
                    Work email <span>(required)</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    ref={emailRef}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={['email-help', errors.email && 'email-error']
                      .filter(Boolean)
                      .join(' ')}
                    placeholder="alex@example.com"
                  />
                  <p id="email-help">Preview only. Your details are never sent anywhere.</p>
                  {errors.email && (
                    <p className="error" id="email-error">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="form-actions">
                  <Button type="submit">Save profile</Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setName('');
                      setEmail('');
                      setErrors({});
                      setSaved('');
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </form>
              <div className="form-note">
                <span className="note-icon" aria-hidden="true">
                  Aa
                </span>
                <h3>Familiar on purpose.</h3>
                <p>
                  Native controls keep the interactions people already know. Visible labels, helpful
                  messages, and a clear focus indicator do the rest.
                </p>
                <ul>
                  <li>Keyboard-friendly interactions</li>
                  <li>Controlled or uncontrolled values</li>
                  <li>Light and dark theme tokens</li>
                </ul>
                <code>
                  import {'{ Button, Input }'}
                  <br />
                  from '@rachitp72/foundation-ui'
                </code>
              </div>
            </div>
          </section>
          <p className="feedback" role="status">
            {saved}
          </p>
          <section id="tokens" className="demo-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">03 / DESIGN TOKENS</span>
                <h2>One language. Every surface.</h2>
              </div>
              <span className="section-tag">From Figma</span>
            </div>
            <div className="swatch-grid">
              {['action', 'surface', 'text', 'danger', 'focus'].map((token) => (
                <div className="swatch" key={token}>
                  <div style={{ background: `var(--fui-color-${token})` }} />
                  <span>{token}</span>
                  <code>--fui-color-{token}</code>
                </div>
              ))}
            </div>
            <p className="token-note">
              These tokens are code-authored. A genuine Figma export and design review are still
              pending.
            </p>
          </section>
          <footer>
            <span>foundation UI</span>
            <span>Foundation preview · Local state resets on refresh</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
