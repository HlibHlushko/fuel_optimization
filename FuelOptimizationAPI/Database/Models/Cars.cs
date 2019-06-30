using System.Collections.Generic;
namespace Database
{
    public class Brand
    {
        public int Id { get; set; }
        public string BrandName { get; set; }
        public List<Model> Models { get; set; }
    }
    public class Model
    {
        public int Id { get; set; }
        public string ModelName { get; set; }
        public int BrandId { get; set; }
    }
}
