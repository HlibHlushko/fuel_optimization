using System.Collections.Generic;

namespace DataTransferObjects
{
    public class OutputPoint
    {
        public double[] Coordinates { get; set; }
        public List<Car> UnloadCars { get; set; }
        public double? FuelCost { get; set; }
        public int? FuelVolume { get; set; }

    }

}
