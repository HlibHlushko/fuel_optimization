namespace Fleet.FuelOptimization.Dtos
{
    public class InputData
    {
        public double[] Costs { get; set; }
        public double[] Volumes { get; set; }
        public int Tank { get; set; }
        public int Remainder { get; set; }
        public int MinimumRemainder { get; set; }
        public InputData() { }
        public InputData(double[] volumes, double[] costs, int tank, int remainder, int minimum_remainder)
        {
            Volumes = volumes;
            Costs = costs;
            Tank = tank;
            Remainder = remainder;
            MinimumRemainder = minimum_remainder;
        }
    }
}