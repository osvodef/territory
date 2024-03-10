<script setup lang="ts">
  import { useStore } from '@/stores';
  import type { DataField, RegionType } from '@/types';

  const store = useStore();

  const regionTypeOptions: Array<{ type: RegionType; name: string }> = [
    { type: 'gemeente', name: 'Gemeente' },
    { type: 'wijk', name: 'Wijk' },
    { type: 'buurt', name: 'Buurt' },
  ];

  const dataFieldOptions: Array<{ field: DataField; name: string; indent: boolean }> = [
    { field: 'nonWesternTotal', name: 'Non-western migrants', indent: false },
    { field: 'westernTotal', name: 'Western migrants', indent: false },
    { field: 'morocco', name: 'Migrants from Morocco', indent: true },
    { field: 'antillesAndAruba', name: 'Migrants from Antilles and Aruba', indent: true },
    { field: 'surinam', name: 'Migrants from Surinam', indent: true },
    { field: 'turkey', name: 'Migrants from Turkey', indent: true },
  ];
</script>

<template>
  <div class="container">
    <div class="header">Administrative division</div>
    <div class="region-types">
      <div
        v-for="{ type, name } of regionTypeOptions"
        :key="type"
        :class="['region-type', { selected: store.regionType === type }]"
        @click="store.regionType = type"
      >
        {{ name }}
      </div>
    </div>
    <div class="header">Statistic</div>
    <div class="data-fields">
      <div
        v-for="{ field, name, indent } of dataFieldOptions"
        :key="field"
        :class="['data-field', { selected: store.dataField === field, indent }]"
        @click="store.dataField = field"
      >
        {{ name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    padding: 20px;
    border-radius: 5px;
  }

  .header {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .region-types {
    display: flex;
    width: 100%;
    margin-bottom: 20px;
  }

  .region-type {
    padding: 5px;
    flex-basis: 0;
    flex-grow: 1;
    text-align: center;
    border: 1px solid #ccc;
    cursor: pointer;
  }

  .region-type.selected {
    cursor: auto;
    background-color: #eee;
  }

  .region-type:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .region-type:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .region-type:not(:first-child) {
    border-left: none;
  }

  .data-field {
    border: 1px solid #ccc;
    padding: 5px;
    cursor: pointer;
  }

  .data-field.selected {
    cursor: auto;
    background-color: #eee;
  }

  .data-field:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .data-field:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .data-field:not(:first-child) {
    border-top: none;
  }
</style>
