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
    [Route("api/fuel_purchases")]
    [Route("api/[controller]")]
    [ApiController]
    public class FuelPurchasesController : ControllerBase
    {
        private readonly NMTFleetManagerContext _context;

        public FuelPurchasesController(NMTFleetManagerContext context)
        {
            _context = context;
        }

        // GET: api/FuelPurchases
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FuelPurchase>>> GetFuelPurchases()
        {
            var fuelPurchases = await _context.FuelPurchases.ToListAsync();
            var vehicles = await _context.Vehicles.ToListAsync();
            var bookings = await _context.Bookings.ToListAsync();

            var mappedFuelPurchases = fuelPurchases.Select(f =>
            {
                // map corresponding booking to this fuel purchase
                var correspondingBooking = bookings.Find(b =>
                (b.Id == f.BookingId) && (b.Uuid == f.BookingUuid));
                f.Booking = correspondingBooking;

                // map corresponding vehicle to this fuel purchase
                var correspondingVehicle = vehicles.Find(v =>
                (v.Id == f.VehicleId) && (v.Uuid == f.VehicleUuid));
                f.Vehicle = correspondingVehicle;

                return f;
            });

            return Ok(mappedFuelPurchases);
        }

        // GET: api/FuelPurchases/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FuelPurchase>> GetFuelPurchase(ulong id)
        {
            var fuelPurchase = await _context.FuelPurchases.FindAsync(id);

            if (fuelPurchase == null)
            {
                return NotFound();
            }

            return fuelPurchase;
        }

        // PUT: api/FuelPurchases/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFuelPurchase(ulong id, FuelPurchase fuelPurchase)
        {
            if (id != fuelPurchase.Id)
            {
                return BadRequest();
            }

            _context.Entry(fuelPurchase).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FuelPurchaseExists(id))
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

        // POST: api/FuelPurchases
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<FuelPurchase>> PostFuelPurchase(FuelPurchase fuelPurchase)
        {
            _context.FuelPurchases.Add(fuelPurchase);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFuelPurchase", new { id = fuelPurchase.Id }, fuelPurchase);
        }

        // DELETE: api/FuelPurchases/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<FuelPurchase>> DeleteFuelPurchase(ulong id)
        {
            var fuelPurchase = await _context.FuelPurchases.FindAsync(id);
            if (fuelPurchase == null)
            {
                return NotFound();
            }

            _context.FuelPurchases.Remove(fuelPurchase);
            await _context.SaveChangesAsync();

            return fuelPurchase;
        }

        private bool FuelPurchaseExists(ulong id)
        {
            return _context.FuelPurchases.Any(e => e.Id == id);
        }
    }
}
