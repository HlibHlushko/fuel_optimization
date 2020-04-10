using System.Collections.Generic;
using Fleet.TransportationManagement.Models;
using System.Threading.Tasks;
using Fleet.TransportationManagement.Dtos;
namespace Fleet.TransportationManagement.Services.Interfaces
{
    public interface IDbService
    {
        Task<int> CreateTripAsync(Trip trip);
        Task<int> AddOptimizedPointsAsync(string tripId, List<Point> points, List<Point> noOptPoints);
        Task<Trip> GetTripAsync(string tripId);
    }


}