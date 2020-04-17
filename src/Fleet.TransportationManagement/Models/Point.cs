namespace Fleet.TransportationManagement.Models
{
    public class Point
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public string Name { get; set; }
        public string Address { get; set; }
        public PointType Type { get; set; }
        public double? Refuel { get; set; }
        public double? Remainder { get; set; }
        public double? Cost { get; set; }

        public Point GetCopy() => new Point
        {
            Latitude = Latitude,
            Longitude = Longitude,
            Name = Name,
            Address = Address,
            Type = Type,
            Refuel = Refuel,
            Cost = Cost,
            Remainder = Remainder
        };

    }
    public enum PointType
    {
        LoadUnload,
        Visit,
        FuelStation,
        Correction,
        Junction,
        Split
    }
}