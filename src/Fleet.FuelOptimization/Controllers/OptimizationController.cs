
using Microsoft.AspNetCore.Mvc;
using Fleet.FuelOptimization.Services.Interfaces;
using Fleet.FuelOptimization.Dtos;
using Microsoft.Extensions.Logging;
using System.Net.Http;

namespace Fleet.FuelOptimization.Controllers
{
    [Route("optimization")]
    public class OptimizationController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly IOptimization _optimization;
        private readonly IHttpClientFactory _clientFactory;
        public OptimizationController(IOptimization optimization, IHttpClientFactory clientFactory, ILogger<OptimizationController> logger)
        {
            _logger = logger;
            _optimization = optimization;
            _clientFactory = clientFactory;
        }
        [HttpPost]
        public OutputData Optimize([FromBody] InputData data)
        {
            return _optimization.Optimize(data);
        }
    }
}
