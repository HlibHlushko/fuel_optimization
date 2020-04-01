using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Fleet.FuelStationsCore.Dtos;
using Fleet.FuelStationsCore.Services;
using Fleet.FuelStationsCore.Services.HereApi;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Fleet.FuelStationsCore.Controllers
{
    [Route("ds")]
    [ApiController]
    public class DieselStationsController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly DieselStationsService _ds;
        private readonly DbService _db;

        public DieselStationsController(DieselStationsService ds, DbService db, IHttpClientFactory clientFactory)
        {
            _ds = ds;
            _db = db;
            _clientFactory = clientFactory;
        }

        public enum StationType
        {
            Waypoint,
            FuelStation
        }
        public class Coords
        {
            public double Lat { get; set; }
            public double Lng { get; set; }
        }
        public class GetFuelStationsDto
        {
            public StationType Type { get; set; }
            public string Name { get; set; }
            public Coords Coords { get; set; }
            public Coords Junction0 { get; set; }
            public Coords Junction1 { get; set; }
            public double DistanceToNextPoint { get; set; }
        }
        public class NewGetFuelStationsDto : GetFuelStationsDto
        {
            public double Cost { get; set; }
            public string Address { get; set; }
        }
        [HttpPost]
        public async Task<ActionResult> PostDieselStationsRequestProxy([FromBody] DieselStationsRequestDto request)
        {
            // await _ds.Test(request.Detour, request.Waypoints);

            var c = _clientFactory.CreateClient();
            c.Timeout = new TimeSpan(1, 0, 0);
            var query = "/ds/" + request.Detour + "/" + request.Waypoints.Aggregate(new StringBuilder(), (q, point) => q.Append(point.Lat.ToString("N7") + ',' + point.Lng.ToString("N7") + '/'));
            query = query.Substring(0, query.Length - 1);
            GetFuelStationsDto[] res = null;
            try
            {
                var r = await c.GetAsync("http://fuel_stations:8000" + query);
                r.EnsureSuccessStatusCode();
                string fres = await r.Content.ReadAsStringAsync();
                res = JsonConvert.DeserializeObject<GetFuelStationsDto[]>(fres);
            }
            catch (Exception e)
            {
                return BadRequest("Error in Fuel Stations: " + e.Message);
            }

            NewGetFuelStationsDto[] ress = new NewGetFuelStationsDto[res.Length];

            var addresses = (await _ds.GetAddresses(res.Select(g => new Coord { Lat = g.Coords.Lat, Lng = g.Coords.Lng }).ToList())).ToList();
            var costs = await _db.GetFuelPricesForNetworkNameAsync(Request.Headers["X-UserId"], "Default");
            var options = new JsonSerializerSettings { ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() } };
            for (int i = 0; i < res.Length; i++)
            {
                var address = addresses[i];
                var cc = costs.FirstOrDefault(ccc => ccc.Country.Code == address.Address.Country);
                ress[i] = new NewGetFuelStationsDto
                {
                    Type = res[i].Type,
                    Name = res[i].Name,
                    Address = address.MatchLevel == "houseNumber" || (address.MatchLevel == "street" && !string.IsNullOrEmpty(address.Address.Street))
                        ? "\"" + JsonConvert.SerializeObject(address, options) + "\""
                        : null,
                    Coords = res[i].Coords,
                    Junction0 = res[i].Junction0,
                    Junction1 = res[i].Junction1,
                    DistanceToNextPoint = res[i].DistanceToNextPoint,
                    Cost = cc is null ? 30 : cc.Price
                };
            }

            return Ok(ress);
        }

        [HttpPost("new")]
        public async Task<ActionResult> PostDieselStationsRequest([FromBody] DieselStationsRequestDto request)
        {
            return Ok(await _ds.GetDieselStationsAlongRouteAsync(request.Detour, request.Waypoints));
        }
    }
}