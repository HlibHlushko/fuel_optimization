using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using Fleet.FuelStationsCore.Models;

namespace Fleet.FuelStationsCore.Services
{
    public class DefaultUserOptions
    {
        public string DefaultUserId { get; set; }
    }
    public class DbService
    {
        private const string DEFAULT_NETWORK_NAME = "Default";

        private readonly FsContext _ctx;
        private readonly DefaultUserOptions _options;
        public DbService(FsContext context, IOptions<DefaultUserOptions> options)
        {
            _ctx = context;
            _options = options.Value;
        }

        public async Task<List<Country>> GetAllCountriesAsync()
        {
            return await _ctx.Countries.ToListAsync();
        }

        public async Task<Country> GetCountryAsync(int id)
        {
            return await _ctx.Countries.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<FsNetwork>> GetAllNetworksAsync()
        {
            return await _ctx.FsNetworks.ToListAsync();
        }

        public async Task<FsNetwork> GetDefaultNetworkAsync()
        {
            return await _ctx.FsNetworks.SingleAsync(n => n.Name == DEFAULT_NETWORK_NAME);
        }

        public async Task<FsNetwork> GetNetworkAsync(int id)
        {
            return await _ctx.FsNetworks.FirstOrDefaultAsync(n => n.Id == id);
        }

        public void CreateOrUpdateFuelPrice(FuelPrice price) => _ctx.FuelPrices.Update(price);
        public void CreateFuelPrice(FuelPrice price) => _ctx.FuelPrices.Add(price);
        public async Task SaveChangesAsync() => await _ctx.SaveChangesAsync();

        public async Task<List<FuelPrice>> GetAllFuelPricesAsync(string userId)
        {
            return await GetFuelPricesForNetworkNameAsync(userId);
        }

        public async Task<List<FuelPrice>> GetFuelPricesForNetworkNameAsync(string userId, string network = DEFAULT_NETWORK_NAME)
        {
            var fuelPricesWithDefaults = await _ctx.FuelPrices
                .Include(fp => fp.Country)
                .Include(fp => fp.Network)
                .Where(fp => (fp.UserId == userId || fp.UserId == _options.DefaultUserId) && fp.Network.Name == network)
                .GroupBy(fp => fp.CountryId)
                .ToListAsync();
            var fuelPrices = new List<FuelPrice>();
            foreach(var pricesGroup in fuelPricesWithDefaults)
            {
                fuelPrices.Add(pricesGroup.Count() == 1 || pricesGroup.First().UserId != _options.DefaultUserId
                    ? pricesGroup.First()
                    : pricesGroup.Last());
            }
            return fuelPrices;
        }
    }
}