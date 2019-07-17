using Database;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Newtonsoft.Json;
using System.Collections.Generic;
namespace fuel_optimization.Controllers
{
    [Route("api/")]
    [ApiController]
    public class OptimizationController : ControllerBase
    {
        public readonly IdbData _dbData;
        public OptimizationController(IdbData dbData)
        {
            _dbData = dbData;
        }
        [HttpGet("trucks")]
        public List<Truck> GetTrucks()
        {
            return _dbData.GetTrucks();
        }
        [HttpGet("GetBrands")]
        public List<Brand> GetBrands()
        {
            return _dbData.GetBrands();
        }
    }
}