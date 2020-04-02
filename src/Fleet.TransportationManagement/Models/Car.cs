namespace Fleet.TransportationManagement.Models
{
    public class Car
    {
        public int Id { get; set; }
        public int Consumption { get; set; }
        public int BrandId { get; set; }
        public string Model { get; set; }
        public int Tank { get; set; }
    }
}