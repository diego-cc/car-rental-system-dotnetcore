using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Car_Rental_System_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly NMTFleetManagerContext _context;

        public BookingsController(NMTFleetManagerContext context)
        {
            _context = context;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            var bookings = await _context.Bookings.ToListAsync();
            var vehicles = await _context.Vehicles.ToListAsync();

            var mappedBookings = bookings.Select(b =>
            {
                // map corresponding vehicle to this booking
                var correspondingVehicle = vehicles.Find(v =>
                (v.Id == b.VehicleId) && (v.Uuid == b.VehicleUuid));
                b.Vehicle = correspondingVehicle;

                return b;
            });

            return Ok(mappedBookings);
        }

        // GET: api/Bookings/5
        [HttpGet("{id:long}")]
        public async Task<ActionResult<Booking>> GetBooking(ulong id)
        {
            var booking = await _context.Bookings.FindAsync(id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }

        // GET: api/Bookings/65680537-130d-4469-83cb-5c407721f736
        [HttpGet("{uuid:guid}")]
        public async Task<ActionResult<Booking>> GetBooking(Guid uuid)
        {
            var booking = await _context.Bookings.SingleOrDefaultAsync(b => b.Uuid == uuid);

            if (booking == null)
            {
                return NotFound();
            }

            var correspondingJourneys = await _context.Journeys.Where(j => j.BookingUuid == uuid).ToListAsync();

            var correspondingFuelPurchases = await _context.FuelPurchases.Where(f => f.BookingUuid == uuid).ToListAsync();

            booking.Journeys = correspondingJourneys;
            booking.FuelPurchases = correspondingFuelPurchases;

            return booking;
        }

        // PUT: api/Bookings/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooking(ulong id, Booking booking)
        {
            if (id != booking.Id)
            {
                return BadRequest();
            }

            _context.Entry(booking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(id))
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

        // POST: api/Bookings
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Booking>> PostBooking([FromBody]Booking booking)
        {
            var associatedVehicle = await _context.Vehicles.SingleOrDefaultAsync(v => v.Uuid == booking.VehicleUuid);

            if (associatedVehicle != null)
            {
                booking.Vehicle = associatedVehicle;
                booking.VehicleId = associatedVehicle.Id;
            }

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBooking), new { uuid = booking.Uuid }, booking);
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id:long}")]
        public async Task<ActionResult<Booking>> DeleteBooking(ulong id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return booking;
        }

        // DELETE: api/Bookings/65680537-130d-4469-83cb-5c407721f736
        [HttpDelete("{uuid:guid}")]
        public async Task<ActionResult<Booking>> DeleteBooking(Guid uuid)
        {
            var booking = await _context.Bookings.SingleOrDefaultAsync(b => b.Uuid == uuid);
            if (booking == null)
            {
                return NotFound();
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return booking;
        }

        private bool BookingExists(ulong id)
        {
            return _context.Bookings.Any(e => e.Id == id);
        }

        private bool BookingExists(Guid uuid)
        {
            return _context.Bookings.Any(b => b.Uuid == uuid);
        }
    }
}
