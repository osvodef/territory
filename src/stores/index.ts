import type { DataField, RegionType } from '@/types';
import { defineStore } from 'pinia';

interface Hover {
  regionType: RegionType;
  id: string;
  title: string;
  content: string;
  x: number;
  y: number;
}

export interface State {
  regionType: RegionType;
  dataField: DataField;
  hover: Hover | undefined;
}

export const useStore = defineStore('store', {
  state: (): State => {
    return {
      regionType: 'gemeente',
      dataField: 'nonWesternTotal',
      hover: undefined,
    };
  },
});
