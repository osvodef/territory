<script setup lang="ts">
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import { schemeReds } from 'd3-scale-chromatic';
  import type { RegionType, Regions } from '@/types';
  import type { AnyLayer, Expression, Map } from 'mapbox-gl';
  import { useStore } from '@/store';
  import mapboxgl from 'mapbox-gl';

  const store = useStore();
  const container = ref<HTMLDivElement>();

  let map: Map;
  let populationData: { [key in RegionType]: Regions };

  watch(
    [
      () => store.regionType,
      () => store.dataField,
      () => store.minColorRatio,
      () => store.maxColorRatio,
    ],
    rerenderChoropleth,
  );

  watch(
    () => store.hover,
    (curr, prev) => {
      if (prev !== undefined) {
        map.setFeatureState(
          { source: 'nl', sourceLayer: prev.type, id: prev.id },
          { hover: false },
        );
      }

      if (curr !== undefined) {
        map.setFeatureState({ source: 'nl', sourceLayer: curr.type, id: curr.id }, { hover: true });
      }

      map.getCanvas().style.cursor = curr !== undefined ? 'pointer' : 'auto';
    },
  );

  watch(
    () => store.selection,
    (curr, prev) => {
      if (prev !== undefined) {
        map.setFeatureState(
          { source: 'nl', sourceLayer: prev.type, id: prev.id },
          { selection: false },
        );
      }

      if (curr !== undefined) {
        map.setFeatureState(
          { source: 'nl', sourceLayer: curr.type, id: curr.id },
          { selection: true },
        );
      }
    },
  );

  function rerenderChoropleth(): void {
    const { regionType, dataField, minColorRatio, maxColorRatio } = store;

    map.setLayoutProperty('gemeente', 'visibility', 'none');
    map.setLayoutProperty('wijk', 'visibility', 'none');
    map.setLayoutProperty('buurt', 'visibility', 'none');

    map.setLayoutProperty('gemeente-outline', 'visibility', 'none');
    map.setLayoutProperty('wijk-outline', 'visibility', 'none');
    map.setLayoutProperty('buurt-outline', 'visibility', 'none');

    map.setLayoutProperty(regionType, 'visibility', 'visible');
    map.setLayoutProperty(`${regionType}-outline`, 'visibility', 'visible');

    const colorCount = 8;
    const colors = schemeReds[colorCount];
    const step = (maxColorRatio - minColorRatio) / colorCount;

    const fillColorExpression: Expression = ['case'];

    for (let i = 0; i < colorCount - 1; i++) {
      const max = minColorRatio + (i + 1) * step;
      const color = colors[i];

      fillColorExpression.push(['<', ['get', dataField], max], color);
    }

    fillColorExpression.push(colors[colorCount - 1]);

    map.setPaintProperty(regionType, 'fill-color', fillColorExpression);
  }

  onMounted(async () => {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoib3N2b2RlZiIsImEiOiJjazNwbjNlMWUwNGtkM2Vtb253MjM3cXhvIn0.A9Qebgu0gf2BlndYixeeOw';

    map = new mapboxgl.Map({
      container: container.value as HTMLDivElement,
      bounds: [3.366, 50.754, 7.227, 53.54],
      fitBoundsOptions: { padding: 20 },
      hash: true,
      projection: { name: 'mercator' },
      minZoom: 6,
      customAttribution: '<a href="https://www.cbs.nl/">© CBS</a>',
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

    function prepareData(raw: any, type: RegionType): Regions {
      const regions: Regions = {};

      for (const rawRegion of raw) {
        const id = rawRegion[0];

        regions[id] = {
          id,
          type,
          name: rawRegion[1],
          total: rawRegion[2],
          nonWesternTotal: rawRegion[3],
          westernTotal: rawRegion[4],
          morocco: rawRegion[5],
          antillesAndAruba: rawRegion[6],
          surinam: rawRegion[7],
          turkey: rawRegion[8],
        };
      }

      return regions;
    }

    map.addSource('nl', {
      type: 'vector',
      tiles: ['https://territory-tiles-788001ea708e.herokuapp.com/data/nl/{z}/{x}/{y}.pbf'],
      maxzoom: 14,
      promoteId: 'id',
    });

    const fillLayer = {
      type: 'fill',
      slot: 'top',
      paint: {
        'fill-color': 'rgba(0, 0, 0, 0)',
        'fill-opacity': 0.75,
        'fill-antialias': false,
      },
    };

    const outlineLayer = {
      type: 'line',
      slot: 'top',
      paint: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'selection'], false],
          'rgba(32, 32, 32, 1)',
          ['boolean', ['feature-state', 'hover'], false],
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 0.15)',
        ],
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'selection'], false],
          2,
          ['boolean', ['feature-state', 'hover'], false],
          0.5,
          0.5,
        ],
      },
    };

    map.addLayer({
      ...fillLayer,
      'id': 'gemeente',
      'source': 'nl',
      'source-layer': 'gemeente',
    } as AnyLayer);

    map.addLayer({
      ...outlineLayer,
      'id': 'gemeente-outline',
      'source': 'nl',
      'source-layer': 'gemeente',
    } as AnyLayer);

    map.addLayer({
      ...fillLayer,
      'id': 'wijk',
      'source': 'nl',
      'source-layer': 'wijk',
    } as AnyLayer);

    map.addLayer({
      ...outlineLayer,
      'id': 'wijk-outline',
      'source': 'nl',
      'source-layer': 'wijk',
    } as AnyLayer);

    map.addLayer({
      ...fillLayer,
      'id': 'buurt',
      'source': 'nl',
      'source-layer': 'buurt',
    } as AnyLayer);

    map.addLayer({
      ...outlineLayer,
      'id': 'buurt-outline',
      'source': 'nl',
      'source-layer': 'buurt',
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

      const id = hoveredFeature!.properties!.id as string;

      store.hover = populationData[store.regionType]?.[id];
    });

    map.on('mouseout', () => {
      store.hover = undefined;
    });

    map.on('movestart', () => {
      store.hover = undefined;
    });

    map.on('click', e => {
      const clickedFeatures = map.queryRenderedFeatures(e.point, {
        layers: ['gemeente', 'wijk', 'buurt'],
      });

      const clickedFeature = clickedFeatures[0];

      if (clickedFeature === undefined) {
        store.selection = undefined;
        return;
      }

      const id = clickedFeature!.properties!.id as string;

      store.selection = populationData[store.regionType]?.[id];
    });

    populationData = {
      gemeente: prepareData(data[0], 'gemeente'),
      wijk: prepareData(data[1], 'wijk'),
      buurt: prepareData(data[2], 'buurt'),
    };

    rerenderChoropleth();
  });

  onUnmounted(() => {
    map.remove();
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
