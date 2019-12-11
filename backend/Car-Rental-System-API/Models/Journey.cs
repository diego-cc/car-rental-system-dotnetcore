using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Car_Rental_System_API
{
    public partial class Journey : IEquatable<Journey>
    {
        public ulong Id { get; set; }
        public Guid Uuid { get; set; }
        public ulong BookingId { get; set; }
        public Guid BookingUuid { get; set; }
        public ulong VehicleId { get; set; }
        public Guid VehicleUuid { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime EndedAt { get; set; }
        public string JourneyFrom { get; set; }
        public string JourneyTo { get; set; }
        public decimal StartOdometer { get; set; }
        public decimal EndOdometer { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Booking Booking { get; set; }
        public Vehicle Vehicle { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as Journey);
        }

        public bool Equals([AllowNull] Journey other)
        {
            return other != null &&
                   Id == other.Id &&
                   Uuid.Equals(other.Uuid) &&
                   BookingId == other.BookingId &&
                   BookingUuid.Equals(other.BookingUuid) &&
                   VehicleId == other.VehicleId &&
                   VehicleUuid.Equals(other.VehicleUuid);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Uuid, BookingId, BookingUuid, VehicleId, VehicleUuid);
        }

        public static bool operator ==(Journey left, Journey right)
        {
            return EqualityComparer<Journey>.Default.Equals(left, right);
        }

        public static bool operator !=(Journey left, Journey right)
        {
            return !(left == right);
        }
    }
}
