using Services.Interfaces;
using Database;
using System.Collections.Generic;
using System.Linq;
namespace Services
{
    public class dbData: IdbData
    {
        private readonly ApplicationContext _context;
        public dbData(ApplicationContext context) {
            _context = context;
        }
        public List<Model> GetModels()
        {
            return _context.Models.ToList();
        }
        public List<Truck> GetTrucks()
        {
            return _context.Trucks.ToList();
        }
        public List<Brand> GetBrands()
        {
           return _context.Brands.ToList();
        }
    }
}
