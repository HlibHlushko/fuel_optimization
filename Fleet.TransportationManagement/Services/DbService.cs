using System.Collections.Generic;
using Fleet.TransportationManagement.Dtos;
using Fleet.TransportationManagement.Models;
using Fleet.TransportationManagement.Services.Interfaces;
using System.Net.Http;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Fleet.TransportationManagement.Services
{
    public class DbService : IDbService
    {
        readonly TmContext _ctx;
        readonly IHttpClientFactory _clientFactory;

        public DbService(TmContext context, IHttpClientFactory clientFactory)
        {
            _ctx = context;
            _clientFactory = clientFactory;
        }
        public async Task<int> CreateTripAsync(Trip trip)
        {
            _ctx.Trips.Add(trip);
            return await _ctx.SaveChangesAsync();
        }
        public async Task<int> AddOptimizedPointsAsync(string tripId, List<Point> points)
        {
            var point = (await _ctx.Trips.FirstOrDefaultAsync(x => x.Id == tripId));
            point.OptimizedPoints = points;
            return await _ctx.SaveChangesAsync();
        }
        public async Task<Trip> GetTripAsync(string tripId)
        {
            return await _ctx.Trips.FirstOrDefaultAsync(t => t.Id == tripId);
        }

    }
}