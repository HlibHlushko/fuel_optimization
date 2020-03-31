import { Coords } from "./basic";
import { FuelStationInfo } from "./here";

export enum POIType { Waypoint, FuelStation }

export type POIInfo = FuelStationInfo

export interface POI {
  type: POIType,
  info: POIInfo,
  junction0: Coords,
  junction1: Coords,
  name: string,
  coords: Coords,
  distanceToNextPoint: number
}
