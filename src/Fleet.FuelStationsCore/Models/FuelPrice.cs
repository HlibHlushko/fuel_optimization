namespace Fleet.FuelStationsCore.Models
{
    public class FuelPrice
    {
        public int Id { get; set; }

        public string UserId { get; set; }

        public int CountryId { get; set; }
        public Country Country { get; set; }
        public int NetworkId { get; set; }
        public FsNetwork Network { get; set; }

        public double Price { get; set; }
    }
}