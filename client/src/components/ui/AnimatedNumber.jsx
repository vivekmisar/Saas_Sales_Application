import { useCountUp } from '../../hooks/useCountUp';

export default function AnimatedNumber({ value, format, prefix = '', suffix = '', decimals = 0 }) {
  const numericValue = value === null || value === undefined || value === '' ? null : Number(value);
  const isValid = numericValue !== null && Number.isFinite(numericValue);
  const count = useCountUp(isValid ? numericValue : 0);

  if (!isValid) return <>—</>;

  if (format) {
    return <>{prefix}{format(count)}{suffix}</>;
  }

  const numStr = Number(count).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <>{prefix}{numStr}{suffix}</>;
}
