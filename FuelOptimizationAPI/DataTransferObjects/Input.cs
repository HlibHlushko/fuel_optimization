using System.Collections.Generic;

namespace DataTransferObjects
{
    public class Input
    {
        public int TruckId { get; set; }
        public List<Point> Points { get; set; } //i suppose points are in ascending order, so DistanceToNextPoint means distance from Points[i] to Points[i+1]
        
    }
    public class Point
    {
        public double[] Coordinates { get; set; }
        public PointType PointType { get; set; }
        public int DistanceToNextPoint {get; set;}
        public double? FuelCost { get; set; }       //depends if we use service with all fuel costs or we save costs localy,
                                                    //null if PointType == Dealer, but it's possible that we can fuel up at dealer like at terminal
        //public List<int> Weights { get; set; }
        public List<Car> Cars { get; set; }
    }
    public enum PointType
    {
        FuelStation,
        Dealer
    }
    public class Car
    {
        public int BrandId { get; set; }
        public int ModelId { get; set; }
        //public int Weight { get; set; }
    }
}
