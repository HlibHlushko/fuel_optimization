using Fleet.TransportationManagement.Models;
using System;
using System.Collections.Generic;

namespace Fleet.TransportationManagement.Dtos
{
    public class SendTripDto
    {
        public string Id { get; set; }
        public Car Car { get; set; }
        public int ResidualFuel { get; set; }
        public List<Point> InputPoints { get; set; }
        public List<Point> OptimizedPoints { get; set; }
        public SendTripDto() { }
        public SendTripDto(Trip trip)
        {
            Id = trip.Id;
            ResidualFuel = trip.ResidualFuel;
            InputPoints = trip.InputPoints;
            OptimizedPoints = trip.OptimizedPoints;
            Car = trip.Car;
        }
    }

}