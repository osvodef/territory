<script setup lang="ts">
  import { useStore } from '@/stores';
  import type { DataField, Region } from '@/types';
  import { calcPercentage, formatNumber, formatPercentageFixed } from '@/utils';
  import { computed } from 'vue';

  const store = useStore();

  const props = defineProps<{ region: Region }>();
  const region = computed(() => props.region);

  const rows: Array<{ name: string; field: DataField }> = [
    { name: 'Total', field: 'total' },
    { name: 'Western', field: 'westernTotal' },
    { name: 'Non-western', field: 'nonWesternTotal' },
    { name: 'Morocco', field: 'morocco' },
    { name: 'Antilles and Aruba', field: 'antillesAndAruba' },
    { name: 'Surinam', field: 'surinam' },
    { name: 'Turkey', field: 'turkey' },
  ];
</script>

<template>
  <div class="container" v-if="store.selection">
    <div class="name">{{ region.name }}</div>
    <div class="rows">
      <div class="row" v-for="{ name, field } of rows" :key="field">
        <div class="cell">{{ name }}</div>
        <div class="cell">{{ formatNumber(region[field]) }}</div>
        <div class="cell">{{ formatPercentageFixed(calcPercentage(region, field)) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    padding: 20px;
    border-radius: 5px;
  }

  .name {
    font-weight: bold;
  }

  .row {
    display: flex;
  }

  .cell {
    flex-basis: 0;
    flex-grow: 1;
    text-align: end;
  }
</style>
