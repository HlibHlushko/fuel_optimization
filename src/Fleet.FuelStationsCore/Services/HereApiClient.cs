using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace Fleet.FuelStationsCore.Services.HereApi
{
    public class HereApiOptions
    {
        public string AppId { get; set; }
        public string AppCode { get; set; }
        public string GeocoderUrl { get; set; }
        public string RouterUrl { get; set; }
        public string CorridorSearchUrl { get; set; }
    }

    public class HereApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly HereApiOptions _options;

        public HereApiClient(HttpClient client, IOptions<HereApiOptions> options)
        {
            _httpClient = client;
            _options = options.Value;
        }

        public async Task<HereRoute> GetRouteAsync(List<Coord> waypoints)
        {
            HereRoute route = null;
            try
            {
                var queryParams = new List<string>()
                {
                    "app_id=" + _options.AppId,
                    "app_code=" + _options.AppCode,
                    "mode=fastest;car;traffic:disabled",
                    "routeAttributes=waypoints,summary,shape,legs,notes,routeId",
                    "jsonAttributes=33"
                };
                queryParams.AddRange(waypoints.Select((wp, i) => "waypoint" + i + "=geo!" + wp.Lat + "," + wp.Lng));

                var response = await _httpClient.GetAsync(_options.RouterUrl + '?' + string.Join('&', queryParams));

                response.EnsureSuccessStatusCode();

                var routeResponse = await response.Content.ReadAsAsync<RouterResponse>();

                route = new HereRoute
                {
                    Id = routeResponse.Response.Route[0].RouteId,
                    Distance = routeResponse.Response.Route[0].Summary.Distance,
                    Waypoints = routeResponse.Response.Route[0].Waypoint.Select(wp => new Waypoint
                    {
                        LinkId = wp.LinkId,
                        MappedPosition = new Coord { Lat = wp.MappedPosition.Latitude, Lng = wp.MappedPosition.Longitude },
                        OriginalPosition = new Coord { Lat = wp.OriginalPosition.Latitude, Lng = wp.OriginalPosition.Longitude },
                        Type = wp.Type,
                        Spot = wp.Spot,
                        SideOfStreet = wp.SideOfStreet
                    }).ToList(),
                    Shape = routeResponse.Response.Route[0].Shape
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return route;
        }

        private StationName[] ExtractNames(string names)
        {
            var ns = names.Split('\u001D');
            var stationNames = new StationName[ns.Length];
            for (int i = 0; i < ns.Length; i++)
            {
                var name = ns[i];

                var nameTextSplit = name.Split('\u001E');
                var nameText = nameTextSplit[0];
                var translitsObj = new Dictionary<string, string>();
                var phonemesObj = new Dictionary<string, (string, string)>();

                var languageCode = nameText.Substring(0, 3);
                var nameType = nameText.Substring(3, 1);
                bool isExonym = string.Compare(nameText.Substring(4, 1), "y", true) >= 0;
                var text = nameText.Substring(5, nameText.Length - 5);

                if (nameTextSplit.Length > 1)
                {
                    var translits = nameTextSplit[1].Split(';');
                    for (int j = 0; j < translits.Length; j++)
                    {
                        var lcode = translits[j].Substring(0, 3);
                        var tr = translits[j].Substring(3, translits[j].Length - 3);
                        translitsObj.Add(lcode, tr);
                    }
                }

                if (nameTextSplit.Length > 2)
                {
                    var phonemes = nameTextSplit[2].Split(';');
                    for (int j = 0; j < phonemes.Length; j++)
                    {
                        var lcode = phonemes[j].Substring(0, 3);
                        var pr = phonemes[j].Substring(3, 1);
                        var ph = phonemes[j].Substring(4, phonemes[j].Length - 4);
                        phonemesObj.Add(lcode, (pr, ph));
                    }
                }

                stationNames[i] = new StationName
                {
                    LanguageCode = languageCode,
                    NameType = nameType,
                    IsExonym = isExonym,
                    Text = text,
                    Translits = translitsObj,
                    Phonemes = phonemesObj
                };
            }
            return stationNames;
        }
        public async Task<List<DieselStation>> GetDieselStationsAlongCorridorAsync(int radius = 500, string routeId = null, string corridor = null)
        {
            List<DieselStation> dieselStations = null;
            try
            {
                var queryParams = new List<string>
                {
                    "app_id=" + _options.AppId,
                    "app_code=" + _options.AppCode,
                    "layer_ids=FUELSTATION_POI",
                    "geom=local",
                    "radius=" + radius,
                    "key_attributes=LINK_ID",
                    "attributes=POI_ID;NAMES;DIESEL;PRIVATE_ACCESS"
                };
                if (corridor != null)
                {
                    queryParams.Add("corridor=" + corridor); // format -> 52.49998,13.39997;52.49996,13.39999;52.49986,13.40002;
                }
                else if (routeId != null)
                {
                    queryParams.Add("route_id=" + routeId);
                    queryParams.Add("mode=fastest;car;traffic:disabled");
                }
                else throw new ArgumentException("Either corridor or routeId parameter must be specified");

                var response = await _httpClient.GetAsync(_options.CorridorSearchUrl + '?' + string.Join('&', queryParams));

                response.EnsureSuccessStatusCode();

                var searchResponse = await response.Content.ReadAsAsync<CorridorSearchResponse>();
                dieselStations = searchResponse.Geometries
                    .Where(g => (g.Attributes.DIESEL != null && g.Attributes.DIESEL[0] == 'y') && (g.Attributes.PRIVATE_ACCESS != null && g.Attributes.PRIVATE_ACCESS[0] == 'n'))
                    .Select(g => new DieselStation
                    {
                        Name = ExtractNames(g.Attributes.NAMES),
                        PoiId = g.Attributes.POI_ID,
                        Latlng = new Coord { Lat = g.NearestLat, Lng = g.NearestLon },
                        Distance = g.Distance
                    }).ToList();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return dieselStations;
        }

        public async Task<IEnumerable<AddressWithMatchLevel>> GetAddressesAtLocationsAsync(List<Coord> coords)
        {
            const int maxLocationsNumber = 100;

            var addresses = new List<AddressWithMatchLevel>(coords.Count);
            try
            {
                for (var i = 0; i < coords.Count / maxLocationsNumber + 1; i++)
                {
                    string payload = string.Join("\r\n",
                        coords.Select((c, j) => $"id={j++.ToString("0000")}&prox={c.Lat.ToString("0.####")},{c.Lng.ToString("0.####")},10"));

                    var response = await _httpClient.PostAsync(_options.GeocoderUrl + '?' + string.Join('&', new[]
                            {
                                "app_id=" + _options.AppId,
                                "app_code=" + _options.AppCode,
                                "mode=retrieveAddresses",
                                "jsonattributes=1",
                                "minresults=3",
                                "gen=9"
                            }),
                        new StringContent(payload, Encoding.UTF8, "text/plain"));

                    response.EnsureSuccessStatusCode();

                    var geoResponse = await response.Content.ReadAsAsync<GeocoderResponse>();
                    for (int j = 0; j < geoResponse.Response.Item.Count; j++)
                    {
                        var item = geoResponse.Response.Item[j];
                        Result bestStreetMatch = null, bestHouseMatch = null;
                        item.Result.ForEach(r =>
                        {
                            if (r.MatchLevel == "houseNumber" && (bestHouseMatch == null || r.Distance < bestHouseMatch.Distance))
                            {
                                bestHouseMatch = r;
                            }
                            if (r.MatchLevel == "street" && (bestStreetMatch == null || (bestStreetMatch.Location.Address.Street is null && r.Location.Address.Street != null) || r.Distance < bestStreetMatch.Distance))
                            {
                                bestStreetMatch = r;
                            }
                        });

                        Result match = bestHouseMatch != null ? bestHouseMatch : bestStreetMatch != null ? bestStreetMatch : item.Result[0];
                        addresses.Add(new AddressWithMatchLevel
                        {
                            Address = match.Location.Address,
                            MatchLevel = match.MatchLevel
                        });
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return addresses;
        }
    }
}