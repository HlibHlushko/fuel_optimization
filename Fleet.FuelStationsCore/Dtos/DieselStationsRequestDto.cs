using System.Collections.Generic;
using Fleet.FuelStationsCore.Services.HereApi;

namespace Fleet.FuelStationsCore.Dtos
{
    public class DieselStationsRequestDto
    {
        public int Detour { get; set; }
        public List<Coord> Waypoints { get; set; }
    }
}