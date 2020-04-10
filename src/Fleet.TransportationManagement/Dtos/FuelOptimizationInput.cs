namespace Fleet.TransportationManagement.Dtos
{
    public class FuelOptimizationInput
    {
        public double[] Costs { get; set; }
        public double[] Volumes { get; set; }
        public int Tank { get; set; }
        public int Remainder { get; set; }
        public FuelOptimizationInput GetCopy() => new FuelOptimizationInput { Costs = (double[])this.Costs.Clone(), Volumes = (double[])this.Volumes.Clone(), Tank = this.Tank, Remainder = this.Remainder };
    }
}