using System.Collections.Generic;
using System.Threading.Tasks;
using Fleet.FuelStationsCore.Models;
using Fleet.FuelStationsCore.Services;
using Microsoft.AspNetCore.Mvc;

namespace Fleet.FuelStationsCore.Controllers
{
    [Route("network")]
    [ApiController]
    public class FsNetworksController : ControllerBase
    {
        private readonly DbService _db;

        public FsNetworksController(DbService db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<FsNetwork>>> GetFuelPrices()
        {
            return await _db.GetAllNetworksAsync();
        }
    }
}