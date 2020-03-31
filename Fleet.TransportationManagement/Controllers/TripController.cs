using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Fleet.TransportationManagement.Services.Interfaces;
using Fleet.TransportationManagement.Models;
using Fleet.TransportationManagement.Dtos;
using System.Linq;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using Fleet.TransportationManagement.Services;
using System.Threading.Tasks;

namespace Fleet.TransportationManagement.Controllers
{
    [Route("trip")]
    [ApiController]
    public class TripController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly IDbService _dbService;
        private readonly IHttpClientFactory _clientFactory;
        private readonly FuelOptimizationService _fuelOptimizationService;

        private string GetUserIdFromHeader() => Request.Headers["X-UserId"];
        private string GetRoleFromHeader() => Request.Headers["X-Role"];

        public TripController(IDbService dbService, FuelOptimizationService fuelOptimizationService, IHttpClientFactory clientFactory, ILogger<TripController> logger)
        {
            _logger = logger;
            _dbService = dbService;
            _clientFactory = clientFactory;
            _fuelOptimizationService = fuelOptimizationService;
        }


        [HttpPost]
        public async Task<ActionResult> CreateTrip(GetTripDto tripDto)
        {
            Trip newTrip = Trip.From(tripDto);
            await _dbService.CreateTripAsync(newTrip);
            _fuelOptimizationService.StartOptimization(newTrip);
            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<SendTripDto> GetTrip(string id)
        {
            return new SendTripDto(await _dbService.GetTripAsync(id));
        }
    }
}
