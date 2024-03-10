<script setup lang="ts">
  import { useStore } from '@/stores';
  import type { Region } from '@/types';
  import { calcPercentage, formatPercentage, useMouse } from '@/utils';
  import { computed } from 'vue';

  const store = useStore();
  const mouse = useMouse();

  const props = defineProps<{ region: Region }>();
  const region = computed(() => props.region);

  const percentage = computed(() => {
    return formatPercentage(calcPercentage(region.value, store.dataField));
  });

  const tooltipPosition = computed(() => {
    if (store.hover === undefined) {
      return;
    }

    return {
      left: `${mouse.x.value + 15}px`,
      top: `${mouse.y.value + 15}px`,
    };
  });
</script>

<template>
  <div class="container" v-if="store.hover">
    <div class="tooltip" :style="tooltipPosition">
      <div class="tooltip-title">{{ region.name }}</div>
      <div class="tooltip-content">{{ percentage }}</div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .tooltip {
    position: absolute;
    opacity: 0.9;
    background-color: #fff;
    padding: 5px;
    border-radius: 5px;
  }

  .tooltip-title {
    font-size: 10px;
    font-weight: bold;
  }

  .tooltip-content {
    font-size: 12px;
  }
</style>
