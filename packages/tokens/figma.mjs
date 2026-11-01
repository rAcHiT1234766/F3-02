// Conversion between source/*.json (Style Dictionary value/type) and a single
// Tokens Studio for Figma file (token sets + themes), in both directions.

const SETS = ['primitives', 'light', 'dark'];
const FONT_WEIGHTS = {
  thin: 100,
  extralight: 200,
  light: 300,
  regular: 400,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

function mapTokens(tree, convert, path = []) {
  const output = {};
  for (const [key, entry] of Object.entries(tree)) {
    if (key.startsWith('$') && path.length === 0) continue;
    const isToken = entry && typeof entry === 'object' && ('value' in entry || '$value' in entry);
    output[key] = isToken
      ? convert(entry, [...path, key])
      : mapTokens(entry, convert, [...path, key]);
  }
  return output;
}

/** Tokens Studio types make Figma create correctly scoped variables. */
function studioType(type, path) {
  if (type === 'fontFamily') return 'fontFamilies';
  if (type === 'fontWeight') return 'fontWeights';
  if (type !== 'dimension') return type;
  if (path[0] === 'space') return 'spacing';
  if (path[0] === 'radius') return 'borderRadius';
  if (path[0] === 'font' && path[1] === 'size') return 'fontSizes';
  return 'dimension';
}

function sourceType(type) {
  if (['fontFamilies', 'fontFamily'].includes(type)) return 'fontFamily';
  if (['fontWeights', 'fontWeight'].includes(type)) return 'fontWeight';
  if (
    ['spacing', 'borderRadius', 'fontSizes', 'sizing', 'borderWidth', 'dimension'].includes(type)
  ) {
    return 'dimension';
  }
  return type;
}

function sourceValue(value, type) {
  const isReference = typeof value === 'string' && /^\{[^{}]+\}$/.test(value);
  if (isReference) return value;
  if (type === 'dimension' && /^-?\d+(\.\d+)?$/.test(String(value))) {
    return Number(value) === 0 ? '0' : `${Number(value)}px`;
  }
  if (type === 'fontWeight') {
    if (/^\d+$/.test(String(value))) return Number(value);
    return FONT_WEIGHTS[String(value).toLowerCase().replace(/[\s-]/g, '')] ?? value;
  }
  if (type === 'color' && typeof value === 'string') {
    const hex = value.trim().toLowerCase();
    return /^#[0-9a-f]{6}ff$/.test(hex) ? hex.slice(0, 7) : hex;
  }
  return value;
}

const tokenText = (entry) =>
  `{ "value": ${JSON.stringify(entry.value)}, "type": ${JSON.stringify(entry.type)} }`;

/** Serialize a source set in the repository style: one token per line. */
export function stringifySource(tree, indent = '') {
  const inner = `${indent}  `;
  const lines = Object.entries(tree).map(([key, entry]) => {
    const prefix = `${inner}${JSON.stringify(key)}: `;
    if ('value' in entry) return prefix + tokenText(entry);
    // A group holding a single token stays on one line when it fits (printWidth 100).
    const children = Object.entries(entry);
    if (children.length === 1 && 'value' in children[0][1]) {
      const line = `${prefix}{ ${JSON.stringify(children[0][0])}: ${tokenText(children[0][1])} }`;
      if (line.length + 1 <= 100) return line;
    }
    return prefix + stringifySource(entry, inner);
  });
  return `{\n${lines.join(',\n')}\n${indent}}`;
}

export function toTokensStudio(sources) {
  const file = {};
  for (const set of SETS) {
    file[set] = mapTokens(sources[set], (token, path) => ({
      value: token.value,
      type: studioType(token.type, path),
    }));
  }
  file.$themes = [
    { id: 'core', name: 'Core', group: 'Core', selectedTokenSets: { primitives: 'enabled' } },
    {
      id: 'light',
      name: 'Light',
      group: 'Mode',
      selectedTokenSets: { primitives: 'source', light: 'enabled' },
    },
    {
      id: 'dark',
      name: 'Dark',
      group: 'Mode',
      selectedTokenSets: { primitives: 'source', dark: 'enabled' },
    },
  ];
  file.$metadata = { tokenSetOrder: SETS };
  return file;
}

export function fromTokensStudio(file) {
  const sources = {};
  for (const set of SETS) {
    if (!file[set]) throw new Error(`Token set "${set}" is missing from the Figma export.`);
    sources[set] = mapTokens(file[set], (token) => {
      const type = sourceType(token.type ?? token.$type);
      return { value: sourceValue(token.value ?? token.$value, type), type };
    });
  }
  return sources;
}
