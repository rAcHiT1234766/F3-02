// Documentation blocks for the Storybook foundation pages. Every value shown is read
// from the generated token CSS at runtime, so these pages always match the Figma export.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
const THEMES: Theme[] = ['light', 'dark'];
const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
export const colorVar = (name: string) => `--fui-color-${kebab(name)}`;

/** Style Dictionary shortens colours such as #ffffff to #fff; expand them for display and maths. */
const expandHex = (value: string) =>
  /^#[0-9a-f]{3}$/i.test(value) ? `#${[...value.slice(1)].map((c) => c + c).join('')}` : value;

/** Reads custom properties from a themed container after it renders. */
function useTokenValues(names: string[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const key = names.join(',');
  useEffect(() => {
    if (!ref.current) return;
    const style = getComputedStyle(ref.current);
    setValues(
      Object.fromEntries(
        key.split(',').map((name) => [name, expandHex(style.getPropertyValue(name).trim())]),
      ),
    );
  }, [key]);
  return [ref, values] as const;
}

function luminance(hex: string) {
  const channels = (hex.replace('#', '').match(/../g) ?? []).map((part) => {
    const value = parseInt(part, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels.length === 3
    ? channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722
    : NaN;
}
export function contrastRatio(foreground: string, background: string) {
  const [a, b] = [luminance(foreground), luminance(background)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const panel = (theme: Theme): CSSProperties => ({
  background: 'var(--fui-color-background)',
  color: 'var(--fui-color-text)',
  fontFamily: 'var(--fui-font-body)',
  border: '1px solid var(--fui-color-border-subtle)',
  borderRadius: 'var(--fui-radius-md)',
  padding: 16,
  colorScheme: theme,
});
const caption: CSSProperties = { fontSize: 12, color: 'var(--fui-color-text-muted)', margin: 0 };
const code: CSSProperties = { fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 12 };

/** Renders the same content in a light and a dark themed column. */
export function ThemeColumns({ children }: { children: (theme: Theme) => ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
        margin: '16px 0 32px',
      }}
    >
      {THEMES.map((theme) => (
        <section
          key={theme}
          data-ui-theme={theme}
          style={panel(theme)}
          aria-label={`${theme} theme`}
        >
          <p style={{ ...caption, fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }}>
            {theme}
          </p>
          {children(theme)}
        </section>
      ))}
    </div>
  );
}

function SwatchGrid({ names }: { names: string[] }) {
  const [ref, values] = useTokenValues(names.map(colorVar));
  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 12,
      }}
    >
      {names.map((name) => (
        <div key={name}>
          <div
            style={{
              height: 56,
              borderRadius: 'var(--fui-radius-sm)',
              background: `var(${colorVar(name)})`,
              border: '1px solid var(--fui-color-border-subtle)',
            }}
          />
          <p
            style={{
              margin: '6px 0 0',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--fui-color-text)',
            }}
          >
            {name}
          </p>
          <p style={{ ...caption, ...code }}>{values[colorVar(name)] ?? ''}</p>
        </div>
      ))}
    </div>
  );
}

/** Semantic colour swatches with their resolved values, in both themes. */
export function ColorSwatches({ names }: { names: string[] }) {
  return <ThemeColumns>{() => <SwatchGrid names={names} />}</ThemeColumns>;
}

/** Primitive palette swatches (theme independent). */
export function PaletteSwatches({ names }: { names: string[] }) {
  const vars = names.map((name) => `--fui-palette-${name}`);
  const [ref, values] = useTokenValues(vars);
  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, margin: '16px 0 32px' }}>
      {names.map((name, index) => (
        <div key={name} style={{ width: 120 }}>
          <div
            style={{
              height: 72,
              borderRadius: 8,
              background: `var(${vars[index]})`,
              border: '1px solid #d0d7d5',
            }}
          />
          <p style={{ margin: '6px 0 0', fontSize: 13, fontWeight: 600 }}>palette.{name}</p>
          <p style={{ margin: 0, fontSize: 12, color: '#51636b', ...code }}>
            {values[vars[index]!] ?? ''}
          </p>
        </div>
      ))}
    </div>
  );
}

export type ContrastPair = [foreground: string, background: string, target: number];

function ContrastList({ pairs }: { pairs: ContrastPair[] }) {
  const [ref, values] = useTokenValues([
    ...new Set(pairs.flatMap(([fg, bg]) => [colorVar(fg), colorVar(bg)])),
  ]);
  return (
    <div ref={ref} style={{ display: 'grid', gap: 8 }}>
      {pairs.map(([foreground, background, target]) => {
        const fg = values[colorVar(foreground)];
        const bg = values[colorVar(background)];
        const ratio = fg && bg ? contrastRatio(fg, bg) : NaN;
        const pass = ratio >= target;
        return (
          <div
            key={`${foreground}-${background}`}
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 44,
                textAlign: 'center',
                padding: '6px 0',
                borderRadius: 6,
                fontWeight: 600,
                color: `var(${colorVar(foreground)})`,
                background: `var(${colorVar(background)})`,
                border: '1px solid var(--fui-color-border-subtle)',
              }}
            >
              Aa
            </span>
            <span style={{ flex: 1, fontSize: 13 }}>
              {foreground} on {background}
            </span>
            <span style={{ ...code, fontWeight: 600 }}>
              {Number.isNaN(ratio) ? '…' : `${ratio.toFixed(2)}:1`}
            </span>
            <span style={{ ...caption, width: 92, textAlign: 'right' }}>
              {Number.isNaN(ratio) ? '' : `${pass ? 'Pass' : 'Fail'} (${target}:1)`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** WCAG contrast ratios computed live from the theme tokens. */
export function ContrastTable({ pairs }: { pairs: ContrastPair[] }) {
  return <ThemeColumns>{() => <ContrastList pairs={pairs} />}</ThemeColumns>;
}

const remToPx = (value: string) => (value.endsWith('rem') ? `${parseFloat(value) * 16}px` : value);

/** Spacing tokens drawn to scale. */
export function SpacingScale({ steps }: { steps: number[] }) {
  const vars = steps.map((step) => `--fui-space-${step}`);
  const [ref, values] = useTokenValues(vars);
  return (
    <div ref={ref} style={{ display: 'grid', gap: 10, margin: '16px 0 32px' }}>
      {steps.map((step, index) => (
        <div
          key={step}
          style={{
            display: 'grid',
            gridTemplateColumns: '90px 130px 1fr',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600 }}>space.{step}</span>
          <span style={{ ...code, color: '#51636b' }}>
            {values[vars[index]!] ?? ''}{' '}
            {values[vars[index]!] ? `· ${remToPx(values[vars[index]!]!)}` : ''}
          </span>
          <span
            style={{
              display: 'block',
              height: 16,
              width: `var(${vars[index]})`,
              background: '#08695e',
              borderRadius: 3,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/** Corner radius tokens applied to sample surfaces. */
export function RadiusScale({ sizes }: { sizes: string[] }) {
  const vars = sizes.map((size) => `--fui-radius-${size}`);
  const [ref, values] = useTokenValues(vars);
  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', gap: 24, margin: '16px 0 32px' }}>
      {sizes.map((size, index) => (
        <div key={size} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 96,
              height: 72,
              border: '2px solid #08695e',
              background: '#e8f0ed',
              borderRadius: `var(${vars[index]})`,
            }}
          />
          <p style={{ margin: '6px 0 0', fontSize: 13, fontWeight: 600 }}>radius.{size}</p>
          <p style={{ margin: 0, fontSize: 12, color: '#51636b', ...code }}>
            {values[vars[index]!]
              ? `${values[vars[index]!]} · ${remToPx(values[vars[index]!]!)}`
              : ''}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Type scale samples using the font family, size and weight tokens. */
export function TypeScale({ sizes }: { sizes: string[] }) {
  const vars = [
    ...sizes.map((size) => `--fui-font-size-${size}`),
    '--fui-font-body',
    '--fui-font-weight-medium',
  ];
  const [ref, values] = useTokenValues(vars);
  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gap: 16,
        margin: '16px 0 32px',
        fontFamily: 'var(--fui-font-body)',
      }}
    >
      <p style={{ margin: 0, fontSize: 13, color: '#51636b' }}>
        font.body: <span style={code}>{values['--fui-font-body'] ?? ''}</span> · font.weight.medium:{' '}
        <span style={code}>{values['--fui-font-weight-medium'] ?? ''}</span>
      </p>
      {sizes.map((size) => {
        const value = values[`--fui-font-size-${size}`];
        return (
          <div
            key={size}
            style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr',
              alignItems: 'baseline',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              font.size.{size}
              <span style={{ ...code, display: 'block', fontWeight: 400, color: '#51636b' }}>
                {value ? `${value} · ${remToPx(value)}` : ''}
              </span>
            </span>
            <span style={{ fontSize: `var(--fui-font-size-${size})` }}>
              People &amp; possibilities,{' '}
              <strong style={{ fontWeight: 'var(--fui-font-weight-medium)' }}>medium weight</strong>
            </span>
          </div>
        );
      })}
    </div>
  );
}
