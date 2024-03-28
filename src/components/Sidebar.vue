<script setup lang="ts">
  import { useStore } from '@/store';
  import type { DataField, RegionType } from '@/types';
  import ColorController from '@/components/ColorController.vue';

  const store = useStore();

  const regionTypeOptions: Array<{ type: RegionType; name: string }> = [
    { type: 'gemeente', name: 'Gemeente' },
    { type: 'wijk', name: 'Wijk' },
    { type: 'buurt', name: 'Buurt' },
  ];

  const dataFieldOptions: Array<{
    field: DataField;
    name: string;
    indent: boolean;
    infoLink?: string;
  }> = [
    {
      field: 'nonWesternTotal',
      name: 'Non-western',
      indent: false,
      infoLink:
        'https://www.cbs.nl/en-gb/our-services/methods/definitions/person-with-a-non-western-migration-background',
    },
    {
      field: 'westernTotal',
      name: 'Western',
      indent: false,
      infoLink:
        'https://www.cbs.nl/en-gb/our-services/methods/definitions/person-with-a-western-migration-background',
    },
    { field: 'morocco', name: 'Morocco', indent: true },
    { field: 'antillesAndAruba', name: 'Antilles and Aruba', indent: true },
    { field: 'surinam', name: 'Surinam', indent: true },
    { field: 'turkey', name: 'Turkey', indent: true },
  ];

  const dataFieldToDefaultRange: { [key in DataField]: [number, number] } = {
    total: [0, 0.4],
    nonWesternTotal: [0, 0.4],
    westernTotal: [0, 0.4],
    morocco: [0, 0.1],
    antillesAndAruba: [0, 0.1],
    surinam: [0, 0.1],
    turkey: [0, 0.1],
  };

  function setDataField(field: DataField): void {
    store.dataField = field;

    const [minRange, maxRange] = dataFieldToDefaultRange[field];
    store.minColorRatio = minRange;
    store.maxColorRatio = maxRange;
  }
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
    <div class="header">
      <div>Immigration background</div>
      <a
        href="https://www.cbs.nl/en-gb/our-services/methods/definitions/migration-background"
        target="_blank"
      >
        <img src="@/icons/question.svg" class="info" />
      </a>
    </div>
    <div class="data-fields">
      <div
        v-for="{ field, name, indent, infoLink } of dataFieldOptions"
        :key="field"
        :class="['data-field', { selected: store.dataField === field, indent }]"
        @click="setDataField(field)"
      >
        <div>{{ name }}</div>
        <a v-if="infoLink !== undefined" :href="infoLink" target="_blank">
          <img src="@/icons/question.svg" class="info" />
        </a>
      </div>
    </div>
    <div class="header">Color range</div>
    <ColorController />
  </div>
</template>

<style scoped>
  .container {
    padding: 20px;
    border-radius: 5px;
  }

  .header {
    font-weight: bold;
    margin-bottom: 10px;
    display: flex;
  }

  .region-types {
    display: flex;
    width: 100%;
    margin-bottom: 30px;
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

  .info {
    display: block;
    width: 15px;
    height: 15px;
    margin-top: 4px;
    margin-left: 5px;
  }

  .header .info {
    margin-top: 3px;
  }

  .data-fields {
    margin-bottom: 30px;
  }

  .data-field {
    display: flex;
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

  .max-ratio-slider {
    display: block;
    margin: 0;
    padding: 0;
    width: 100%;
  }
</style>
