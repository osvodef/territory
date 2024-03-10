import type { DataField, Region, RegionType } from '@/types';
import { defineStore } from 'pinia';

interface RegionInfo {
  regionType: RegionType;
  region: Region;
}

export interface State {
  regionType: RegionType;
  dataField: DataField;
  hover: RegionInfo | undefined;
  selection: RegionInfo | undefined;
}

export const useStore = defineStore('store', {
  state: (): State => {
    return {
      regionType: 'gemeente',
      dataField: 'nonWesternTotal',
      hover: undefined,
      selection: undefined,
    };
  },
});
