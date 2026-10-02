const numericValue = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const formatCurrency = (value, options = {}) => {
  const number = numericValue(value);
  if (number === null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    ...options,
  }).format(number);
};

export const formatCompactCurrency = (value) => {
  const number = numericValue(value);
  if (number === null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number);
};

export const formatInteger = (value) => {
  const number = numericValue(value);
  if (number === null) return '—';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(number);
};

export const formatNumber = formatInteger;

export const formatPercent = (value) => {
  const number = numericValue(value);
  if (number === null) return '—';
  return `${new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(number)}%`;
};
