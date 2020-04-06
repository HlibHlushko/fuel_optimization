using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Fleet.TransportationManagement.Models;
using Fleet.TransportationManagement.Hubs;
using Fleet.TransportationManagement.Services;
using Fleet.TransportationManagement.Services.Interfaces;
using System.IO;
namespace Fleet.TransportationManagement
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddDbContext<TmContext>(options => options.UseMySQL(Configuration["ConnectionStrings:TransportationManagement"]));

            services.AddHttpContextAccessor();

            services.AddSignalR();

            services.AddTransient<IDbService, DbService>();

            services.AddTransient<FuelOptimizationService>();

            services.AddHttpClient("users", c =>
            {
                c.BaseAddress = new Uri(Configuration["Users"]);
                c.DefaultRequestHeaders.Add("X-Role", "manager");
            });
            services.AddHttpClient("fleetManagement", c =>
            {
                c.BaseAddress = new Uri(Configuration["FleetManagement"]);
            });
            services.AddHttpClient("fuelOptimization", c =>
           {
               c.BaseAddress = new Uri(Configuration["FuelOptimization"]);
           });
            services.AddHttpClient("fuelStations", c =>
            {
                c.BaseAddress = new Uri(Configuration["FuelStations"]);
                c.Timeout = TimeSpan.FromHours(10);
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, TmContext context)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSignalR(route =>
            {
                route.MapHub<TripUpdateHub>("/tripshub");
            });

            app.UseMvc();
            Initialize(context);
        }

        public static void Initialize(TmContext context)
        {

            context.Database.Migrate();
        }
    }
}
