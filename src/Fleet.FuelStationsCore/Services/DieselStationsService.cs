using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Fleet.FuelStationsCore.Services.HereApi;

namespace Fleet.FuelStationsCore.Services
{
    public class DieselStationsService
    {
        private readonly ILogger _logger;
        private readonly DbService _db;
        private readonly HereApiClient _here;

        public DieselStationsService(ILogger<DieselStationsService> logger, DbService db, HereApiClient here)
        {
            _logger = logger;
            _db = db;
            _here = here;
        }

        public async Task Test(int detour, List<Coord> waypoints)
        {
            if (detour > 10000)
            {
                throw new ArgumentException("detour must be less than 10 km");
            }

            _logger.LogInformation($"got ds request with detour ({detour}) and coords ({string.Join(';', waypoints.Select(wp => $"{wp.Lat},{wp.Lng}"))})");

            var route = await _here.GetRouteAsync(waypoints);
            var d = await _here.GetDieselStationsAlongCorridorAsync(100, route.Id);
            var ds = await _here.GetAddressesAtLocationsAsync(waypoints);
        }

        public async Task<DieselStationInfos> GetDieselStationsAlongRouteAsync(int detour, List<Coord> waypoints)
        {
            var route = await _here.GetRouteAsync(waypoints);
            var dieselStations = await _here.GetDieselStationsAlongCorridorAsync(detour / 2, route.Id);

            return new DieselStationInfos
            {
                DepartCoords = route.Waypoints[0].MappedPosition,
                DestCoords = route.Waypoints[route.Waypoints.Count - 1].MappedPosition,
                Distance = route.Distance,
                Route = route.Shape,
                Infos = dieselStations.Select(ds => new DieselStationInfo
                {
                    Station = ds,
                    Info = new { }
                }).ToList()
            };
        }

        public async Task<IEnumerable<AddressWithMatchLevel>> GetAddresses(List<Coord> coords) => await _here.GetAddressesAtLocationsAsync(coords);
    }
}