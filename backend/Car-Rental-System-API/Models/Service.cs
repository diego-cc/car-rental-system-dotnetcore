using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Car_Rental_System_API
{
    public partial class Service : IEquatable<Service>
    {
        public ulong Id { get; set; }
        public Guid Uuid { get; set; }
        public ulong VehicleId { get; set; }
        public Guid VehicleUuid { get; set; }
        public decimal Odometer { get; set; }
        public DateTime ServicedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Vehicle Vehicle { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as Service);
        }

        public bool Equals([AllowNull] Service other)
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

        public static bool operator ==(Service left, Service right)
        {
            return EqualityComparer<Service>.Default.Equals(left, right);
        }

        public static bool operator !=(Service left, Service right)
        {
            return !(left == right);
        }
    }
}
