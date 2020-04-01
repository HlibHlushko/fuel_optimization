namespace Fleet.FuelOptimization.Dtos
{
    public class InputData
    {
        public double[] Costs { get; set; }
        public double[] Volumes { get; set; }
        public int Tank { get; set; }
        public int Remainder { get; set; }
    }
}