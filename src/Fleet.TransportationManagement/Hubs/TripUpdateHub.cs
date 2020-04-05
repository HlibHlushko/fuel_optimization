using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Fleet.TransportationManagement.Hubs.Interfaces;
using Fleet.TransportationManagement.Models;

namespace Fleet.TransportationManagement.Hubs
{
    public class TripUpdateHub : Hub<ITripUpdateHub>
    {

    }
}