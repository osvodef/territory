<script setup lang="ts">
  import { useStore } from '@/store';
  import { clamp, formatTickLabel, toPrecision, unlerp, useDevicePixelRatio } from '@/utils';
  import { interpolateReds } from 'd3-scale-chromatic';
  import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';

  interface Tick {
    label: string;
    x: number;
    height: number;
  }

  interface DragContext {
    element: DragElement;
    startX: number;
    startValue: number;
  }

  type DragElement = 'minHandle' | 'maxHandle';

  const store = useStore();
  const devicePixelRatio = useDevicePixelRatio();

  const ramp = ref<HTMLCanvasElement>();
  const dragContext = ref<DragContext | undefined>();

  const rampWidthCss = 360;
  const rampHeightCss = 10;

  const tickCount = 11;
  const ticks: Tick[] = [];

  for (let i = 0; i < tickCount; i++) {
    const ratio = i / (tickCount - 1);
    const x = Math.round(ratio * (rampWidthCss - 1));

    ticks.push({
      x,
      label: i % 2 === 0 ? formatTickLabel(ratio) : '',
      height: i % 2 === 0 ? 8 : 5,
    });
  }

  onMounted(() => {
    renderRamp();

    document.body.addEventListener('mouseup', stopDrag);
    document.body.addEventListener('mousemove', drag);
  });

  onUnmounted(() => {
    document.body.removeEventListener('mouseup', stopDrag);
    document.body.removeEventListener('mousemove', drag);
  });

  watch([() => store.minColorRatio, () => store.maxColorRatio, devicePixelRatio], renderRamp);

  watchEffect(() => {
    document.body.style.cursor = dragContext.value === undefined ? 'auto' : 'ew-resize';
  });

  const minHandleX = computed<number>(() => {
    return Math.round(store.minColorRatio * (rampWidthCss - 1));
  });

  const maxHandleX = computed<number>(() => {
    return Math.round(store.maxColorRatio * (rampWidthCss - 1));
  });

  function renderRamp(): void {
    const canvas = ramp.value!;
    const ctx = canvas.getContext('2d')!;

    const width = rampWidthCss * devicePixelRatio.value;
    const height = rampHeightCss * devicePixelRatio.value;

    canvas.width = width;
    canvas.height = height;

    for (let i = 0; i <= width; i++) {
      const ratio = i / width;

      ctx.strokeStyle = interpolateReds(unlerp(store.minColorRatio, store.maxColorRatio, ratio));

      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
  }

  function startDrag(e: MouseEvent, element: DragElement): void {
    dragContext.value = {
      element,
      startX: e.clientX,
      startValue: element === 'minHandle' ? store.minColorRatio : store.maxColorRatio,
    };
  }

  function stopDrag(): void {
    dragContext.value = undefined;
  }

  function drag(e: MouseEvent): void {
    if (dragContext.value === undefined) {
      return;
    }

    const { startX, startValue, element } = dragContext.value;

    const deltaX = e.clientX - startX;
    const newValue = toPrecision(startValue + deltaX / rampWidthCss, 1);

    if (element === 'minHandle') {
      store.minColorRatio = clamp(newValue, 0, store.maxColorRatio - 0.1);
    } else {
      store.maxColorRatio = clamp(newValue, store.minColorRatio + 0.1, 1);
    }
  }
</script>

<template>
  <div class="controller">
    <div class="ticks">
      <div
        class="tick"
        v-for="tick in ticks"
        :key="tick.x"
        :style="{ left: `${tick.x}px`, height: `${tick.height}px` }"
      >
        <div class="label">{{ tick.label }}</div>
      </div>
    </div>
    <div class="ramp-container">
      <canvas class="ramp" ref="ramp" />

      <div class="handle-line min-handle-line" :style="{ left: `${minHandleX}px` }" />
      <div class="handle-line max-handle-line" :style="{ left: `${maxHandleX}px` }" />
    </div>

    <div class="handles">
      <div
        class="handle min-handle"
        :style="{ transform: `translateX(${minHandleX}px)` }"
        @mousedown="startDrag($event, 'minHandle')"
      />
      <div
        class="handle max-handle"
        :style="{ transform: `translateX(${maxHandleX}px)` }"
        @mousedown="startDrag($event, 'maxHandle')"
      />
    </div>
  </div>
</template>

<style scoped>
  .ticks {
    position: relative;
    height: 7px;
    margin-top: 25px;
  }

  .tick {
    position: absolute;
    bottom: 0;
    width: 0;
    height: 100%;
    border-left: 1px solid #000000;
  }

  .label {
    position: absolute;
    font-size: 10px;
    top: -16px;
    left: -6px;
  }

  .tick:first-child .label {
    left: -1px;
  }

  .tick:last-child .label {
    left: -25px;
  }

  .ramp-container {
    position: relative;
    height: 12px;
  }

  .ramp {
    display: block;
    width: 100%;
    height: 100%;
  }

  .handle-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    border-left: 1px solid #000000;
  }

  .handles {
    position: relative;
    height: 20px;
  }

  .handle {
    position: absolute;
    top: 0;
    left: -7px;
    cursor: ew-resize;

    position: absolute;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 14px solid #333;
  }
</style>
