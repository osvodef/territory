import type { DataField, Region } from '@/types';

export function calcPercentage(region: Region, field: DataField): number {
  const value = region[field];
  const total = region.total;

  return total !== 0 ? value / total : 0;
}

export function toPrecision(number: number, precision: number): number {
  const factor = 10 ** precision;

  return Math.round(number * (factor + Number.EPSILON)) / factor;
}
