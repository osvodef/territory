<script setup lang="ts">
  import Map from '@/components/Map.vue';
  import Sidebar from '@/components/Sidebar.vue';
  import Tooltip from '@/components/Tooltip.vue';
</script>

<template>
  <Map />
  <Sidebar class="sidebar" />
  <Tooltip />
</template>

<style scoped>
  .sidebar {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 500px;
    background-color: #ffffff;
  }
</style>
