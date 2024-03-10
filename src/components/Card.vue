<script setup lang="ts">
  import { useStore } from '@/stores';
  import type { DataField, Region } from '@/types';
  import { calcPercentage, formatNumber, formatPercentageFixed } from '@/utils';
  import { computed } from 'vue';

  const store = useStore();

  const props = defineProps<{ region: Region }>();
  const region = computed(() => props.region);

  const rows: Array<{ name: string; field: DataField }> = [
    { name: 'Population', field: 'total' },
    { name: 'Non-western', field: 'nonWesternTotal' },
    { name: 'Western', field: 'westernTotal' },
    { name: 'Morocco', field: 'morocco' },
    { name: 'Antilles and Aruba', field: 'antillesAndAruba' },
    { name: 'Surinam', field: 'surinam' },
    { name: 'Turkey', field: 'turkey' },
  ];
</script>

<template>
  <div class="container" v-if="store.selection">
    <div class="title">{{ region.name }}</div>
    <div class="rows">
      <div class="row header">
        <div class="cell name">Statistic</div>
        <div class="cell number">Total</div>
        <div class="cell percentage">Ratio</div>
      </div>

      <div :class="['row', field]" v-for="{ name, field } of rows" :key="field">
        <div class="cell name">{{ name }}</div>
        <div class="cell number">{{ formatNumber(region[field]) }}</div>
        <div class="cell percentage">
          {{ formatPercentageFixed(calcPercentage(region, field)) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    padding: 15px 20px;
    border-radius: 5px;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .rows {
    font-size: 14px;
  }

  .row {
    display: flex;
    margin-bottom: 3px;
  }

  .row.header {
    font-weight: bold;
  }

  .row.header {
    margin-bottom: 5px;
  }

  .row.total,
  .row.westernTotal {
    margin-bottom: 15px;
  }

  .cell {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 0;
  }

  .cell.name {
    min-width: 160px;
  }

  .cell.number {
    min-width: 70px;
    text-align: end;
  }

  .cell.percentage {
    min-width: 120px;
    text-align: end;
  }
</style>
