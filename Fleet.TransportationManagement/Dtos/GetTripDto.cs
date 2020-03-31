using System;
using System.Collections.Generic;
using Fleet.TransportationManagement.Models;
namespace Fleet.TransportationManagement.Dtos
{
    public class GetTripDto
    {
        public Car Car { get; set; }
        public int ResidualFuel { get; set; }
        public List<Point> InputPoints { get; set; }

    }
}