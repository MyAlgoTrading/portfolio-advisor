/**
 * Format currency with Indian numbering system (Lakhs, Crores, or standard Indian commas)
 */
export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0.00';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (compact) {
    if (absAmount >= 10000000) {
      return `${isNegative ? '-' : ''}₹${(absAmount / 10000000).toFixed(2)} Cr`;
    } else if (absAmount >= 100000) {
      return `${isNegative ? '-' : ''}₹${(absAmount / 100000).toFixed(2)} L`;
    } else if (absAmount >= 1000) {
      return `${isNegative ? '-' : ''}₹${(absAmount / 1000).toFixed(1)}k`;
    }
  }

  // Standard Indian formatting (e.g. 12,34,567.89)
  const formatted = absAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${isNegative ? '-' : ''}₹${formatted}`;
}
