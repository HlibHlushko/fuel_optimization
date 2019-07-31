using DataTransferObjects;
using OptimizationSimplexMethod;
using Services.Interfaces;
using System.Collections.Generic;
using Newtonsoft.Json;


namespace Services
{
    public class Optimization : IOptimization
    {
        readonly IdbData _dbData;
        public Optimization(IdbData dbData)
        {
            _dbData = dbData;
        }

        public List<OutputPoint> StartOptimization(Input input)
        {
            //int[] volumes = new int[] { 300, 200, 300 };
            //double[] costs = new double[] { 1, 1.25, 0.95 };

            int tank = _dbData.GetTrucks().Find(truck => truck.Id == input.TruckId).TankCapacity;
            // tank = 300;
            input.Points.Insert(0,new Point{
              Coordinates = input.Points[0].Coordinates,
              FuelCost = 1,
              DistanceToNextPoint = 0,
              PointType = 0
            });
            var (volumes, costs, idx) = CalculateVolumes(input.Points);
            
            FuelPlan P = new FuelPlan(costs.ToArray(), volumes.ToArray(), tank);

            List<OutputPoint> output = new List<OutputPoint>();
            //output.Points = new List<OutputPoint>();
            List<int> pos = new List<int>();
            for (int i=0;i<P.Plan.Length; ++i)
            {
                if (P.Plan[i] < 1) continue;
                output.Add(new OutputPoint
                {
                    Coordinates = input.Points[idx[i]].Coordinates,
                    FuelCost = input.Points[idx[i]].FuelCost,
                    FuelVolume = (int)P.Plan[i]
                });
                pos.Add(idx[i]);
            }
            int it = -1;
            foreach (Point point in input.Points)
            {
                it++;
                if (point.PointType != PointType.Dealer) continue;
                output.Add(new OutputPoint
                {
                    Coordinates = point.Coordinates,
                    UnloadCars = point.Cars
                });
                pos.Add(it);
            }
            
            for(int i=0;i<output.Count-1; ++i)
              for (int j=i+1; j<output.Count; ++j)
                if (pos[i] > pos[j])
                  (pos[i], pos[j], output[i], output[j]) = (pos[j], pos[i], output[j], output[i]);
                
            // List<OutputPoint> result = new List<OutputPoint>();
            // for (int i=0;i<pos.Count; ++i) result.Add(new OutputPoint());
            // for (int i = 0; i < pos.Count; ++i)
                // result[pos[i]] = output[i];
            // output = result;
            return output;
            //Array.Sort(pos.ToArray(), output.Points.ToArray());
            //Console.ReadKey();
        }
        private (List<int>, List<double>, List<int>) CalculateVolumes(List<Point> points)
        {
            int currentWeight = 0;
            var cars = _dbData.GetModels();
            foreach (Point point in points)
                if (point.Cars != null)
                foreach (Car car in point.Cars)
                    currentWeight += cars.Find(c => car.BrandId == c.BrandId && car.ModelId == c.Id).Weight;

            int currentVolume = 0;
            List<int> volumes = new List<int>();
            List<double> costs = new List<double>();
            List<int> idx = new List<int>();
            int from = 0;
            currentVolume = ConvertDistanceToVolume(points[0].DistanceToNextPoint, currentWeight);

            for (int i = 1; i < points.Count; ++i)
            {   
                Point point = points[i];
                if (point.PointType == PointType.Dealer)
                {
                    //to++;
                    if (point.Cars != null) foreach (Car car in point.Cars) currentWeight -= cars.Find(c => car.BrandId == c.BrandId && car.ModelId == c.Id).Weight;
                    currentVolume += ConvertDistanceToVolume(point.DistanceToNextPoint, currentWeight);
                }
                else
                {
                    volumes.Add(currentVolume);
                    costs.Add((double)point.FuelCost);
                    idx.Add(from);
                    from = i;
                    currentVolume = ConvertDistanceToVolume(point.DistanceToNextPoint, currentWeight);

                }
            }
            volumes.Add(currentVolume);
            costs.Add(1);
            idx.Add(from);

            return (volumes, costs, idx);

            int it = -1;
            foreach (Point point in points)
            {
                it++;
                if(point.PointType == PointType.Dealer)
                {
                    if (point.Cars!=null) foreach(Car car in point.Cars) currentWeight -= cars.Find(c => car.BrandId == c.BrandId && car.ModelId == c.Id).Weight;
                    currentVolume += ConvertDistanceToVolume(point.DistanceToNextPoint, currentWeight);
                } else 
                {
                    if (it != 0)
                    {
                        volumes.Add(currentVolume);
                        costs.Add(1);
                        idx.Add(it);
                    }
                    
                    //currentVolume = 0;
                    currentVolume = ConvertDistanceToVolume(point.DistanceToNextPoint, currentWeight);
                }

            }
            volumes.Add(currentVolume);
            costs.Add(1);
            idx.Add(it+1);
            return (volumes, costs, idx);
        }
        private int ConvertDistanceToVolume(int distance, int weight)
        {
            //return distance;
            return (int)(distance / 1000  * 0.27 + weight / 1000);
        }
    }
}
