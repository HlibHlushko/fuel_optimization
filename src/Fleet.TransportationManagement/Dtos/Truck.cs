namespace Fleet.TransportationManagement.Dtos
{
    public class Truck
    {
        public int Id { get; set; }
        public string TractorModel { get; set; }
        public int TractorId { get; set; }
        public string TractorStateNumberOrVin { get; set; }
        public string TrailerModel { get; set; }
        public int? TrailerId { get; set; }
        public string TrailerStateNumberOrVin { get; set; }
        public string Driver { get; set; }
        public int DriverId { get; set; }
        public string FuelConsumption { get; set; }
    }
}