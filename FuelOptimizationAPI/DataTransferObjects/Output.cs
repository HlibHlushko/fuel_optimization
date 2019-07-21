using System;
using System.Collections.Generic;
using System.Text;

namespace DataTransferObjects
{
    public class Output
    {
        List<OutputPoint> Points { get; set; }

    }
    public class OutputPoint
    {
        public double[,] Coordinates { get; set; }
        public List<Car> UnloadCars { get; set; }
        public double FuelCost { get; set; }
        public int FuelVolume { get; set; }

    }

}
