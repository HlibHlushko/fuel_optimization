namespace Fleet.TransportationManagement.Dtos
{
    public class GetFuelStationsDto
    {
        public StationType Type { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public Coords Coords { get; set; }
        public Coords Junction0 { get; set; }
        public Coords Junction1 { get; set; }
        public double DistanceToNextPoint { get; set; }
        public double Cost { get; set; }
    }
    public enum StationType
    {
        Waypoint,
        FuelStation
    }
    public class Coords
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }

}