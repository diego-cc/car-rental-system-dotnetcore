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
    public class JourneysController : ControllerBase
    {
        private readonly NMTFleetManagerContext _context;

        public JourneysController(NMTFleetManagerContext context)
        {
            _context = context;
        }

        // GET: api/Journeys
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Journey>>> GetJourneys()
        {
            var journeys = await _context.Journeys.ToListAsync();
            var vehicles = await _context.Vehicles.ToListAsync();
            var bookings = await _context.Bookings.ToListAsync();

            IEnumerable<Journey> mappedJourneys = journeys.Select(j =>
            {
                // map corresponding vehicle to this journey
                var correspondingVehicle = vehicles.Find(v => 
                (v.Id == j.VehicleId) && (v.Uuid == j.VehicleUuid));
                j.Vehicle = correspondingVehicle;

                // map corresponding booking to this journey
                var correspondingBooking = bookings.Find(b =>
                (b.Id == j.BookingId) && (b.Uuid == j.BookingUuid));
                j.Booking = correspondingBooking;

                return j;
            });

            return Ok(mappedJourneys);
        }

        // GET: api/Journeys/5
        [HttpGet("{id:long}")]
        public async Task<ActionResult<Journey>> GetJourney(ulong id)
        {
            var journey = await _context.Journeys.FindAsync(id);

            if (journey == null)
            {
                return NotFound();
            }

            return journey;
        }

        // GET: api/Journeys/65680537-130d-4469-83cb-5c407721f736
        [HttpGet("{uuid:guid}")]
        public async Task<ActionResult<Journey>> GetJourney(Guid uuid)
        {
            var journey = await _context.Journeys.SingleOrDefaultAsync(j => j.Uuid == uuid);

            if (journey == null)
            {
                return NotFound();
            }

            var associatedBooking = await _context.Bookings.SingleOrDefaultAsync(b => b.Uuid == journey.BookingUuid);
            var associatedVehicle = await _context.Vehicles.SingleOrDefaultAsync(v => v.Uuid == journey.VehicleUuid);

            journey.Vehicle = associatedVehicle;
            journey.Booking = associatedBooking;

            return Ok(journey);
        }

        // PUT: api/Journeys/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id:long}")]
        public async Task<IActionResult> PutJourney(ulong id, Journey journey)
        {
            if (id != journey.Id)
            {
                return BadRequest();
            }

            _context.Entry(journey).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JourneyExists(id))
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

        // POST: api/Journeys
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Journey>> PostJourney(Journey journey)
        {
            var associatedVehicle = await _context.Vehicles.SingleOrDefaultAsync(v => v.Uuid == journey.VehicleUuid);
            var associatedBooking = await _context.Bookings.SingleOrDefaultAsync(b => b.Uuid == journey.BookingUuid);

            journey.Vehicle = associatedVehicle;
            journey.Booking = associatedBooking;

            journey.VehicleId = associatedVehicle.Id;
            journey.BookingId = associatedBooking.Id;

            _context.Journeys.Add(journey);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJourney), new { uuid = journey.Uuid }, journey);
        }

        // DELETE: api/Journeys/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Journey>> DeleteJourney(ulong id)
        {
            var journey = await _context.Journeys.FindAsync(id);
            if (journey == null)
            {
                return NotFound();
            }

            _context.Journeys.Remove(journey);
            await _context.SaveChangesAsync();

            return journey;
        }

        // DELETE: api/Journeys/65680537-130d-4469-83cb-5c407721f736
        [HttpDelete("{uuid:guid}")]
        public async Task<ActionResult<Journey>> DeleteJourney(Guid uuid)
        {
            var journey = await _context.Journeys.SingleOrDefaultAsync(j => j.Uuid == uuid);

            if (journey == null)
            {
                return NotFound();
            }

            _context.Journeys.Remove(journey);
            await _context.SaveChangesAsync();

            return journey;
        }

        private bool JourneyExists(ulong id)
        {
            return _context.Journeys.Any(e => e.Id == id);
        }

        private bool JourneyExists(Guid uuid)
        {
            return _context.Journeys.Any(j => j.Uuid == uuid);
        }
    }
}
