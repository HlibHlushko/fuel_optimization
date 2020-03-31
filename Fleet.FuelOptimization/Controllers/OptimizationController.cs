
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
        [HttpGet("test")]
        public OutputData OptimizeTest()
        {

            // InputData data = new InputData(new int[] { 300, 270, 300, 50, 500, 70, 68, 100 },
            //     new double[] { 30, 30, 30, 30, 30, 30, 30, 30 }, 600, 200, 100);
            InputData data = new InputData
            {
                Costs = new double[] { 22, 12, 1, 1, 1, 1, 1, 1, 1 },
                Volumes = new double[] { 2, 1, 1, 1, 1, 1, 1, 2, 2 },
                Tank = 630,
                Remainder = 2,
                MinimumRemainder = 0
            };
            return _optimization.Optimize(data);

        }
    }
}
