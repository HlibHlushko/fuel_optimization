using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fleet.FuelStationsCore.Dtos;
using Fleet.FuelStationsCore.Services;
using Fleet.FuelStationsCore.Services.CollectApi;
using Microsoft.AspNetCore.Mvc;

namespace Fleet.FuelStationsCore.Controllers
{
    [Route("fuel-price")]
    [ApiController]
    public class FuelPricesController : ControllerBase
    {
        private readonly DbService _db;
        private readonly CollectApiService _collectApiServise;

        private string GetUserIdFromHeader() => Request.Headers["X-UserId"];
        private string GetRoleFromHeader() => Request.Headers["X-Role"];

        public FuelPricesController(DbService db, CollectApiService collectApiService)
        {
            _db = db;
            _collectApiServise = collectApiService;
        }

        [HttpGet("test")]
        public async Task<ActionResult> GetGasPrices()
        {
            await _collectApiServise.GetAndInsertGasPricesAsync();
            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult<List<FuelPriceDto>>> GetFuelPrices()
        {
            return (await _db.GetAllFuelPricesAsync(GetUserIdFromHeader()))
                .Select(fp => FuelPriceDto.From(fp))
                .ToList();
        }

        [HttpPost]
        public async Task<ActionResult> PostFuelPrice([FromBody] List<CreateFuelPriceDto> prices)
        {
            foreach (var p in prices)
            {
                var country = await _db.GetCountryAsync(p.CountryId);
                var net = await _db.GetNetworkAsync(p.NetworkId);
                _db.CreateOrUpdateFuelPrice(p.To(GetUserIdFromHeader(), country, net));
                await _db.SaveChangesAsync();
            }

            return Ok();
        }
    }
}