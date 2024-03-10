import type { DataField, RegionType } from '@/types';
import { defineStore } from 'pinia';

interface Tooltip {
  title: string;
  content: string;
  x: number;
  y: number;
}

export interface State {
  regionType: RegionType;
  dataField: DataField;
  tooltip: Tooltip | undefined;
}

export const useStore = defineStore('store', {
  state: (): State => {
    return {
      regionType: 'gemeente',
      dataField: 'nonWesternTotal',
      tooltip: undefined,
    };
  },
});
