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
        [HttpGet("{id}")]
        public async Task<ActionResult<Journey>> GetJourney(ulong id)
        {
            var journey = await _context.Journeys.FindAsync(id);

            if (journey == null)
            {
                return NotFound();
            }

            return journey;
        }

        // PUT: api/Journeys/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
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
            _context.Journeys.Add(journey);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetJourney", new { id = journey.Id }, journey);
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

        private bool JourneyExists(ulong id)
        {
            return _context.Journeys.Any(e => e.Id == id);
        }
    }
}
