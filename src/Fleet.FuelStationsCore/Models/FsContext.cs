using Microsoft.EntityFrameworkCore;

namespace Fleet.FuelStationsCore.Models
{
    public class FsContext : DbContext
    {
        public FsContext(DbContextOptions<FsContext> options) : base(options) { }

        public DbSet<FsNetwork> FsNetworks { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<FuelPrice> FuelPrices { get; set; }
    }
}