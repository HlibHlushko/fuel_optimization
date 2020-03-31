using System.Collections.Generic;

namespace Fleet.FuelStationsCore.Services.CollectApi
{
  public class GasPrices
  {
      public List<Result> Results {get; set;}
      public bool Success {get; set; }
  }
  public class Result
  {
      public string Currency {get; set;}
      public string Lpg {get; set;}
      public string Diesel {get; set;}
      public string Gasoline {get; set;}
      public string Country {get; set;}
  }
}