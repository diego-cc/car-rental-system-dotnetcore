using System;
using Xunit;
using Moq;
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
                var options = new DbContextOptionsBuilder<NMTFleetManagerContext>()
                    .UseSqlite(connection)
                    .Options;

                using (context = new NMTFleetManagerContext(options))
                {
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

                    Assert.IsType<ActionResult<IEnumerable<Vehicle>>>(result);

                    // Assert.IsAssignableFrom<IEnumerable<Vehicle>>(result.Value);
                }
            }
            finally
            {
                connection.Close();
            }
        }
    }
}
