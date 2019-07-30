/* global fetch */

export const getMapTileUrl = (id, code) => ({
  url: `https://{s}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?app_id=${id}&app_code=${code}&ppi=320`,
  subdomains: '1234'
})

export const getTruckRestrictionTileUrl = (id, code) => ({
  url: `https://{s}.base.maps.api.here.com/maptile/2.1/truckonlytile/newest/normal.day/{z}/{x}/{y}/512/png8?style=fleet&app_id=${id}&app_code=${code}&ppi=320`,
  subdomains: '1234'
})

export const getFuelStationsAsync = (id, code, departCoords, destCoords) => fetch('https://cle.api.here.com/2/search/routeisoline.json?' +
  (['layer_ids=FUELSTATION_POI',
    'app_code=' + code,
    'app_id=' + id,
    'waypoint0=' + departCoords.lat + ',' + departCoords.lng,
    'waypoint1=' + destCoords.lat + ',' + destCoords.lng,
    'geom=local',
    'max_detour_distance=100',
    'trailersCount=1',
    'limitiedweight=20',
    'height=4',
    'length=22',
    'weightPerAxle=10',
    'mode=fastest;truck;traffic:disabled'
  ].join('&')))
  .then(res => res.json())

export const getRouteAsync = (id, code, departCoords, destCoords) => fetch('https://route.api.here.com/routing/7.2/calculateroute.json?' +
    (['routeAttributes=waypoints,summary,shape,legs,notes',
      'app_code=' + code,
      'app_id=' + id,
      'waypoint0=geo!' + departCoords.lat + ',' + departCoords.lng,
      'waypoint1=geo!' + destCoords.lat + ',' + destCoords.lng,
      'jsonAttributes=33',
      'legAttributes=none,links',
      'trailersCount=1',
      'limitiedweight=20',
      'height=4',
      'length=22',
      'weightPerAxle=10',
      'mode=fastest;truck;traffic:disabled'
    ].join('&')))
  .then(res => res.json())
