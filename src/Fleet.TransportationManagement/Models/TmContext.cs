using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Fleet.TransportationManagement.Models
{
    public class TmContext : DbContext
    {
        public TmContext(DbContextOptions<TmContext> options) : base(options) { }
        public DbSet<Trip> Trips { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Trip>().Property(e => e.Car).HasConversion(
                v => JsonConvert.SerializeObject(v, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }),
                v => JsonConvert.DeserializeObject<Car>(v, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore })
            );
            builder.Entity<Trip>().Property(e => e.InputPoints).HasConversion(
                v => JsonConvert.SerializeObject(v, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }),
                v => JsonConvert.DeserializeObject<List<Point>>(v, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));

            builder.Entity<Trip>().Property(e => e.OptimizedPoints).HasConversion(
                v => JsonConvert.SerializeObject(v, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }),
                v => JsonConvert.DeserializeObject<List<Point>>(v, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));
        }
    }
}
//$ dotnet ef migrations add InitDatabase --msbuildprojectextensionspath ./obj/local