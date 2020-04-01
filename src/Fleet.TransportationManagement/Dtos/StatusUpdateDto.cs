using System;

namespace Fleet.TransportationManagement.Dtos
{
    public class StatusUpdateDto
    {
        public int TripId { get; set; }
        public DateTime Date { get; set; }
    }
}