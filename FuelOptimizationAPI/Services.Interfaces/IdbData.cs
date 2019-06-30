using System.Collections.Generic;
using Database;
namespace Services.Interfaces
{
    public interface IdbData
    {
        List<Model> GetModels();
        List<Brand> GetBrands();
        List<Truck> GetTrucks();
    }
}
