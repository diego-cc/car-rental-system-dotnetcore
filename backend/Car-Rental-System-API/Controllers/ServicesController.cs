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
    public class ServicesController : ControllerBase
    {
        private readonly NMTFleetManagerContext _context;

        public ServicesController(NMTFleetManagerContext context)
        {
            _context = context;
        }

        // GET: api/Services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            var services = await _context.Services.ToListAsync();
            var vehicles = await _context.Vehicles.ToListAsync();

            var mappedServices = services.Select(s =>
            {
                // map corresponding vehicle to this service
                var correspondingVehicle = vehicles.Find(v =>
                (v.Id == s.VehicleId) && (v.Uuid == s.VehicleUuid));
                s.Vehicle = correspondingVehicle;

                return s;
            });

            return Ok(mappedServices);
        }

        // GET: api/Services/5
        [HttpGet("{id:long}")]
        public async Task<ActionResult<Service>> GetService(ulong id)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
            {
                return NotFound();
            }

            return service;
        }

        // GET: api/Services/65680537-130d-4469-83cb-5c407721f736
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Service>> GetService(Guid uuid)
        {
            var service = await _context.Services.SingleOrDefaultAsync(s => s.Uuid == uuid);

            if (service == null)
            {
                return NotFound();
            }

            var associatedVehicle = await _context.Vehicles.SingleOrDefaultAsync(v => v.Uuid == service.VehicleUuid);
            service.Vehicle = associatedVehicle;

            return service;
        }

        // PUT: api/Services/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutService(ulong id, Service service)
        {
            if (id != service.Id)
            {
                return BadRequest();
            }

            _context.Entry(service).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
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

        // POST: api/Services
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Service>> PostService(Service service)
        {
            var associatedVehicle = await _context.Vehicles.SingleOrDefaultAsync(v => v.Uuid == service.VehicleUuid);

            if (associatedVehicle == null)
            {
                return BadRequest();
            }

            service.VehicleId = associatedVehicle.Id;
            service.Vehicle = associatedVehicle;

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetService), new { id = service.Id }, service);
        }

        // DELETE: api/Services/5
        [HttpDelete("{id:long}")]
        public async Task<ActionResult<Service>> DeleteService(ulong id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return service;
        }

        // DELETE: api/Services/65680537-130d-4469-83cb-5c407721f736
        [HttpDelete("{uuid:long}")]
        public async Task<ActionResult<Service>> DeleteService(Guid uuid)
        {
            var service = await _context.Services.SingleOrDefaultAsync(s => s.Uuid == uuid);

            if (service == null)
            {
                return NotFound();
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return service;
        }

        private bool ServiceExists(ulong id)
        {
            return _context.Services.Any(e => e.Id == id);
        }
        
        private bool ServiceExists(Guid uuid)
        {
            return _context.Services.Any(s => s.Uuid == uuid);
        }
    }
}
