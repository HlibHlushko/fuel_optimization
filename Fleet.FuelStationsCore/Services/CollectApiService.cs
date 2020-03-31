using System;
using System.Linq;
using System.Threading.Tasks;
using Fleet.FuelStationsCore.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Fleet.FuelStationsCore.Services.CollectApi
{
    public class CollectApiService
    {
        private readonly ILogger _logger;
        private readonly DefaultUserOptions _options;
        private readonly CollectApiClient _collectApiClient;
        private readonly DbService _db;
        public CollectApiService(DbService db, CollectApiClient collectApiClient, IOptions<DefaultUserOptions> options, ILogger<CollectApiService> logger)
        {
            _db = db;
            _collectApiClient = collectApiClient;
            _options = options.Value;
            _logger = logger;
        }

        public async Task GetAndInsertGasPricesAsync()
        {
            GasPrices prices = null;
            try
            {
                prices = await _collectApiClient.GetGasPricesAsync();
            }
            catch (Exception e)
            {
                _logger.LogWarning($"Collect API client thrown an error: ${e.GetType().Name} ${e.Message}");
                return;
            }
            if (!prices.Success)
            {
                _logger.LogWarning("Collect API returned unsuccessful result.");
                return;
            }

           var countries = await _db.GetAllCountriesAsync();
           var defaultNetwork = await _db.GetDefaultNetworkAsync();
           var fuelPrices = await _db.GetFuelPricesForNetworkNameAsync(_options.DefaultUserId);

           foreach (var currentCountry in countries)
           {
                var price = prices.Results.FirstOrDefault(p => p.Country.Equals(currentCountry.Name, StringComparison.OrdinalIgnoreCase));
                if (price != null && double.TryParse(price.Diesel.Replace(',', '.'), out var newPrice))
                {
                    if (newPrice == 0)
                    {
                        continue;
                    }

                    var oldPrice = fuelPrices.FirstOrDefault(fp => fp.CountryId == currentCountry.Id);
                    if (oldPrice != null)
                    {
                        oldPrice.Price = newPrice;
                    }
                    else
                    {
                        _db.CreateFuelPrice(new FuelPrice
                        {
                            UserId = _options.DefaultUserId,
                            CountryId = currentCountry.Id,
                            NetworkId = defaultNetwork.Id,
                            Price = newPrice
                        });
                    }
                }
           }

           await _db.SaveChangesAsync();
        }
    }
}
