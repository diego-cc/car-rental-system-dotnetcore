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
using Xunit.Extensions;
using System.Globalization;

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
        public static IEnumerable<object[]> ValidVehicleUuid =>
            new[]
            {
                 new object[] {Guid.Parse("23c07876-a967-4cf0-bf22-0fdeaf7beb06")}
            };

        public static IEnumerable<object[]> InvalidVehicleUuid =>
            new[]
            {
                 new object[] {Guid.Parse("23c07876-a967-4cf0-bf22-0fdeaf7fffff")}
            };

        public static IEnumerable<object[]> ValidVehicleToBeUpdated =>
            new[]
            {
                new object[] 
                {
                    Guid.Parse("23c07876-a967-4cf0-bf22-0fdeaf7beb06"),
                    new Vehicle
                    {
                        Id = 1,
                        Uuid = Guid.Parse("23c07876-a967-4cf0-bf22-0fdeaf7beb06"),
                        Manufacturer = "Bugatti",
                        Model = "Veyron 16.4 Super Sport",
                        Year = 2011,
                        Odometer = 2000.00M,
                        Registration = "2VEYRON",
                        FuelType = "Petrol",
                        TankSize = 100.00M,
                        CreatedAt = DateTime.ParseExact("2019-12-12 02:10:39", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                    }
                }
            };

        public static IEnumerable<object[]> InvalidVehicleToBeUpdated =>
            new[]
            {
                new object[]
                {
                    Guid.Parse("23c07876-a967-4cf0-bf22-0fdeaf7fffff"),
                    new Vehicle
                    {
                        Id = 1,
                        Uuid = Guid.Parse("23c07876-a967-4cf0-bf22-0fdeaf7beb06"),
                        Manufacturer = "Bugatti",
                        Model = "Veyron 16.4 Super Sport",
                        Year = 2011,
                        Odometer = 4000.00M,
                        Registration = "3VEYRON",
                        FuelType = "Petrol",
                        TankSize = 100.00M,
                        CreatedAt = DateTime.ParseExact("2019-12-12 02:10:39", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                    }
                }
            };

        public VehiclesControllerTest(ITestOutputHelper outputHelper)
        {
            // Arrange (SQLite connection)
            connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            this.output = outputHelper;
        }

        /// <summary>
        /// Tests the <see cref="VehiclesController.GetVehicles"/> method from <see cref="VehiclesController"/>
        /// </summary>
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
                    var actionResult = await vehiclesController.GetVehicles();

                    var okResult = actionResult.Result as OkObjectResult;
                    var vehicles = okResult?.Value as IEnumerable<Vehicle>;

                    var actual = vehicles.Count();

                    Assert.Equal(expected, actual);
                }
            }
            finally
            {
                connection.Close();
            }
        }

        /// <summary>
        /// Tests the <see cref="VehiclesController.GetVehicleById(ulong)"/> method from <see cref="VehiclesController"/>
        /// Two sample IDs were used, one that exists and another one that doesn't
        /// The method should return the requested Vehicle (if it exists) or a <see cref="NotFoundResult"/> otherwise
        /// </summary>
        /// <param name="id">The ID of the vehicle to be searched</param>
        [Theory]
        [InlineData(1)]
        [InlineData(ulong.MaxValue)]
        public async void VehiclesController_GetVehiclesById(ulong id)
        {
            try
            {
                var options = new DbContextOptionsBuilder<NMTFleetManagerContext>()
                    .UseSqlite(connection)
                    .Options;

                using (context = new NMTFleetManagerContext(options))
                {
                    context.Database.OpenConnection();
                    context.Database.EnsureCreated();
                }

                using (context = new NMTFleetManagerContext(options))
                {
                    SeedCollection seedCollection = SeedData.Seed();
                    context.Vehicles.AddRange(seedCollection.Vehicles);
                    context.SaveChanges();
                }

                using (context = new NMTFleetManagerContext(options))
                {
                    Vehicle expected = await context.Vehicles.FindAsync(id);

                    vehiclesController = new VehiclesController(context);
                    var actionResult = await vehiclesController.GetVehicleById(id);

                    if (expected == null)
                    {
                        Assert.IsType<NotFoundResult>(actionResult.Result);
                    }
                    else
                    {
                        var okResult = actionResult.Result as OkObjectResult;
                        var actual = okResult?.Value as Vehicle;

                        Assert.Equal(expected, actual);
                    }
                }
            }
            finally
            {
                connection.Close();
            }
        }

        /// <summary>
        /// Tests <see cref="VehiclesController.GetVehicleByUuid(Guid)"/>
        /// Similar to the test method above, except that this one takes <see cref="Guid"/> instead of <see cref="ulong"/> />
        /// </summary>
        /// <param name="uuid">The UUID of the Vehicle to be searched</param>
        [Theory]
        [MemberData(nameof(ValidVehicleUuid))]
        [MemberData(nameof(InvalidVehicleUuid))]
        public async void VehiclesController_GetVehicleByUuid(Guid uuid)
        {
            try
            {
                var options = new DbContextOptionsBuilder<NMTFleetManagerContext>()
                    .UseSqlite(connection)
                    .Options;

                using (context = new NMTFleetManagerContext(options))
                {
                    context.Database.OpenConnection();
                    context.Database.EnsureCreated();
                }

                using (context = new NMTFleetManagerContext(options))
                {
                    SeedCollection seedCollection = SeedData.Seed();
                    context.Vehicles.AddRange(seedCollection.Vehicles);
                    context.SaveChanges();
                }

                using (context = new NMTFleetManagerContext(options))
                {
                    var expected = await context.Vehicles.SingleOrDefaultAsync(v => v.Uuid == uuid);

                    vehiclesController = new VehiclesController(context);
                    var actionResult = await vehiclesController.GetVehicleByUuid(uuid);


                    if (expected == null)
                    {
                        Assert.IsType<NotFoundResult>(actionResult.Result);
                    }
                    else
                    {
                        var okResult = actionResult.Result as OkObjectResult;
                        var actual = okResult?.Value as Vehicle;

                        Assert.Equal(expected, actual);
                    }
                }
            }
            finally
            {
                connection.Close();
            }
        }

        /// <summary>
        /// Tests <see cref="VehiclesController.PutVehicle(Guid, Vehicle)"/> from <see cref="VehiclesController"/>
        /// If both <paramref name="uuid"/> and <paramref name="vehicle"/> are valid, an existing vehicle in the context should be updated
        /// Otherwise, if one of them is invalid (or both are invalid) the corresponding vehicle should not be updated
        /// </summary>
        /// <param name="uuid">UUID of the <see cref="Vehicle"/> to be updated</param>
        /// <param name="vehicle">updated <see cref="Vehicle"/></param>
        [Theory]
        [MemberData(nameof(InvalidVehicleToBeUpdated))]
        [MemberData(nameof(ValidVehicleToBeUpdated))]
        public async void VehiclesController_PutVehicle(Guid uuid, Vehicle vehicle)
        {
            try
            {
                var options = new DbContextOptionsBuilder<NMTFleetManagerContext>()
                    .UseSqlite(connection)
                    .Options;

                using (context = new NMTFleetManagerContext(options))
                {
                    context.Database.OpenConnection();
                    context.Database.EnsureCreated();
                }

                using (context = new NMTFleetManagerContext(options))
                {
                    SeedCollection seedCollection = SeedData.Seed();
                    context.Vehicles.AddRange(seedCollection.Vehicles);
                    context.SaveChanges();
                }

                using (context = new NMTFleetManagerContext(options))
                {
                    var controller = new VehiclesController(context);
                    var actionResult = await controller.PutVehicle(uuid, vehicle);

                    bool validVehicle = await context.Vehicles.AnyAsync(v => v.Uuid == uuid && v.Uuid == vehicle.Uuid);

                    if (validVehicle)
                    {
                        Assert.IsType<NoContentResult>(actionResult);
                        var expected = vehicle;
                        var actual = await context.Vehicles.SingleOrDefaultAsync(v => v.Uuid == uuid);

                        output.WriteLine(expected.ToString());
                        output.WriteLine(actual.ToString());

                        Assert.Equal(expected, actual);
                    }
                    else
                    {
                        Assert.IsNotType<NoContentResult>(actionResult);

                        var invalidVehicle = vehicle;
                        var actual = await context.Vehicles.SingleOrDefaultAsync(v => v.Uuid == uuid);

                        if (actual == null)
                        {
                            actual = await context.Vehicles.SingleOrDefaultAsync(v => v.Uuid == vehicle.Uuid);

                            if (actual == null)
                            {
                                // since actual does not refer to any existing vehicle in the context, pass test
                                Assert.Null(actual);
                                return;
                            }
                        }

                        // ensure that the corresponding vehicle in the context has not been updated
                        Assert.NotEqual(invalidVehicle.Odometer, actual.Odometer);
                        Assert.NotEqual(invalidVehicle.Registration, actual.Registration);
                    }
                }
            }
            finally
            {
                connection.Close();
            }
        }


    }
}
