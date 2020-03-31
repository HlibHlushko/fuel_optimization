using System.Collections.Generic;
using System.Threading.Tasks;
using Fleet.TransportationManagement.Models;

namespace Fleet.TransportationManagement.Hubs.Interfaces
{
    public interface INotificationClient
    {
        Task ReceiveTripUpdate(int tripId, string status, List<Point> points);
    }
}
