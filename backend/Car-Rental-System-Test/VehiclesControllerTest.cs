using System;
using Xunit;
using Car_Rental_System_API;
using Car_Rental_System_API.Controllers;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Car_Rental_System_Test.Seed;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;
using Xunit.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Car_Rental_System_Test.Config;

/**
 * NOTE:
 * Comment out OnModelCreating() and OnModelCreatingPartial() (on Models/NMTFleetManagerContext.cs) before running tests
 * Otherwise they will fail, because of syntax differences between MySQL and SQLite and some EFCore quirks
 * I have tried my best to come up with an alternative that remains close to MySQL and that doesn't involve rewriting the whole DBContext configuration
 * No luck so far though
 */
namespace Car_Rental_System_Test
{
    public class VehiclesControllerTest
    {
        private SqliteConnection connection;
        private NMTFleetManagerContext context;
        private VehiclesController vehiclesController;
        private readonly ITestOutputHelper output;

        public VehiclesControllerTest(ITestOutputHelper outputHelper)
        {
            // Arrange (SQLite connection)
            connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            this.output = outputHelper;
        }

        [Fact]
        public async void VehiclesController_GetVehicles()
        {
            // Arrange (DB schema)
            try
            {
                // TODO: UseModel to override OnModelCreating
                var options = new DbContextOptionsBuilder<NMTFleetManagerContext>()
                    .UseSqlite(connection)
                    .Options;

                using (context = new NMTFleetManagerContext(options))
                {
                    context.Database.OpenConnection();
                    context.Database.EnsureCreated();
                }

                // Seed data into the context
                using (context = new NMTFleetManagerContext(options))
                {
                    SeedCollection seedCollection = SeedData.Seed();
                    context.Vehicles.AddRange(seedCollection.Vehicles);
                    context.SaveChanges();
                }

                // Assert
                using (context = new NMTFleetManagerContext(options))
                {
                    int expected = 5;
                    vehiclesController = new VehiclesController(context);
                    var result = await vehiclesController.GetVehicles();

                    var vehicles = Assert.IsAssignableFrom<IEnumerable<Vehicle>>(result);

                    var actual = vehicles.Count();

                    Assert.Equal(expected, actual);
                }
            }
            finally
            {
                connection.Close();
            }
        }
    }
}
