using System.Collections.Generic;
using Fleet.TransportationManagement.Dtos;
using Newtonsoft.Json;
using System;

namespace Fleet.TransportationManagement.Models
{
    public class Trip
    {
        public string Id { get; set; }
        public Car Car { get; set; }
        public int ResidualFuel { get; set; }
        public List<Point> InputPoints { get; set; }
        public List<Point> OptimizedPoints { get; set; }
        public Trip() { }
        public static Trip From(GetTripDto trip) => new Trip
        {
            Id = Guid.NewGuid().ToString(),
            Car = trip.Car,
            ResidualFuel = trip.ResidualFuel,
            InputPoints = trip.InputPoints,
        };
    }
}