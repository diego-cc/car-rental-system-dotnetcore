using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Car_Rental_System_API
{
    public partial class Vehicle : IEquatable<Vehicle>
    {
        public Vehicle()
        {
            Bookings = new HashSet<Booking>();
            Journeys = new HashSet<Journey>();
            FuelPurchases = new HashSet<FuelPurchase>();
            Services = new HashSet<Service>();
        }

        public ulong Id { get; set; }
        [Required]
        public Guid Uuid { get; set; }
        public string Manufacturer { get; set; }
        public string Model { get; set; }
        public uint Year { get; set; }
        public decimal Odometer { get; set; }
        public string Registration { get; set; }
        public string FuelType { get; set; }
        public decimal TankSize { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<Booking> Bookings { get; set; }
        public virtual ICollection<Journey> Journeys { get; set; }
        public virtual ICollection<FuelPurchase> FuelPurchases { get; set; }
        public virtual ICollection<Service> Services { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as Vehicle);
        }

        public bool Equals([AllowNull] Vehicle other)
        {
            return other != null &&
                   Id == other.Id &&
                   Uuid.Equals(other.Uuid);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Uuid);
        }

        public static bool operator ==(Vehicle left, Vehicle right)
        {
            return EqualityComparer<Vehicle>.Default.Equals(left, right);
        }

        public static bool operator !=(Vehicle left, Vehicle right)
        {
            return !(left == right);
        }
    }
}
