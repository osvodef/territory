<script setup lang="ts">
  import { useStore } from '@/store';
  import Map from '@/components/Map.vue';
  import Card from '@/components/Card.vue';
  import Legend from '@/components/Legend.vue';
  import Sidebar from '@/components/Sidebar.vue';
  import Tooltip from '@/components/Tooltip.vue';

  const store = useStore();
</script>

<template>
  <Map />

  <Sidebar class="sidebar" />
  <Card v-if="store.selection !== undefined" :region="store.selection.region" class="card" />
  <Legend class="legend" />
  <Tooltip v-if="store.hover !== undefined" :region="store.hover.region" />
</template>

<style scoped>
  .sidebar {
    position: absolute;
    bottom: 25px;
    right: 10px;
    width: 400px;
    background-color: #ffffff;
    box-shadow: 0 3px 6px #00000029;
  }

  .card {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 400px;
    background-color: #ffffff;
    box-shadow: 0 3px 6px #00000029;
  }

  .legend {
    position: absolute;
    bottom: 35px;
    left: 10px;
    background-color: #ffffff;
    box-shadow: 0 3px 6px #00000029;
  }
</style>
