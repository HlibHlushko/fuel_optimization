using Database;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Newtonsoft.Json;
using System.Collections.Generic;
using DataTransferObjects;
namespace fuel_optimization.Controllers
{
  [Route("api/")]
  [ApiController]
  public class OptimizationController : ControllerBase
  {
    readonly IdbData _dbData;
    readonly IOptimization _optimization;
    public OptimizationController(IdbData dbData, IOptimization optimization)
    {
      _dbData = dbData;
      _optimization = optimization;
    }
    [HttpGet("GetTrucks")]
    public List<Truck> GetTrucks()
    {
      return _dbData.GetTrucks();
    }
    [HttpGet("GetBrands")]
    public List<Brand> GetBrands()
    {
      return _dbData.GetBrands();
    }
    [HttpPost("hook")]
    public List<OutputPoint> Optimization(Input input)
    {
      return _optimization.StartOptimization(input);
    }

  }
}