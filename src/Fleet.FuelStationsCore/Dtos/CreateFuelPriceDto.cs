using Fleet.FuelStationsCore.Models;

namespace Fleet.FuelStationsCore.Dtos
{
    public class CreateFuelPriceDto
    {
        public int Id { get; set; }
        public int CountryId { get; set; }
        public int NetworkId { get; set; }
        public double Price { get; set; }

        public FuelPrice To(Country country, FsNetwork net) => new FuelPrice
        {
            Id = Id == -1 ? default(int) : Id,
            CountryId = CountryId,
            Country = country,
            NetworkId = NetworkId,
            Network = net,
            Price = Price
        };
    }
}