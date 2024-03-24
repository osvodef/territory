export type DataField =
  | 'westernTotal'
  | 'nonWesternTotal'
  | 'morocco'
  | 'antillesAndAruba'
  | 'surinam'
  | 'turkey'
  | 'total';

export type RegionType = 'gemeente' | 'wijk' | 'buurt';

export interface Region {
  id: string;
  name: string;
  total: number;
  westernTotal: number;
  nonWesternTotal: number;
  morocco: number;
  antillesAndAruba: number;
  surinam: number;
  turkey: number;
}

export type Regions = { [id: string]: Region };
