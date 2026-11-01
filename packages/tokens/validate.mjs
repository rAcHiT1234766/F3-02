const requiredColors = [
  'background',
  'surface',
  'surfaceRaised',
  'text',
  'textMuted',
  'border',
  'borderSubtle',
  'action',
  'actionHover',
  'actionPressed',
  'onAction',
  'danger',
  'onDanger',
  'dangerSurface',
  'success',
  'successSurface',
  'warning',
  'warningSurface',
  'focus',
  'disabled',
  'onDisabled',
];

export function flattenTokens(tree, prefix = '', output = {}) {
  for (const [key, entry] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!entry || typeof entry !== 'object') throw new Error(`Invalid token: ${path}`);
    if ('$value' in entry || '$type' in entry) throw new Error(`Mixed token schema: ${path}`);
    if ('value' in entry) output[path] = entry;
    else flattenTokens(entry, path, output);
  }
  return output;
}

export function validateTokens(primitives, light, dark) {
  const shared = flattenTokens(primitives);
  const sets = [flattenTokens(light), flattenTokens(dark)];
  if (Object.keys(sets[0]).sort().join() !== Object.keys(sets[1]).sort().join()) {
    throw new Error('Theme keys do not match');
  }
  for (const theme of sets) {
    for (const name of requiredColors) {
      if (!theme[`color.${name}`]) throw new Error(`Missing semantic token: color.${name}`);
    }
    const all = { ...shared, ...theme };
    const resolve = (name, seen = new Set()) => {
      if (!all[name]) throw new Error(`Unknown reference: ${name}`);
      if (seen.has(name)) throw new Error(`Circular reference: ${name}`);
      const token = all[name];
      const match = typeof token.value === 'string' && token.value.match(/^\{([^{}]+)\}$/);
      if (match) {
        if (token.type !== all[match[1]]?.type && all[match[1]]) {
          throw new Error(`Reference type mismatch: ${name}`);
        }
        return resolve(match[1], new Set([...seen, name]));
      }
      if (String(token.value).includes('{')) throw new Error(`Invalid reference: ${name}`);
      if (
        token.type === 'dimension' &&
        !/^(?:0|[0-9]+(?:\.[0-9]+)?(?:rem|px))$/.test(token.value)
      ) {
        throw new Error(`Invalid dimension: ${name}`);
      }
      if (token.type === 'color' && !/^#[0-9a-f]{6}$/i.test(token.value)) {
        throw new Error(`Invalid color: ${name}`);
      }
      if (!['color', 'dimension', 'fontFamily', 'fontWeight'].includes(token.type)) {
        throw new Error(`Unsupported token type: ${name}`);
      }
      return token.value;
    };
    for (const name of Object.keys(all)) resolve(name);
  }
}
