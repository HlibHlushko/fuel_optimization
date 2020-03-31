import { Coords } from "./basic";
import { Point, Feature, LineString, Polygon, FeatureCollection } from "@turf/turf";

export interface Credentials {
  id: string,
  code: string
}

export type LinkId = string | number

export interface Link {
  linkId: LinkId
  shape: number[]
}

export type Waypoint = Coords

export interface RouteResponse {
  response: {
    route: {
      shape: number[],
      summary: { distance: number }
    }[]
  }
}

export interface Geometry {
  geometry: string,
  junctionLinkId: LinkId,
  junctionLocation: string,
  distanceToReach: number,
  attributes: FuelStationAttributes,
  partOfRoute: boolean
}

export interface RouteIsolineResponse {
  response: {
    route: {
      leg: { link: Link[] }[],
      searchResult: { geometries: Geometry[] }
    }[]
  }
}

export interface FuelStation {
  latlng: Coords,
  name: string,
  junctionLatLng: Coords,
  junctionLinkId: LinkId,
  distanceToReach: number,
  partOfRoute: boolean,
  attributes: FuelStationAttributes
  isDiesel: boolean
}

export interface Info {
  partOfRoute: boolean,
  overlapBounds: Feature<Polygon>,
  intersections: FeatureCollection<Point>,
  fromJunkToFs: Feature<LineString>,
  fromFsToLastIntersection: Feature<LineString>,
  overlap: FeatureCollection<LineString>,
  overlapPoint: Feature<Point>,
  points: {
    dp: Feature<Point>,
    jp: Feature<Point>,
    fsp: Feature<Point>,
    lp: Feature<Point>
  },
  dists: {
    distFromStartToJunc: number,
    distFromJuncToFs: number,
    distFromJuncToFsFromReq: number,
    distfromFsToOverlap: number,
    distFromOverlapToEnd: number
  },
  error: string
}

export interface FuelStationInfo {
  fs: FuelStation,
  info: Info
}

export interface FuelStationInfos {
  departCoords: Coords,
  destCoords: Coords,
  distance: number,
  route: Feature<LineString>,
  infos: FuelStationInfo[],
}

export interface FuelStationAttributes {
  DIESEL: string,
  NAMES: string,
  SIDE_OF_STREET: 'L' | 'R',
  OPEN_24_HOURS: 'y' | 'n',
  PRIVATE_ACCESS: 'y' | 'n',
  LINK_ID: string
}
