<script setup lang="ts">
  import Map from '@/components/Map.vue';
  import Card from '@/components/Card.vue';
  import Sidebar from '@/components/Sidebar.vue';
  import Tooltip from '@/components/Tooltip.vue';
  import { useStore } from '@/stores';

  const store = useStore();
</script>

<template>
  <Map />

  <Sidebar class="sidebar" />
  <Card v-if="store.selection !== undefined" :region="store.selection.region" class="card" />
  <Tooltip v-if="store.hover !== undefined" :region="store.hover.region" />
</template>

<style scoped>
  .sidebar {
    position: absolute;
    bottom: 25px;
    right: 10px;
    width: 400px;
    background-color: #ffffff;
  }

  .card {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 400px;
    background-color: #ffffff;
  }
</style>
