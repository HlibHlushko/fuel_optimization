import fetch from 'node-fetch'

import { Coords } from '../types/basic'
import { Credentials, RouteResponse, RouteIsolineResponse } from '../types/here'

export const getFuelStationsAsync = (cred: Credentials, departCoords: Coords, destCoords: Coords, detour: number): Promise<RouteIsolineResponse> =>
  fetch('https://cle.api.here.com/2/search/routeisoline.json?' +
    (['layer_ids=FUELSTATION_POI',
      'app_code=' + cred.code,
      'app_id=' + cred.id,
      'waypoint0=' + departCoords.lat + ',' + departCoords.lng,
      'waypoint1=' + destCoords.lat + ',' + destCoords.lng,
      'geom=local',
      'max_detour_distance=' + detour
    ].join('&')))
  .then(res => res.json())

export const getRouteAsync = (cred: Credentials, ...waypoints: Coords[]): Promise<RouteResponse> =>
  fetch('https://route.api.here.com/routing/7.2/calculateroute.json?' +
    (['routeAttributes=waypoints,summary,shape,legs,notes',
      'app_code=' + cred.code,
      'app_id=' + cred.id,
      ...waypoints.map((wp, i) => 'waypoint' + i + '=geo!' + wp.lat + ',' + wp.lng),
      'jsonAttributes=33',
      'legAttributes=none,links',
      'mode=fastest;car;traffic:disabled'
    ].join('&')))
  .then(res => res.json())
