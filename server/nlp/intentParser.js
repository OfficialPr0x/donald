function parseIntent(text) {
  const lower = text.toLowerCase();
  if (lower.includes('edge') || lower.includes('tease')) {
    return { command: 'stroke_preset', params: { preset: 'edge' } };
  }
  if (lower.includes('faster') || lower.includes('speed up')) {
    return { command: 'stroke_v2', params: { speed: 100 } };
  }
  if (lower.includes('slower') || lower.includes('gentle')) {
    return { command: 'stroke_v2', params: { speed: 30 } };
  }
  if (lower.includes('stop')) {
    return { command: 'stop', params: {} };
  }
  if (lower.includes('pause')) {
    return { command: 'pause', params: {} };
  }
  return null;
}

module.exports = { parseIntent }; 