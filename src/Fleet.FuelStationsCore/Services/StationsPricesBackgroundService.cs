using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fleet.FuelStationsCore.Services.CollectApi;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Fleet.FuelStationsCore.Services
{
    internal class StationsPricesBackgroundService : IHostedService, IDisposable
    {
        private readonly ILogger _logger;
        private readonly IServiceProvider _serviceProvider;
        private Timer _timer;

        public StationsPricesBackgroundService(IServiceProvider serviceProvider, ILogger<StationsPricesBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("StationsPrices Background Service is starting.");

            _timer = new Timer(Do, null, TimeSpan.FromMinutes(1), TimeSpan.FromDays(1));

            return Task.CompletedTask;
        }

        public async void Do (object state)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var collectApiService = scope.ServiceProvider.GetRequiredService<CollectApiService>();
                await collectApiService.GetAndInsertGasPricesAsync();
                _logger.LogInformation("Updated gas prices successfully.");
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("StationsPrices Background Service is stopping.");
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose() => _timer?.Dispose();
    }
}