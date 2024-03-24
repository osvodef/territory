import { ref, onMounted, onUnmounted } from 'vue';
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

export function formatNumber(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function formatPercentage(ratio: number): string {
  return `${toPrecision(ratio * 100, 2)}%`;
}

export function formatPercentageFixed(ratio: number): string {
  return `${(ratio * 100).toFixed(2)}%`;
}

export function formatTickLabel(ratio: number, addition = ''): string {
  return `${Math.round(ratio * 100)}%${addition}`;
}

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(e: MouseEvent) {
    x.value = e.pageX;
    y.value = e.pageY;
  }

  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));

  return { x, y };
}

export function useDevicePixelRatio() {
  const devicePixelRatio = ref<number>(window.devicePixelRatio);

  function update() {
    devicePixelRatio.value = window.devicePixelRatio;
  }

  onMounted(() => window.addEventListener('resize', update));
  onUnmounted(() => window.removeEventListener('resize', update));

  return devicePixelRatio;
}

export function lerp(min: number, max: number, ratio: number): number {
  return min + (max - min) * ratio;
}

export function unlerp(min: number, max: number, value: number): number {
  return (value - min) / (max - min);
}

export function clamp(value: number, min: number, max: number): number {
  value = Math.min(value, max);
  value = Math.max(value, min);

  return value;
}
