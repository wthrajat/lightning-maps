export function formatSats(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value < 100 ? 1 : 0,
  }).format(value);
}

export function formatCompactSats(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number): string {
  const normalizedValue = value <= 1 ? value * 100 : value;
  return `${normalizedValue.toFixed(normalizedValue >= 99 ? 0 : 1)}%`;
}

export function formatLatency(value: number): string {
  return `${Math.round(value)} ms`;
}
