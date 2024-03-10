<script setup lang="ts">
  import { useStore } from '@/stores';
  import { computed } from 'vue';

  const store = useStore();

  const tooltipPosition = computed(() => {
    if (store.tooltip === undefined) {
      return;
    }

    return {
      left: `${store.tooltip.x + 15}px`,
      top: `${store.tooltip.y + 15}px`,
    };
  });
</script>

<template>
  <div class="container" v-if="store.tooltip">
    <div class="tooltip" :style="tooltipPosition">
      <div class="tooltip-title">{{ store.tooltip.title }}</div>
      <div class="tooltip-content">{{ store.tooltip.content }}</div>
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
