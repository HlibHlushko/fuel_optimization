using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Fleet.TransportationManagement.Dtos;
using Fleet.TransportationManagement.Hubs;
using Fleet.TransportationManagement.Hubs.Interfaces;
using Fleet.TransportationManagement.Models;
using Fleet.TransportationManagement.Services.Interfaces;

namespace Fleet.TransportationManagement.Services
{
    public class FuelOptimizationService
    {
        private readonly ILogger _logger;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly IHubContext<NotificationHub, INotificationClient> _hubContext;

        public FuelOptimizationService(ILogger<FuelOptimizationService> logger, IServiceScopeFactory scopeFactory, IHubContext<NotificationHub, INotificationClient> hubContext)
        {
            _logger = logger;
            _serviceScopeFactory = scopeFactory;
            _hubContext = hubContext;
        }
        public void StartOptimization(Trip trip)
        {
            // _hubContext.Clients.Group(trip.UserId).ReceiveTripUpdate(trip.Id, "loading", null);

            Task.Run(async () =>
            {
                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    IHttpClientFactory clientFactory = scope.ServiceProvider.GetRequiredService<IHttpClientFactory>();

                    var (stations, optimization) = await CreateFuelData(trip, clientFactory);
                    _logger.LogInformation(JsonConvert.SerializeObject(optimization));
                    HttpClient optimizationClient = clientFactory.CreateClient("fuelOptimization");

                    OptimizationData res = await (await optimizationClient.PostAsync("/optimization", new StringContent(JsonConvert.SerializeObject(optimization), Encoding.UTF8, "application/json"))).Content.ReadAsAsync<OptimizationData>();
                    var optPoints = CreateResult(res, stations, trip);

                    IDbService dbService = scope.ServiceProvider.GetRequiredService<IDbService>();
                    await dbService.AddOptimizedPointsAsync(trip.Id, optPoints);

                    _logger.LogInformation(JsonConvert.SerializeObject(optimization));

                    // await _hubContext.Clients.Group(trip.UserId).ReceiveTripUpdate(trip.Id, "done", optPoints);
                    // await _hubContext.Clients.Group(trip.DriverId.ToString()).ReceiveTripUpdate(trip.Id, "done", optPoints);
                }
            });
        }
        private List<Point> CreateResult(OptimizationData res, GetFuelStationsDto[] stations, Trip trip)
        {
            List<Point> result = new List<Point>();
            int currentPoint = 0;
            int currentStation = 0;
            for (int i = 0; i < stations.Length; ++i)
            {
                if (stations[i].Type == StationType.Waypoint)
                {
                    result.Add(trip.InputPoints[currentPoint++].GetCopy());
                }
                else
                {
                    if (res.Refuels[currentStation] < 1e-5)
                    {
                        currentStation++;
                        continue;
                    }
                    var station = stations[i];
                    var fsPoint = new Point
                    {
                        Name = station.Name,
                        Address = station.Address,
                        Refuel = Math.Round(res.Refuels[currentStation], 3),
                        Longitude = station.Coords.Lng,
                        Latitude = station.Coords.Lat,
                        Type = PointType.FuelStation,
                        Cost = station.Cost,
                        Remainder = res.Remainders[currentStation++]
                    };
                    if (station.Junction0 is null)
                    {
                        result.Add(fsPoint);
                    }
                    else
                    {
                        result.AddRange(new[] {
                            new Point
                            {
                                Longitude = station.Junction0.Lng,
                                Latitude = station.Junction0.Lat,
                                Type = PointType.Junction
                            },
                            fsPoint,
                            new Point
                            {
                                Longitude = station.Junction1.Lng,
                                Latitude = station.Junction1.Lat,
                                Type = PointType.Junction
                            }
                        });
                    }
                }
            }
            _logger.LogDebug(JsonConvert.SerializeObject(result));
            return result;
        }
        private async Task<(GetFuelStationsDto[], FuelOptimizationInput)> CreateFuelData(Trip trip, IHttpClientFactory clientFactory)
        {
            HttpClient fuelStationsClient = clientFactory.CreateClient("fuelStations");
            // fuelStationsClient.DefaultRequestHeaders.Add("X-UserId", userId);
            GetFuelStationsDto[] res = null;
            try
            {
                var response = await fuelStationsClient.PostAsJsonAsync("/ds", new
                {
                    Detour = 500,
                    Waypoints = trip.InputPoints.Select(p => new { Lat = p.Latitude, Lng = p.Longitude })
                });
                response.EnsureSuccessStatusCode();

                res = await response.Content.ReadAsAsync<GetFuelStationsDto[]>();
            }
            catch (Exception e)
            {
                Console.WriteLine(e); // Пиши в базу шо фейл і апдейть нотифікацію
                throw new Exception(e.Message);
            }

            var (volumes, costs, residualFuel) = CalculateVolumes(trip, res);
            if (residualFuel <= 0)
            {
                throw new Exception("Residual fuel is inefficient to reach any gas station :/ Optimization will keep going forever, nice.");
            }
            return (res, new FuelOptimizationInput
            {
                Volumes = volumes,
                Costs = costs,
                Tank = trip.Car.Tank,
                Remainder = (int)residualFuel,
            });
        }
        private (double[], double[], double) CalculateVolumes(Trip trip, GetFuelStationsDto[] stations)
        {
            List<double> volumes = new List<double>();
            List<double> costs = new List<double>();


            for (int i = 0; i < stations.Count(); i++)
            {
                var station = stations[i];
                var volume = ConvertDistanceToVolume(station.DistanceToNextPoint, trip.Car.Consumption);
                if (station.Type == StationType.Waypoint)
                {
                    if (volumes.Count != 0)
                    {
                        volumes[volumes.Count - 1] += volume;
                    }
                }
                else
                {
                    volumes.Add(volume);
                    costs.Add(station.Cost);
                }
            }
            // volumes[volumes.Count - 1] ;

            var volumeNeededToReachFirstFS = ConvertDistanceToVolume(stations[0].DistanceToNextPoint, trip.Car.Consumption);

            return (volumes.ToArray(), costs.ToArray(), trip.ResidualFuel - volumeNeededToReachFirstFS);
        }
        private double ConvertDistanceToVolume(double distance, int consumption) => distance / 1000 * consumption;
    }
}