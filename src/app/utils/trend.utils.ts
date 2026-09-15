export interface TrendValue {
  name: string;
  value: number;
}

export function createLinearTrend(values: readonly TrendValue[]): TrendValue[] {
  if (values.length < 2) {
    return values.map((value) => ({ ...value }));
  }

  const count = values.length;
  const sumX = values.reduce((total, _, index) => total + index, 0);
  const sumY = values.reduce((total, value) => total + value.value, 0);
  const sumXY = values.reduce((total, value, index) => total + index * value.value, 0);
  const sumXSquare = values.reduce((total, _, index) => total + index * index, 0);
  const denominator = count * sumXSquare - sumX * sumX;
  const slope = denominator === 0 ? 0 : (count * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / count;

  return values.map((value, index) => ({
    name: value.name,
    value: Math.max(0, intercept + slope * index),
  }));
}
