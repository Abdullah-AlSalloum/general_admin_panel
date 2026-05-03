export function parseFormattedNumber(input: string): number {
  const normalized = input.replace(/,/g, '').trim();
  if (normalized === '') return NaN;
  return Number(normalized);
}

export function formatNumberInput(input: string): string {
  const numeric = parseFormattedNumber(input);
  if (Number.isNaN(numeric)) return input;

  const [intPart, decimalPart] = String(input.replace(/,/g, '')).split('.');
  const intFormatted = Number(intPart || '0').toLocaleString('en-US');
  return decimalPart !== undefined ? `${intFormatted}.${decimalPart}` : intFormatted;
}

export function limitNumberInput(input: string): string {
  const cleaned = input.replace(/[^\d.]/g, '');
  const firstDot = cleaned.indexOf('.');
  if (firstDot === -1) return cleaned;

  const beforeDot = cleaned.slice(0, firstDot + 1);
  const afterDot = cleaned.slice(firstDot + 1).replace(/\./g, '');
  return `${beforeDot}${afterDot}`;
}
