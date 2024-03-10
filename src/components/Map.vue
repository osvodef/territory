<script setup lang="ts">
  import mapboxgl from 'mapbox-gl';
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import type { AnyLayer, Map } from 'mapbox-gl';
  import { accessToken } from '@/constants';
  import type { DataField, Region, RegionType, Regions } from '@/types';
  import { calcPercentage, toPrecision } from '@/utils';

  import { scaleSequential } from 'd3-scale';
  import { interpolateReds } from 'd3-scale-chromatic';
  import { useStore } from '@/stores';

  const store = useStore();
  const container = ref<HTMLDivElement>();

  let map: Map;
  let populationData: { [key in RegionType]: Regions };

  watch(
    () => store.regionType,
    () => {
      map.setLayoutProperty('gemeente', 'visibility', 'none');
      map.setLayoutProperty('wijk', 'visibility', 'none');
      map.setLayoutProperty('buurt', 'visibility', 'none');

      map.setLayoutProperty(store.regionType, 'visibility', 'visible');

      applyColors(store.regionType, store.dataField);
    },
  );

  watch(
    () => store.dataField,
    () => {
      applyColors(store.regionType, store.dataField);
    },
  );

  watch(
    () => store.hover,
    (curr, prev) => {
      if (prev !== undefined) {
        map.setFeatureState(
          { source: prev.regionType, sourceLayer: prev.regionType, id: prev.id },
          { hover: false },
        );
      }

      if (curr !== undefined) {
        map.setFeatureState(
          { source: curr.regionType, sourceLayer: curr.regionType, id: curr.id },
          { hover: true },
        );
      }

      map.getCanvas().style.cursor = curr !== undefined ? 'pointer' : 'auto';
    },
  );

  onMounted(async () => {
    mapboxgl.accessToken = accessToken;

    map = new mapboxgl.Map({
      container: container.value as HTMLDivElement,
      zoom: 2,
      center: [0, 0],
      hash: true,
      projection: { name: 'mercator' },
      minZoom: 6,
    });

    (window as any).map = map;

    await new Promise(resolve => map.once('style.load', resolve));

    map.setConfigProperty('basemap', 'showRoadLabels', false);
    map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);

    const data = await Promise.all([
      fetch('./gemeente.json').then(response => response.json()),
      fetch('./wijk.json').then(response => response.json()),
      fetch('./buurt.json').then(response => response.json()),
    ]);

    map.addSource('gemeente', {
      type: 'vector',
      tiles: ['http://localhost:8080/data/gemeente/{z}/{x}/{y}.pbf'],
      maxzoom: 14,
      promoteId: 'id',
    });

    map.addSource('wijk', {
      type: 'vector',
      tiles: ['http://localhost:8080/data/wijk/{z}/{x}/{y}.pbf'],
      maxzoom: 14,
      promoteId: 'id',
    });

    map.addSource('buurt', {
      type: 'vector',
      tiles: ['http://localhost:8080/data/buurt/{z}/{x}/{y}.pbf'],
      maxzoom: 14,
      promoteId: 'id',
    });

    map.addLayer({
      'id': 'gemeente',
      'source': 'gemeente',
      'source-layer': 'gemeente',
      'type': 'fill',
      'slot': 'top',
      'layout': {
        visibility: store.regionType === 'gemeente' ? 'visible' : 'none',
      },
      'paint': {
        'fill-color': ['feature-state', 'fillColor'],
        'fill-opacity': 0.75,
        'fill-outline-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 0.25)',
        ],
      },
    } as AnyLayer);

    map.addLayer({
      'id': 'wijk',
      'source': 'wijk',
      'source-layer': 'wijk',
      'type': 'fill',
      'slot': 'top',
      'layout': {
        visibility: store.regionType === 'wijk' ? 'visible' : 'none',
      },
      'paint': {
        'fill-color': ['feature-state', 'fillColor'],
        'fill-opacity': 0.75,
        'fill-outline-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 0.25)',
        ],
      },
    } as AnyLayer);

    map.addLayer({
      'id': 'buurt',
      'source': 'buurt',
      'source-layer': 'buurt',
      'type': 'fill',
      'slot': 'top',
      'layout': {
        visibility: store.regionType === 'buurt' ? 'visible' : 'none',
      },
      'paint': {
        'fill-color': ['feature-state', 'fillColor'],
        'fill-opacity': 0.75,
        'fill-outline-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 0.25)',
        ],
      },
    } as AnyLayer);

    map.on('mousemove', e => {
      const hoveredFeatures = map.queryRenderedFeatures(e.point, {
        layers: ['gemeente', 'wijk', 'buurt'],
      });

      const hoveredFeature = hoveredFeatures[0];

      if (hoveredFeature === undefined) {
        store.hover = undefined;
        return;
      }

      const regionType = hoveredFeature.source as RegionType;
      const id = hoveredFeature!.properties!.id as string;

      const region = populationData[regionType][id];
      const name = region.name;
      const value = calcPercentage(region, store.dataField);

      store.hover = {
        id,
        regionType,
        title: name,
        content: `${toPrecision(value * 100, 1)}%`,
        x: e.point.x,
        y: e.point.y,
      };
    });

    map.on('mouseout', () => {
      store.hover = undefined;
    });

    map.on('movestart', () => {
      store.hover = undefined;
    });

    populationData = {
      gemeente: data[0] as Regions,
      wijk: data[1] as Regions,
      buurt: data[2] as Regions,
    };

    applyColors(store.regionType, store.dataField);
  });

  onUnmounted(() => {
    map.remove();
  });

  function applyColors(regionType: RegionType, dataField: DataField): void {
    const colorScale = scaleSequential([0, 0.5], interpolateReds);
    const regions = populationData[regionType];

    for (const id in regions) {
      const percentage = calcPercentage(regions[id], dataField);
      const color = colorScale(percentage);

      map.setFeatureState(
        { source: regionType, sourceLayer: regionType, id },
        { fillColor: color },
      );
    }
  }
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
