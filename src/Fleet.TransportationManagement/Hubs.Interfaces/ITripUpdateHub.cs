using System.Threading.Tasks;
using Fleet.TransportationManagement.Models;
namespace Fleet.TransportationManagement.Hubs.Interfaces
{
    public interface ITripUpdateHub
    {
        Task UpdateTrip(Trip trip);
    }
}