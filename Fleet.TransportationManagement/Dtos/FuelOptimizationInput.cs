namespace Fleet.TransportationManagement.Dtos
{
    public class FuelOptimizationInput
    {
        public double[] Costs { get; set; }
        public double[] Volumes { get; set; }
        public int Tank { get; set; }
        public int Remainder { get; set; }
        public int MinimumRemainder { get; set; }
    }
}