using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Car_Rental_System_API;

namespace Car_Rental_System_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiclesController : ControllerBase
    {
        private readonly NMTFleetManagerContext _context;

        public VehiclesController(NMTFleetManagerContext context)
        {
            _context = context;
        }

        // GET: api/Vehicles
        [HttpGet]
        public async Task<IEnumerable<Vehicle>> GetVehicles()
        {
            var mappedVehicles = await MapPropertiesToVehicles();
            return mappedVehicles;
        }

        // GET: api/Vehicles/5
        [HttpGet("{id:long}")]
        public async Task<ActionResult<Vehicle>> GetVehicleById(ulong id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);

            if (vehicle == null)
            {
                return NotFound();
            }
            else
            {
                var mappedVehicle = await MapPropertiesToVehicle(vehicle);
                return Ok(mappedVehicle);
            }
        }

        // GET: api/Vehicles/65680537-130d-4469-83cb-5c407721f736
        [HttpGet("{uuid:guid}")]
        public async Task<ActionResult<Vehicle>> GetVehicleByUuid(Guid uuid)
        {
            var vehicle = await _context.Vehicles.SingleOrDefaultAsync(v => v.Uuid == uuid);

            if (vehicle == null)
            {
                return NotFound();
            }
            else
            {
                var mappedVehicle = await MapPropertiesToVehicle(vehicle);
                return Ok(vehicle);
            }
        }

        // PUT: api/Vehicles/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id:long}")]
        public async Task<IActionResult> PutVehicle(ulong id, Vehicle vehicle)
        {
            if (id != vehicle.Id)
            {
                return BadRequest();
            }

            _context.Entry(vehicle).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehicleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // PUT: /api/Vehicles/65680537-130d-4469-83cb-5c407721f736
        [HttpPut("{uuid:guid}")]
        public async Task<IActionResult> PutVehicle(Guid uuid, [FromBody]Vehicle vehicle)
        {
            var vehicleToBeModified = await _context.Vehicles.SingleOrDefaultAsync(v => v.Uuid == uuid);

            if (vehicleToBeModified == null)
            {
                return BadRequest();
            }

            vehicleToBeModified.Manufacturer = vehicle.Manufacturer;
            vehicleToBeModified.Model = vehicle.Model;
            vehicleToBeModified.Year = vehicle.Year;
            vehicleToBeModified.Odometer = vehicle.Odometer;
            vehicleToBeModified.Registration = vehicle.Registration;
            vehicleToBeModified.TankSize = vehicle.TankSize;

            _context.Entry(vehicleToBeModified).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehicleExists(uuid))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Vehicles
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Vehicle>> PostVehicle(Vehicle vehicle)
        {
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVehicleByUuid), new { uuid = vehicle.Uuid }, vehicle);
        }

        // DELETE: api/Vehicles/5
        [HttpDelete("{id:long}")]
        public async Task<ActionResult<Vehicle>> DeleteVehicle(ulong id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound();
            }

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return vehicle;
        }

        // DELETE: api/Vehicles/65680537-130d-4469-83cb-5c407721f736
        [HttpDelete("{uuid:guid}")]
        public async Task<ActionResult<Vehicle>> DeleteVehicle(Guid uuid)
        {
            var vehicle = await _context.Vehicles.SingleOrDefaultAsync(v => v.Uuid == uuid);
            if (vehicle == null)
            {
                return NotFound();
            }

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return vehicle;
        }

        private bool VehicleExists(ulong id)
        {
            return _context.Vehicles.Any(e => e.Id == id);
        }

        private bool VehicleExists(Guid uuid)
        {
            return _context.Vehicles.Any(v => v.Uuid == uuid);
        }

        private async Task<Vehicle> MapPropertiesToVehicle(Vehicle vehicle)
        {
            // map bookings, journeys, fuel purchases and services to this vehicle
            var bookings = await _context.Bookings.Where(
                b => b.VehicleId == vehicle.Id
                )
                .ToListAsync();

            var journeys = await _context.Journeys.Where(
                j => j.VehicleId == vehicle.Id
                )
                .ToListAsync();

            var fuelPurchases = await _context.FuelPurchases.Where(
                f => f.VehicleId == vehicle.Id
                )
                .ToListAsync();

            var services = await _context.Services.Where(
                s => s.VehicleId == vehicle.Id
                )
                .ToListAsync();

            vehicle.Bookings = bookings;
            vehicle.Journeys = journeys;
            vehicle.FuelPurchases = fuelPurchases;
            vehicle.Services = services;

            return vehicle;
        }

        public async Task<IEnumerable<Vehicle>> MapPropertiesToVehicles()
        {
            var vehicles = await _context.Vehicles.ToListAsync();
            var bookings = await _context.Bookings.ToListAsync();
            var journeys = await _context.Journeys.ToListAsync();
            var fuelPurchases = await _context.FuelPurchases.ToListAsync();
            var services = await _context.Services.ToListAsync();

            var mappedVehicles = vehicles.Select(v =>
            {
                // map bookings associated with this vehicle
                var correspondingBookings = bookings.FindAll(b =>
                (b.VehicleId == v.Id) && (b.VehicleUuid == v.Uuid));
                v.Bookings = correspondingBookings;

                // map journeys associated with this vehicle
                var correspondingJourneys = journeys.FindAll(j =>
                (j.VehicleId == v.Id) && (j.VehicleUuid == v.Uuid));
                v.Journeys = correspondingJourneys;

                // map fuelPurchases associated with this vehicle
                var correspondingFuelPurchases = fuelPurchases.FindAll(f =>
                (f.VehicleId == v.Id) && (f.VehicleUuid == v.Uuid));
                v.FuelPurchases = correspondingFuelPurchases;

                // map services associated with this vehicle
                var correspondingServices = services.FindAll(s =>
                (s.VehicleId == v.Id) && (s.VehicleUuid == v.Uuid));
                v.Services = correspondingServices;

                return v;
            });

            return mappedVehicles;
        }
    }
}
