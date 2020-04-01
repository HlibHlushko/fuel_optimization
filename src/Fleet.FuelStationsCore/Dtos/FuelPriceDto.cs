using Fleet.FuelStationsCore.Models;

namespace Fleet.FuelStationsCore.Dtos
{
    public class FuelPriceDto
    {
        public int Id { get; set; }

        public int CountryId { get; set; }
        public string Country { get; set; }
        public int NetworkId { get; set; }
        public string Network { get; set; }

        public double Price { get; set; }

        public static FuelPriceDto From(FuelPrice price) => new FuelPriceDto
        {
            Id = price.Id,
            CountryId = price.CountryId,
            Country = price.Country.Name,
            NetworkId = price.NetworkId,
            Network = price.Network.Name,
            Price = price.Price
        };
    }
}