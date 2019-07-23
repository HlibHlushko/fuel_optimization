namespace Database
{
    public class Truck
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Weight { get; set; }
        public int TankCapacity { get; set; }
        public double FuelConsumptionPerKm { get; set; }
        public double WeightAdjustiveConsumptionIndex { get; set; } //liters on 1(t) * (km) 

    }
}
