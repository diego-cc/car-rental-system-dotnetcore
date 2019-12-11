using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Car_Rental_System_API
{
    public partial class Booking : IEquatable<Booking>
    {
        public Booking()
        {
            Journeys = new HashSet<Journey>();
            FuelPurchases = new HashSet<FuelPurchase>();
        }

        public ulong Id { get; set; }
        public Guid Uuid { get; set; }
        public ulong VehicleId { get; set; }
        public Guid VehicleUuid { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime EndedAt { get; set; }
        public decimal StartOdometer { get; set; }
        public string Type { get; set; }
        public decimal? Cost { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Vehicle Vehicle { get; set; }
        public virtual ICollection<Journey> Journeys { get; set; }
        public virtual ICollection<FuelPurchase> FuelPurchases { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as Booking);
        }

        public bool Equals([AllowNull] Booking other)
        {
            return other != null &&
                   Id == other.Id &&
                   Uuid.Equals(other.Uuid) &&
                   VehicleId == other.VehicleId &&
                   VehicleUuid.Equals(other.VehicleUuid);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Uuid, VehicleId, VehicleUuid);
        }

        public static bool operator ==(Booking left, Booking right)
        {
            return EqualityComparer<Booking>.Default.Equals(left, right);
        }

        public static bool operator !=(Booking left, Booking right)
        {
            return !(left == right);
        }
    }
}
