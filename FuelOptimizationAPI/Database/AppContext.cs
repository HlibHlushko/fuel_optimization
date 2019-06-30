using Microsoft.EntityFrameworkCore;
namespace Database
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options) { }

        public DbSet<Model> Models { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Truck> Trucks { get; set; }

        
    }
}
