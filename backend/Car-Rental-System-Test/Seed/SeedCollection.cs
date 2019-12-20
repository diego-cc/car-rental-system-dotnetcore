using Car_Rental_System_API;
using System;
using System.Collections.Generic;
using System.Text;

namespace Car_Rental_System_Test.Seed
{
    public class SeedCollection
    {
        public IEnumerable<Vehicle> Vehicles { get; set; }
        public IEnumerable<Booking> Bookings { get; set; }
        public IEnumerable<Journey> Journeys { get; set; }
        public IEnumerable<FuelPurchase> FuelPurchases { get; set; }
        public IEnumerable<Service> Services { get; set; }

        public SeedCollection(IEnumerable<Vehicle> vehicles, IEnumerable<Booking> bookings, IEnumerable<Journey> journeys, IEnumerable<FuelPurchase> fuelPurchases, IEnumerable<Service> services)
        {
            Vehicles = vehicles;
            Bookings = bookings;
            Services = services;
            Journeys = journeys;
            FuelPurchases = fuelPurchases;
        }
    }
}
