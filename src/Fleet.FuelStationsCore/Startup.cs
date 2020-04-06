using System.Threading.Tasks;
using Fleet.FuelStationsCore.Models;
using Fleet.FuelStationsCore.Services;
using Fleet.FuelStationsCore.Services.CollectApi;
using Fleet.FuelStationsCore.Services.HereApi;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Fleet.FuelStationsCore
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddDbContext<FsContext>(options => options.UseMySql(Configuration.GetConnectionString("FuelStations")));
            services.AddTransient<DbService>();
            services.AddTransient<DieselStationsService>();
            services.AddTransient<CollectApiService>();

            services.AddCors(builder => builder.AddDefaultPolicy(p =>
            {
                p.AllowAnyOrigin();
                p.AllowAnyMethod();
                p.AllowAnyHeader();
            }));

            services.Configure<HereApiOptions>(hao =>
            {
                hao.AppId = Configuration["HERE_APP_ID"];
                hao.AppCode = Configuration["HERE_APP_CODE"];

                Configuration.GetSection(nameof(HereApiOptions)).Bind(hao);
            });
            services.Configure<CollectApiOptions>(cao =>
            {
                cao.ApiKey = Configuration["COLLECT_APIKEY"];
                Configuration.GetSection(nameof(CollectApiOptions)).Bind(cao);
            });
            services.Configure<DefaultUserOptions>(Configuration.GetSection(nameof(DefaultUserOptions)));

            services.AddHttpClient<HereApiClient>();
            services.AddHttpClient<CollectApiClient>();

            services.AddHostedService<StationsPricesBackgroundService>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, FsContext context)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors();
            app.UseMvc();
            InitializeAsync(context).GetAwaiter().GetResult();
        }

        public async static Task InitializeAsync(FsContext context)
        {
            await context.Database.MigrateAsync();

            if (!await context.FsNetworks.AnyAsync())
            {
                await context.FsNetworks.AddRangeAsync(
                    new FsNetwork { Name = "Default" },
                    new FsNetwork { Name = "UTA" },
                    new FsNetwork { Name = "WOG" },
                    new FsNetwork { Name = "Glusco" }
                );
            }
            if (!await context.Countries.AnyAsync())
            {
                await context.Countries.AddRangeAsync(
                    new Country { Code = "AUT", Name = "Austria" },
                    new Country { Code = "BEL", Name = "Belgium" },
                    new Country { Code = "BGR", Name = "Bulgaria" },
                    new Country { Code = "CYP", Name = "Cyprus" },
                    new Country { Code = "CZE", Name = "Czech Republic" },
                    new Country { Code = "DEU", Name = "Germany" },
                    new Country { Code = "DNK", Name = "Denmark" },
                    new Country { Code = "EST", Name = "Estonia" },
                    new Country { Code = "ESP", Name = "Spain" },
                    new Country { Code = "FIN", Name = "Finland" },
                    new Country { Code = "FRA", Name = "France" },
                    new Country { Code = "GBR", Name = "United Kingdom" },
                    new Country { Code = "GRC", Name = "Greece" },
                    new Country { Code = "HRV", Name = "Croatia" },
                    new Country { Code = "HUN", Name = "Hungary" },
                    new Country { Code = "IRL", Name = "Ireland" },
                    new Country { Code = "ITA", Name = "Italy" },
                    new Country { Code = "LTU", Name = "Lithuania" },
                    new Country { Code = "LUX", Name = "Luxembourg" },
                    new Country { Code = "LVA", Name = "Latvia" },
                    new Country { Code = "MLT", Name = "Malta" },
                    new Country { Code = "NLD", Name = "Netherlands" },
                    new Country { Code = "POL", Name = "Poland" },
                    new Country { Code = "PRT", Name = "Portugal" },
                    new Country { Code = "ROU", Name = "Romania" },
                    new Country { Code = "SWE", Name = "Sweden" },
                    new Country { Code = "SVN", Name = "Slovenia" },
                    new Country { Code = "SVK", Name = "Slovakia" },
                    new Country { Code = "ALB", Name = "Albania" },
                    new Country { Code = "AND", Name = "Andorra" },
                    new Country { Code = "ARM", Name = "Armenia" },
                    new Country { Code = "BIH", Name = "Bosnia and Herzegovina" },
                    new Country { Code = "BLR", Name = "Belarus" },
                    new Country { Code = "CHE", Name = "Switzerland" },
                    new Country { Code = "FRO", Name = "Faeroe Islands" },
                    new Country { Code = "GEO", Name = "Georgia" },
                    new Country { Code = "GIB", Name = "Gibraltar" },
                    new Country { Code = "ISL", Name = "Iceland" },
                    new Country { Code = "MCO", Name = "Monaco" },
                    new Country { Code = "MKD", Name = "Macedonia" },
                    new Country { Code = "NOR", Name = "Norway" },
                    new Country { Code = "RUS", Name = "Russia" },
                    new Country { Code = "SMR", Name = "San Marino" },
                    new Country { Code = "SRB", Name = "Serbia" },
                    new Country { Code = "TUR", Name = "Turkey" },
                    new Country { Code = "UKR", Name = "Ukraine" },
                    new Country { Code = "VAT", Name = "Vatican City State" }
                );
            }

            await context.SaveChangesAsync();
        }
    }
}
