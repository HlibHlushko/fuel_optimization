using System;
using DataTransferObjects;

using System.Collections.Generic;
using Newtonsoft.Json;

namespace Test
{
    class Program
    {
        static void Main()
        {

           
            Point p1 = new Point
            {
                Cars = null,
                Coordinates = new double[] { 1, 2 },
                FuelCost = 1,
                DistanceToNextPoint = 200,
                PointType = PointType.Dealer
            };

            Point p2 = new Point
            {
                Cars = new List<Car>
                {
                    new Car
                    {
                        BrandId = 1,
                        ModelId = 1
                    },
                    new Car
                    {
                        BrandId = 1,
                        ModelId = 2
                    },
                    new Car
                    {
                        BrandId = 2,
                        ModelId = 1
                    }
                },
                Coordinates = new double[] { 1, 2 },
                FuelCost = null,
                DistanceToNextPoint = 300,
                PointType = PointType.Dealer
            };

            Point p3 = new Point
            {
                Cars = null,
                Coordinates = new double[] { 1, 2 },
                FuelCost = 0.94,
                DistanceToNextPoint = 400,
                PointType = PointType.FuelStation
            };
            Input input = new Input
            {
                TruckId = 1,
                Points = new List<Point>
                {
                    p1,p2,p3
                }
            };
            Console.WriteLine(JsonConvert.SerializeObject(input));
            return;

            Random random = new Random();
            int max_volume = 600;
            int min_balance = 0;
            int points_number = 4;
            double[] costs = new double[points_number];
            int[][] distances = new int[points_number][];
            bool[] necessary = new bool[points_number];
            //for (int i = 0; i < points_number; ++i)
            //{
            //    costs[i] = random.NextDouble() * 4 + 28;
            //    necessary[i] = true;
            //    distances[i] = new int[points_number];
            //}
            //for (int i = 0; i < points_number - 1; ++i)
            //    for (int j = i + 1; j < points_number; ++j)
            //    {

            //        distances[i][j] = random.Next(30, 600);
            //        distances[i][j] = distances[j][i];
            //    }
            costs = new double[] { 0.95, 1.25, 0.95, 1.3 };
            //necessary[1] = false;
            necessary = new bool[] { true, false, false, true };
            Tuple<int, int, int>[][] pred = new Tuple<int, int, int>[points_number][];
            for (int i = 0; i < points_number; ++i) pred[i] = new Tuple<int, int, int>[max_volume + 1]; //distances[i] = new int[points_number];
            distances[0] = new int[] { 0, 300, 450, 800 };
            distances[1] = new int[] { 300, 0, 200, 450 };
            distances[2] = new int[] { 450, 200, 0, 300 };
            distances[3] = new int[] { 800, 450, 300, 0 };

            double[][] dp = new double[points_number][];
            for (int i = 0; i < points_number; ++i) dp[i] = new double[max_volume + 1];
            int last_possible = 0;
            for (int i = 0; i < points_number; ++i)
                for (int j = 0; j <= max_volume; ++j)
                    dp[i][j] = int.MaxValue;
            for (int i = min_balance; i <= max_volume; ++i)
                dp[0][i] = i * costs[0];

            for (int point = 1; point < points_number; ++point)
            {
                for (int volume = min_balance; volume <= max_volume; ++volume)
                {

                    for (int prev_point = last_possible; prev_point < point; ++prev_point)
                        for (int possible_volume = Math.Max(min_balance, Math.Min(distances[point][prev_point], max_volume)); possible_volume <= Math.Min(distances[point][prev_point] + volume, max_volume); ++possible_volume)
                        {
                            //dp[point][volume] = Math.Min(dp[point][volume], dp[prev_point][possible_volume] + (distances[point][prev_point] + volume - possible_volume) * costs[point]);
                            double new_cost = dp[prev_point][possible_volume] + (distances[point][prev_point] + volume - possible_volume) * costs[point];
                            if (dp[point][volume] >= new_cost)
                            {
                                dp[point][volume] = new_cost;
                                pred[point][volume] = new Tuple<int, int, int>(prev_point, possible_volume, distances[point][prev_point] + volume - possible_volume);
                            }
                        }
                }
                if (necessary[point]) last_possible = point;
            }
            int curr = points_number - 1;
            int vol = min_balance;
            while (pred[curr][vol] != null)
            {
                Console.WriteLine($"Point #{curr}, buy {pred[curr][vol].Item3} with cost {costs[curr]}");
                var t = pred[curr][vol];
                curr = t.Item1;
                vol = t.Item2;
            }
            Console.WriteLine($"Point #{curr}, buy {vol} with cost {costs[curr]}");

        }
    }
}
