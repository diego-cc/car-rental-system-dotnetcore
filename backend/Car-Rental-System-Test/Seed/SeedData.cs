using Car_Rental_System_API;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace Car_Rental_System_Test.Seed
{
    public class SeedData
    {
        public static SeedCollection Seed()
        {
            // TODO: Seed more vehicles, bookings, journeys, fuel purchases, services kthx
            // See nmt_fleet_manager_backuo.sql for reference

            IEnumerable<Vehicle> vehicles = new List<Vehicle>
            {
                new Vehicle
                {
                    Id = 1,
                    Uuid = Guid.Parse("23c07876-a967-4cf0-bf22-0fdeaf7beb06"),
                    Manufacturer = "Bugatti",
                    Model = "Veyron 16.4 Super Sport",
                    Year = 2011,
                    Odometer = 1500.00M,
                    Registration = "1VEYRON",
                    FuelType = "Petrol",
                    TankSize = 100.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:10:39", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new Vehicle
                {
                    Id = 2,
                    Uuid = Guid.Parse("37b80138-56e3-4834-9870-5c618e648d0c"),
                    Manufacturer = "Ford",
                    Model = "Ranger XL",
                    Year = 2015,
                    Odometer = 800.00M,
                    Registration = "1GVL526",
                    FuelType = "Petrol",
                    TankSize = 80.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:10:39", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new Vehicle
                {
                    Id = 3,
                    Uuid = Guid.Parse("3fc41603-8b8a-4207-bba4-a49095f36692"),
                    Manufacturer = "Tesla",
                    Model = "Roadster",
                    Year = 2008,
                    Odometer = 11000.00M,
                    Registration = "8HDZ576",
                    FuelType = "Electric",
                    TankSize = 0.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:10:39", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new Vehicle
                {
                    Id = 4,
                    Uuid = Guid.Parse("6cf6b703-c154-4e34-a79f-de9be3d10d88"),
                    Manufacturer = "Land Rover",
                    Model = "Defender",
                    Year = 2015,
                    Odometer = 15500.00M,
                    Registration = "BCZ5810",
                    FuelType = "Unknown",
                    TankSize = 60.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:10:39", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new Vehicle
                {
                    Id = 5,
                    Uuid = Guid.Parse("6f818b4c-da01-491b-aed9-5c51771051a5"),
                    Manufacturer = "Holden",
                    Model = "Commodore LT",
                    Year = 2018,
                    Odometer = 20200.00M,
                    Registration = "1GXI000",
                    FuelType = "Petrol",
                    TankSize = 61.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:10:39", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                }
            };

            IEnumerable<Booking> bookings = new List<Booking>
            {
                new Booking
                {
                    Id = 1,
                    Uuid = Guid.Parse("3e933953-5b14-40b9-b04c-00c968d49d39"),
                    VehicleId = 1,
                    VehicleUuid = Guid.Parse("23c07876-a967-4cf0-bf22-0fdeaf7beb06"),
                    StartedAt = DateTime.ParseExact("2019-11-28 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    EndedAt = DateTime.ParseExact("2019-11-29 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    StartOdometer = 900.00M,
                    Type = "D",
                    Cost = 100.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:10:50", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
               new Booking
                {
                    Id = 2,
                    Uuid = Guid.Parse("a6bd0071-77cd-46a1-a338-8c897e4108b0"),
                    VehicleId = 2,
                    VehicleUuid = Guid.Parse("37b80138-56e3-4834-9870-5c618e648d0c"),
                    StartedAt = DateTime.ParseExact("2019-11-28 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    EndedAt = DateTime.ParseExact("2019-11-30 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    StartOdometer = 500.00M,
                    Type = "K",
                    Cost = 0.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:10:50", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
               new Booking
                {
                    Id = 3,
                    Uuid = Guid.Parse("963bc486-cc1a-4463-8cfb-98b0782f115a"),
                    VehicleId = 3,
                    VehicleUuid = Guid.Parse("3fc41603-8b8a-4207-bba4-a49095f36692"),
                    StartedAt = DateTime.ParseExact("2019-11-28 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    EndedAt = DateTime.ParseExact("2019-12-04 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    StartOdometer = 10000.00M,
                    Type = "D",
                    Cost = 600.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:10:50", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
               new Booking
                {
                    Id = 4,
                    Uuid = Guid.Parse("71e8702f-d387-4722-80b2-f5486ef7793e"),
                    VehicleId = 4,
                    VehicleUuid = Guid.Parse("6cf6b703-c154-4e34-a79f-de9be3d10d88"),
                    StartedAt = DateTime.ParseExact("2019-12-05 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    EndedAt = DateTime.ParseExact("2019-12-07 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    StartOdometer = 15000.00M,
                    Type = "K",
                    Cost = 0.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:10:50", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
               new Booking
                {
                    Id = 5,
                    Uuid = Guid.Parse("0113f97c-eee1-46dd-a779-04f268db536a"),
                    VehicleId = 5,
                    VehicleUuid = Guid.Parse("6f818b4c-da01-491b-aed9-5c51771051a5"),
                    StartedAt = DateTime.ParseExact("2019-12-13 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    EndedAt = DateTime.ParseExact("2019-12-20 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    StartOdometer = 20000.00M,
                    Type = "D",
                    Cost = 700.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:10:50", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                }
            };

            IEnumerable<Journey> journeys = new List<Journey>
            {
                new Journey
                {
                    Id = 1,
                    Uuid = Guid.Parse("83d2722f-baf5-4632-85a1-4cb1c02185ee"),
                    BookingId = 1,
                    BookingUuid = Guid.Parse("3e933953-5b14-40b9-b04c-00c968d49d39"),
                    VehicleId = 1,
                    VehicleUuid = Guid.Parse("23c07876-a967-4cf0-bf22-0fdeaf7beb06"),
                    StartedAt = DateTime.ParseExact("2019-11-28 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    EndedAt = DateTime.ParseExact("2019-11-29 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    JourneyFrom = "Perth",
                    JourneyTo = "Geraldton",
                    StartOdometer = 900.00M,
                    EndOdometer = 1315.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:12", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new Journey
                {
                    Id = 2,
                    Uuid = Guid.Parse("ff55c6c4-7988-4197-9779-c8702520745a"),
                    BookingId = 2,
                    BookingUuid = Guid.Parse("a6bd0071-77cd-46a1-a338-8c897e4108b0"),
                    VehicleId = 2,
                    VehicleUuid = Guid.Parse("37b80138-56e3-4834-9870-5c618e648d0c"),
                    StartedAt = DateTime.ParseExact("2019-11-29 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    EndedAt = DateTime.ParseExact("2019-11-30 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    JourneyFrom = "Perth",
                    JourneyTo = "Subiaco",
                    StartOdometer = 500.00M,
                    EndOdometer = 504.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:12", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new Journey
                {
                    Id = 3,
                    Uuid = Guid.Parse("2e0dfc1f-5042-4be1-9241-7febfea5dc89"),
                    BookingId = 3,
                    BookingUuid = Guid.Parse("963bc486-cc1a-4463-8cfb-98b0782f115a"),
                    VehicleId = 3,
                    VehicleUuid = Guid.Parse("3fc41603-8b8a-4207-bba4-a49095f36692"),
                    StartedAt = DateTime.ParseExact("2019-11-28 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    EndedAt = DateTime.ParseExact("2019-11-29 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    JourneyFrom = "Perth",
                    JourneyTo = "Margaret River",
                    StartOdometer = 10000.00M,
                    EndOdometer = 10270.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:12", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new Journey
                {
                    Id = 4,
                    Uuid = Guid.Parse("c27dea31-25aa-4efe-8411-327e9b934144"),
                    BookingId = 4,
                    BookingUuid = Guid.Parse("71e8702f-d387-4722-80b2-f5486ef7793e"),
                    VehicleId = 4,
                    VehicleUuid = Guid.Parse("6cf6b703-c154-4e34-a79f-de9be3d10d88"),
                    StartedAt = DateTime.ParseExact("2019-12-05 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    EndedAt = DateTime.ParseExact("2019-12-06 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    JourneyFrom = "Perth",
                    JourneyTo = "Lancelin",
                    StartOdometer = 15000.00M,
                    EndOdometer = 15122.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:12", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new Journey
                {
                    Id = 5,
                    Uuid = Guid.Parse("9521972a-e38d-4830-a43a-77b1868c634b"),
                    BookingId = 5,
                    BookingUuid = Guid.Parse("0113f97c-eee1-46dd-a779-04f268db536a"),
                    VehicleId = 5,
                    VehicleUuid = Guid.Parse("6f818b4c-da01-491b-aed9-5c51771051a5"),
                    StartedAt = DateTime.ParseExact("2019-12-13 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    EndedAt = DateTime.ParseExact("2019-12-13 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    JourneyFrom = "Perth",
                    JourneyTo = "Joondalup",
                    StartOdometer = 20000.00M,
                    EndOdometer = 20025.00M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:12", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                }
            };

            IEnumerable<FuelPurchase> fuelPurchases = new List<FuelPurchase>
            {
                new FuelPurchase
                {
                    Id = 1,
                    Uuid = Guid.Parse("faf91e4f-a948-41e2-b524-e267f4e8d75d"),
                    BookingId = 1,
                    BookingUuid = Guid.Parse("3e933953-5b14-40b9-b04c-00c968d49d39"),
                    VehicleId = 1,
                    VehicleUuid = Guid.Parse("23c07876-a967-4cf0-bf22-0fdeaf7beb06"),
                    FuelQuantity = 60.00M,
                    FuelPrice = 1.20M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:24", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new FuelPurchase
                {
                    Id = 2,
                    Uuid = Guid.Parse("55853368-d34e-45cf-a03b-4529281d3a10"),
                    BookingId = 2,
                    BookingUuid = Guid.Parse("a6bd0071-77cd-46a1-a338-8c897e4108b0"),
                    VehicleId = 2,
                    VehicleUuid = Guid.Parse("37b80138-56e3-4834-9870-5c618e648d0c"),
                    FuelQuantity = 10.00M,
                    FuelPrice = 1.30M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:24", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new FuelPurchase
                {
                    Id = 3,
                    Uuid = Guid.Parse("b62ac6b8-ad5d-4f96-825d-6658471b26d1"),
                    BookingId = 4,
                    BookingUuid = Guid.Parse("71e8702f-d387-4722-80b2-f5486ef7793e"),
                    VehicleId = 4,
                    VehicleUuid = Guid.Parse("6cf6b703-c154-4e34-a79f-de9be3d10d88"),
                    FuelQuantity = 30.00M,
                    FuelPrice = 1.40M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:24", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new FuelPurchase
                {
                    Id = 4,
                    Uuid = Guid.Parse("39f06ed5-a685-4619-b20b-aeefc49e4ee7"),
                    BookingId = 5,
                    BookingUuid = Guid.Parse("0113f97c-eee1-46dd-a779-04f268db536a"),
                    VehicleId = 5,
                    VehicleUuid = Guid.Parse("6f818b4c-da01-491b-aed9-5c51771051a5"),
                    FuelQuantity = 5.00M,
                    FuelPrice = 1.20M,
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:24", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                }
            };

            IEnumerable<Service> services = new List<Service>
            {
                new Service
                {
                    Id = 1,
                    Uuid = Guid.Parse("67f7fcc5-e591-401c-ba5c-7eb49409fc2e"),
                    VehicleId = 1,
                    VehicleUuid = Guid.Parse("23c07876-a967-4cf0-bf22-0fdeaf7beb06"),
                    Odometer = 1400.00M,
                    ServicedAt = DateTime.ParseExact("2019-12-04 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:37", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new Service
                {
                    Id = 2,
                    Uuid = Guid.Parse("a9d9f0af-95d2-47fd-9450-a8a8c5b6fb2e"),
                    VehicleId = 2,
                    VehicleUuid = Guid.Parse("37b80138-56e3-4834-9870-5c618e648d0c"),
                    Odometer = 600.00M,
                    ServicedAt = DateTime.ParseExact("2019-12-02 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:37", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new Service
                {
                    Id = 3,
                    Uuid = Guid.Parse("d4307f3a-6637-45d3-8fc6-38844da4fc96"),
                    VehicleId = 3,
                    VehicleUuid = Guid.Parse("3fc41603-8b8a-4207-bba4-a49095f36692"),
                    Odometer = 10300.00M,
                    ServicedAt = DateTime.ParseExact("2019-12-06 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:37", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new Service
                {
                    Id = 4,
                    Uuid = Guid.Parse("cae0f850-f55f-4d1b-a6d3-96bcce4fa7ec"),
                    VehicleId = 4,
                    VehicleUuid = Guid.Parse("6cf6b703-c154-4e34-a79f-de9be3d10d88"),
                    Odometer = 15200.00M,
                    ServicedAt = DateTime.ParseExact("2019-12-12 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:37", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                },
                new Service
                {
                    Id = 5,
                    Uuid = Guid.Parse("f4a0a09c-315f-4c51-aba1-feee8f2e81cf"),
                    VehicleId = 5,
                    VehicleUuid = Guid.Parse("6f818b4c-da01-491b-aed9-5c51771051a5"),
                    Odometer = 20100.00M,
                    ServicedAt = DateTime.ParseExact("2019-12-21 00:00:00", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    CreatedAt = DateTime.ParseExact("2019-12-12 02:11:37", "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture)
                }
            };

            return new SeedCollection(vehicles, bookings, journeys, fuelPurchases, services);
        }
    }
}
