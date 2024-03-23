<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { interpolateReds } from 'd3-scale-chromatic';
  import { useStore } from '@/store';

  interface Tick {
    label: string;
    y: number;
  }

  const store = useStore();

  const ramp = ref<HTMLCanvasElement>();

  const cssWidth = 30;
  const cssHeight = 480;

  const width = cssWidth * window.devicePixelRatio;
  const height = cssHeight * window.devicePixelRatio;

  onMounted(() => {
    const canvas = ramp.value!;
    const ctx = canvas.getContext('2d')!;

    canvas.width = width;
    canvas.height = height;

    for (let i = 0; i <= height; i++) {
      ctx.strokeStyle = interpolateReds(1 - i / height);

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
  });

  const ticks = computed<Tick[]>(() => {
    const ticks: Tick[] = [];
    const tickCount = 9;

    for (let i = 0; i < tickCount; i++) {
      const ratio = i / (tickCount - 1);
      const y = Math.round((1 - ratio) * cssHeight);
      const label = formatLabel(store.maxColorRatio * ratio, i === tickCount - 1);

      ticks.push({ label, y });
    }

    return ticks;
  });

  function formatLabel(ratio: number, addPlus: boolean): string {
    return `${Math.round(ratio * 100)}%${addPlus ? '+' : ''}`;
  }
</script>

<template>
  <div class="container">
    <canvas class="ramp" ref="ramp" />
    <div v-for="tick in ticks" :key="tick.y" class="tick" :style="{ top: `${10 + tick.y}px` }">
      <div class="label">{{ tick.label }}</div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    width: 75px;
    height: 500px;
    border-radius: 5px;
  }

  .ramp {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 20px;
    height: 480px;
  }

  .tick {
    position: absolute;
    left: 10px;
    width: 25px;
    height: 0;
    border-top: 1px solid #000000;
  }

  .label {
    position: absolute;
    font-size: 10px;
    top: -8px;
    left: 30px;
  }
</style>
