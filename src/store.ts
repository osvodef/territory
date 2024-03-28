import type { DataField, Region, RegionType } from '@/types';
import { defineStore } from 'pinia';

export interface State {
  regionType: RegionType;
  dataField: DataField;
  hover: Region | undefined;
  selection: Region | undefined;
  minColorRatio: number;
  maxColorRatio: number;
}

export const useStore = defineStore('store', {
  state: (): State => {
    return {
      regionType: 'wijk',
      dataField: 'nonWesternTotal',
      hover: undefined,
      selection: undefined,
      minColorRatio: 0,
      maxColorRatio: 0.5,
    };
  },
});
