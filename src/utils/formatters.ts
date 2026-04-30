export function formatPercent(value: number | null) {
  if (value === null) {
    return "—";
  }

  return `${value.toFixed(1)}%`;
}

export function formatInteger(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}
