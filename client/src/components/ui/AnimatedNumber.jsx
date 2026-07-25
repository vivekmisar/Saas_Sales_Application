import { useCountUp } from '../../hooks/useCountUp';

export default function AnimatedNumber({ value, format, prefix = '', suffix = '', decimals = 0 }) {
  const count = useCountUp(value);

  if (format) {
    return <>{prefix}{format(count)}{suffix}</>;
  }

  const numStr = Number(count).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <>{prefix}{numStr}{suffix}</>;
}
