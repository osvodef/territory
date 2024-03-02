<script setup lang="ts">
  import mapboxgl from 'mapbox-gl';
  import { onMounted, ref } from 'vue';
  import type { Map } from 'mapbox-gl';
  import { accessToken } from '@/constants';

  const container = ref<HTMLDivElement>();
  let map: Map;

  onMounted(() => {
    mapboxgl.accessToken = accessToken;

    map = new mapboxgl.Map({
      container: container.value as HTMLDivElement,
      zoom: 2,
      center: [0, 0],
      hash: true,
    });
  });
</script>

<template>
  <div class="container" ref="container" v-once></div>
</template>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
  }
</style>
