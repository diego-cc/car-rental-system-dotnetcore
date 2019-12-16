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
        [HttpGet("{id:long}")]
        public async Task<ActionResult<FuelPurchase>> GetFuelPurchase(ulong id)
        {
            var fuelPurchase = await _context.FuelPurchases.FindAsync(id);

            if (fuelPurchase == null)
            {
                return NotFound();
            }

            return fuelPurchase;
        }

        // GET: api/FuelPurchases/65680537-130d-4469-83cb-5c407721f736
        [HttpGet("{uuid:guid}")]
        public async Task<ActionResult<FuelPurchase>> GetFuelPurchase(Guid uuid)
        {
            var fuelPurchase = await _context.FuelPurchases.SingleOrDefaultAsync(f => f.Uuid == uuid);

            if (fuelPurchase == null)
            {
                return NotFound();
            }

            return fuelPurchase;
        }

        // PUT: api/FuelPurchases/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id:long}")]
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
            var associatedVehicle = await _context.Vehicles.SingleOrDefaultAsync(v => v.Uuid == fuelPurchase.VehicleUuid);
            var associatedBooking = await _context.Bookings.SingleOrDefaultAsync(b => b.Uuid == fuelPurchase.BookingUuid);

            if (associatedVehicle == null || associatedBooking == null)
            {
                return BadRequest();
            }

            fuelPurchase.Vehicle = associatedVehicle;
            fuelPurchase.Booking = associatedBooking;

            fuelPurchase.VehicleId = associatedVehicle.Id;
            fuelPurchase.BookingId = associatedBooking.Id;

            _context.FuelPurchases.Add(fuelPurchase);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFuelPurchase", new { id = fuelPurchase.Id }, fuelPurchase);
        }

        // DELETE: api/FuelPurchases/5
        [HttpDelete("{id:long}")]
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

        // DELETE: api/FuelPurchases/65680537-130d-4469-83cb-5c407721f736
        [HttpDelete("{uuid:guid}")]
        public async Task<ActionResult<FuelPurchase>> DeleteFuelPurchase(Guid uuid)
        {
            var fuelPurchase = await _context.FuelPurchases.SingleOrDefaultAsync(f => f.Uuid == uuid);

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
