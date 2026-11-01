/** @jest-environment node */
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { parseDateOnly, formatDateOnly, dateError, validateDateBounds } from './dateOnly';

test.each([
  '2026-02-29',
  '2024-02-31',
  '0000-01-01',
  '2026-13-01',
  '2026-00-02',
  '2026-01-00',
  '2026-01-32',
  '1/2/2026',
  '',
])('rejects impossible or malformed date %s', (value) => {
  expect(parseDateOnly(value)).toBeUndefined();
});
test.each(['2024-02-29', '2026-12-31', '2027-01-01', '0001-01-01'])(
  'round trips Gregorian date %s',
  (value) => {
    expect(formatDateOnly(parseDateOnly(value)!)).toBe(value);
  },
);
test('bounds reject invalid configuration and validate inclusive edges', () => {
  expect(() => validateDateBounds('2026-02-01', '2026-01-01')).toThrow();
  expect(() => validateDateBounds('bad')).toThrow();
  expect(() => validateDateBounds(undefined, 'bad')).toThrow();
  expect(dateError('2026-01-01', '2026-01-02')).toMatch(/or later/);
  expect(dateError('2026-01-03', undefined, '2026-01-02')).toMatch(/or earlier/);
  expect(dateError('2026-02-31')).toMatch(/valid date/);
  expect(dateError('', '2026-01-01')).toBeUndefined();
  expect(dateError('2026-01-01', '2026-01-01', '2026-01-01')).toBeUndefined();
});
test.each(['Asia/Kolkata', 'America/Los_Angeles'])(
  'local date conversions retain the calendar day in %s',
  (timezone) => {
    const url = pathToFileURL(path.resolve('packages/ui/src/internal/dateOnly.ts')).href;
    const output = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import {parseDateOnly,formatDateOnly} from ${JSON.stringify(url)}; console.log(['2024-02-29','2026-03-08','2026-11-01'].map(value=>formatDateOnly(parseDateOnly(value))).join(','));`,
      ],
      { env: { ...process.env, TZ: timezone }, encoding: 'utf8', windowsHide: true },
    );
    expect(output.trim()).toBe('2024-02-29,2026-03-08,2026-11-01');
  },
);
