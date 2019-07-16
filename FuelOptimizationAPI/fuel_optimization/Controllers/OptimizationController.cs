using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Database;
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
    }
}