using Fleet.TransportationManagement.Hubs.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Fleet.TransportationManagement.Hubs
{
    public class NotificationHub : Hub<INotificationClient>
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext.Request.Headers["X-UserId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, userId.ToString());
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext.Request.Headers["X-UserId"];
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId.ToString());
            await base.OnDisconnectedAsync(exception);
        }
    }
}
