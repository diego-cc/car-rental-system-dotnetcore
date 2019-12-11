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
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles()
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
            return Ok(mappedVehicles);
        }

        // GET: api/Vehicles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Vehicle>> GetVehicle(ulong id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);

            if (vehicle == null)
            {
                return NotFound();
            }

            return vehicle;
        }

        // PUT: api/Vehicles/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
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

        // POST: api/Vehicles
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Vehicle>> PostVehicle(Vehicle vehicle)
        {
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVehicle", new { id = vehicle.Id }, vehicle);
        }

        // DELETE: api/Vehicles/5
        [HttpDelete("{id}")]
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

        private bool VehicleExists(ulong id)
        {
            return _context.Vehicles.Any(e => e.Id == id);
        }
    }
}
