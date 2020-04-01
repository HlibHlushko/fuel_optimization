using System.Collections.Generic;
using System.Threading.Tasks;
using Fleet.FuelStationsCore.Models;
using Fleet.FuelStationsCore.Services;
using Microsoft.AspNetCore.Mvc;

namespace Fleet.FuelStationsCore.Controllers
{
    [Route("country")]
    [ApiController]
    public class CountriesController : ControllerBase
    {
        private readonly DbService _db;

        public CountriesController(DbService db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<Country>>> GetFuelPrices()
        {
            return await _db.GetAllCountriesAsync();
        }
    }
}
