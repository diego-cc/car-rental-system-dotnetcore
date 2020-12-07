using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Car_Rental_System_API
{
    public partial class FuelPurchase : IEquatable<FuelPurchase>
    {
        [Key]
        [Required]
        public ulong Id { get; set; }
        public Guid Uuid { get; set; }
        public ulong BookingId { get; set; }
        public Guid BookingUuid { get; set; }
        public ulong VehicleId { get; set; }
        public Guid VehicleUuid { get; set; }
        public decimal FuelQuantity { get; set; }
        public decimal FuelPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Booking Booking { get; set; }
        public Vehicle Vehicle { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as FuelPurchase);
        }

        public bool Equals([AllowNull] FuelPurchase other)
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

        public static bool operator ==(FuelPurchase left, FuelPurchase right)
        {
            return EqualityComparer<FuelPurchase>.Default.Equals(left, right);
        }

        public static bool operator !=(FuelPurchase left, FuelPurchase right)
        {
            return !(left == right);
        }
    }
}
