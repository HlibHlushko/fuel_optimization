using System.Collections.Generic;

namespace Fleet.FuelStationsCore.Services.HereApi
{
#region Geocoder
    public struct Coord
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
    public class AddressWithMatchLevel
    {
        public string MatchLevel { get; set; }
        public Address Address { get; set; }
    }
    public class Address
    {
        public string Country { get; set; }
        public string State { get; set; }
        public string County { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string Street { get; set; }
        public string HouseNumber { get; set; }
        public string PostalCode { get; set; }
    }
    internal class Location
    {
        public Address Address { get; set; }
    }
    internal class Result
    {
        public string MatchLevel { get; set; }
        public double Distance { get; set; }
        public Location Location { get; set; }
    }
    internal struct Item
    {
        public List<Result> Result { get; set; }
    }
    internal struct Response
    {
        public List<Item> Item { get; set; }
    }
    internal class GeocoderResponse
    {
        public Response Response { get; set; }
    }
#endregion
#region Router
    internal struct Coordinates
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
    internal struct SWaypoint
    {
            public string LinkId { get; set; }
            public Coordinates MappedPosition { get; set; }
            public Coordinates OriginalPosition { get; set; }
            public string Type { get; set; }
            public double Spot { get; set; }
            public string SideOfStreet { get; set; }
    }
    internal struct Note
    {
        public string Type { get; set; }
        public string Code { get; set; }
        public string Text { get; set; }
    }
    internal struct Summary
    {
        public double Distance { get; set; }
        public double TrafficTime { get; set; }
        public double BaseTime { get; set; }
        public string[] Flags { get; set; }
        public double TravelTime { get; set; }
    }
    internal struct Route
    {
        public string RouteId { get; set; }
        public SWaypoint[] Waypoint { get; set; }
        public double[] Shape { get; set; }
        public Note[] Note { get; set; }
        public Summary Summary { get; set; }
    }
    internal struct PartialResponse
    {
        public List<Route> Route { get; set; }
    }
    internal class RouterResponse
    {
        public PartialResponse Response { get; set; }
    }
    public class Waypoint
    {
        public string LinkId { get; set; }
        public Coord MappedPosition { get; set; }
        public Coord OriginalPosition { get; set; }
        public string Type { get; set; }
        public double Spot { get; set; }
        public string SideOfStreet { get; set; }
    }
    public class HereRoute
    {
        public string Id { get; set; }
        public double Distance { get; set; }
        public List<Waypoint> Waypoints { get; set; }
        public double[] Shape { get; set; }
    }
#endregion
#region Corridor
    public struct StationName
    {
        public string LanguageCode  { get; set; }
        public string NameType  { get; set; }
        public bool IsExonym  { get; set; }
        public string Text  { get; set; }
        public Dictionary<string, string> Translits  { get; set; }
        public Dictionary<string, (string, string)> Phonemes  { get; set; }
    }
    public struct DieselStation
    {
        public StationName[] Name { get; set; }
        public Coord Latlng { get; set; }
        public double Distance { get; set; }
        public string PoiId { get; set; }
    }
    internal struct Attributes
    {
        public string NAMES { get; set; }
        public string POI_ID { get; set; }
        public string DIESEL { get; set; }
        public string PRIVATE_ACCESS { get; set; }
    }
    internal struct GeometryNAttributes
    {
      public Attributes Attributes { get; set; }
        
      public double Distance { get; set; }
      public double NearestLat { get; set; }
      public double NearestLon { get; set; }
      public string Geometry { get; set; }
    }
    internal class CorridorSearchResponse
    {
        public List<GeometryNAttributes> Geometries { get; set; }
    }
#endregion

    public class DieselStationInfo
    {
        public DieselStation Station { get; set; }
        public dynamic Info { get; set; }
    }

    public class DieselStationInfos
    {
        public Coord DepartCoords { get; set; }
        public Coord DestCoords { get; set; }
        public double Distance { get; set; }
        public double[] Route { get; set; }
        public List<DieselStationInfo> Infos { get; set; }
    }
}